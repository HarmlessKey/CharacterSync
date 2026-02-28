var gulp = require("gulp");
var gulp_concat = require("gulp-concat");
var gulp_clean = require("gulp-clean");
var zip = require("gulp-zip");
var package = require("./package.json");
var fs = require("fs");
var path = require("path");

var package_version = package.version.replaceAll(".", "_");

const BASE_BUILD = "build/base";
const BUILD_INTER = "build/intermediates";
const FIREFOX_BUILD = "build/firefox";

const PATHS = {
	assets:     { src: "src/assets/**",    dest: `${BASE_BUILD}/assets` },
	css:        { src: "src/css/**",       dest: `${BASE_BUILD}/css` },
	extension:  { src: "src/extension/**", dest: `${BASE_BUILD}/extension` },
	lib:        { src: "lib/**",           dest: `${BASE_BUILD}/lib` },
	background: { src: "src/background.js",dest: BASE_BUILD },
	index:      { src: "src/index.html",   dest: BASE_BUILD },
	manifest:   { src: "manifest.json",    dest: BASE_BUILD },
	bridge:     { src: "src/content/bridge/bridge.js", dest: `${BASE_BUILD}/content` },
	readme:     { src: "README.md",        dest: BASE_BUILD },
};

const UTILS = ["src/common/store.js", "src/common/util.js"];

const TARGETS = {
	dndbeyond_character: [
		...UTILS,
		"src/content/dndbeyond/utils.js",
		"src/content/models/character.js",
		"src/content/dndbeyond/character.js",
		"src/content/dndbeyond/content.js",
	],
	dicecloud_character: [
		...UTILS,
		"src/content/models/character.js",
		"src/content/dicecloud/character.js",
		"src/content/dicecloud/content.js",
	],
	shieldmaiden_character: [
		...UTILS,
		"src/content/models/character.js",
		"src/content/shieldmaiden/character.js",
		"src/content/shieldmaiden/content.js",
	],
};

// --- Copy helpers derived from PATHS ---

const copies = Object.fromEntries(
	Object.entries(PATHS).map(([key, { src, dest }]) => [
		key,
		() => gulp.src(src).pipe(gulp.dest(dest)),
	])
);

// --- Content script bundling ---

const targets = {};
for (const target in TARGETS) {
	targets[target] = () =>
		gulp
			.src(TARGETS[target])
			.pipe(gulp_concat(`${target}.js`))
			.pipe(gulp.dest(`${BUILD_INTER}/content/`));
	// Add specific task. usage: `npm run gulp shieldmaiden_character`
	gulp.task(target, targets[target]);
}

const build_content_scripts = gulp.series(...Object.values(targets));
const copy_content_to_base = () =>
	gulp.src(`${BUILD_INTER}/content/**`).pipe(gulp.dest(`${BASE_BUILD}/content/`));
const clean_content = () =>
	gulp.src(`${BUILD_INTER}/content`, { read: false, allowEmpty: true }).pipe(gulp_clean());
const build_content = gulp.series(clean_content, build_content_scripts, copy_content_to_base);

// --- Base build ---

const clean_build = () =>
	gulp.src("./build/", { read: false, allowEmpty: true }).pipe(gulp_clean());

const build_base = gulp.parallel(build_content, ...Object.values(copies));

// --- Manifest helpers ---

const update_manifest_version = (done) => {
	const manifest = JSON.parse(fs.readFileSync("manifest.json"));
	manifest.version = package.version;
	fs.writeFileSync("manifest.json", JSON.stringify(manifest, null, 2));
	done();
};

const strip_localhost = (done) => {
	const manifest_path = `${BASE_BUILD}/manifest.json`;
	const manifest = JSON.parse(fs.readFileSync(manifest_path));
	if (manifest.externally_connectable) {
		manifest.externally_connectable.matches = manifest.externally_connectable.matches.filter(
			(match) => !match.includes("localhost")
		);
	}
	if (manifest.content_scripts) {
		manifest.content_scripts = manifest.content_scripts.map((entry) => ({
			...entry,
			matches: entry.matches.filter((match) => !match.includes("localhost")),
		}));
	}
	fs.writeFileSync(manifest_path, JSON.stringify(manifest, null, 2));
	done();
};

// --- Firefox build ---

const build_firefox_manifest = (done) => {
	const manifest = JSON.parse(fs.readFileSync(`${BASE_BUILD}/manifest.json`));
	manifest.background = { scripts: [manifest.background.service_worker] };
	delete manifest.externally_connectable;
	manifest.browser_specific_settings = {
		gecko: {
			id: "dnd-character-sync@harmlesskey.com",
			data_collection_permissions: { required: ["none"], optional: [] },
		},
	};
	manifest.web_accessible_resources = [
		...(manifest.web_accessible_resources || []),
		{ resources: ["assets/fonts/*"], matches: ["<all_urls>"] },
	];
	fs.mkdirSync(FIREFOX_BUILD, { recursive: true });
	fs.writeFileSync(`${FIREFOX_BUILD}/manifest.json`, JSON.stringify(manifest, null, 2));
	done();
};

const copy_base_to_firefox = () =>
	gulp.src([`${BASE_BUILD}/**`, `!${BASE_BUILD}/manifest.json`]).pipe(gulp.dest(FIREFOX_BUILD));


const fix_firefox_css = (done) => {
	const dir = `${FIREFOX_BUILD}/css/font-awesome`;
	fs.readdirSync(dir).forEach((file) => {
		const p = `${dir}/${file}`;
		const content = fs.readFileSync(p, "utf8");
		fs.writeFileSync(p, content.replaceAll("chrome-extension://", "moz-extension://"));
	});
	done();
};

const build_firefox = gulp.series(
	copy_base_to_firefox,
	fix_firefox_css,
	build_firefox_manifest
);

// --- Zip tasks ---

const zip_base = () =>
	gulp
		.src(`${BASE_BUILD}/**`)
		.pipe(zip(`dndCharacterSync-${package_version}.zip`))
		.pipe(gulp.dest("./dist"));

const zip_firefox = async () => {
	const webExt = require("web-ext").default;
	await webExt.cmd.build(
		{
			sourceDir: path.resolve(FIREFOX_BUILD),
			artifactsDir: path.resolve("./dist"),
			filename: `dndCharacterSync-firefox-${package_version}.zip`,
			overwriteDest: true,
		},
		{ shouldExitProgram: false }
	);
};

const zip_edge = () =>
	gulp
		.src(`${BASE_BUILD}/**`)
		.pipe(zip(`dndCharacterSync-edge-${package_version}.zip`))
		.pipe(gulp.dest("./dist"));

// --- Watch ---

const watch_content_scripts = () => {
	for (const target in TARGETS) {
		gulp.watch(TARGETS[target], targets[target]);
	}
	gulp.watch(`${BUILD_INTER}/content/**`, copy_content_to_base);
};

const watch = () => {
	watch_content_scripts();
	for (const [key, { src }] of Object.entries(PATHS)) {
		gulp.watch(src, copies[key]);
	}
};

const watch_firefox = () => {
	watch();
	gulp.watch(`${BASE_BUILD}/**`, build_firefox);
};

// --- Export pipeline ---

const strip_dev = (done) => {
	const file_path = `${BASE_BUILD}/background.js`;
	const content = fs.readFileSync(file_path, "utf8");
	fs.writeFileSync(
		file_path,
		content.replace(/\s*\/\/ DEV-START[\s\S]*?\/\/ DEV-END\n?/g, "\n")
	);
	done();
};

const strip_firefox_localhost = (done) => {
	const manifest_path = `${FIREFOX_BUILD}/manifest.json`;
	const manifest = JSON.parse(fs.readFileSync(manifest_path));
	manifest.content_scripts = manifest.content_scripts.map((entry) => ({
		...entry,
		matches: entry.matches.filter((match) => !match.includes("localhost")),
	}));
	fs.writeFileSync(manifest_path, JSON.stringify(manifest, null, 2));
	done();
};

const prepare_export = gulp.series(clean_build, update_manifest_version, build_base, strip_localhost, strip_dev);
const export_firefox = gulp.series(build_firefox, strip_firefox_localhost, zip_firefox);

exports.build = gulp.series(clean_build, build_base);
exports["build:firefox"] = gulp.series(clean_build, build_base, build_firefox);
exports.export = gulp.series(prepare_export, zip_base);
exports["export:firefox"] = gulp.series(prepare_export, export_firefox);
exports["export:edge"] = gulp.series(prepare_export, zip_edge);
exports["export:all"] = gulp.series(
	prepare_export,
	gulp.parallel(zip_base, zip_edge, export_firefox)
);
exports.default = gulp.series(clean_build, build_base, watch);
exports["watch:firefox"] = gulp.series(clean_build, build_base, build_firefox, watch_firefox);
