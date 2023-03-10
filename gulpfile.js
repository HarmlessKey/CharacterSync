// var {series, parallel, src, dest, watch} = require('gulp');
var gulp = require('gulp');
var gulp_concat = require('gulp-concat');
var gulp_clean = require('gulp-clean');
const gulpClean = require('gulp-clean');

BASE_BUILD = "build/base"

const PATHS = {
	assets: {
		src: "src/assets/**",
		dest: `${BASE_BUILD}/assets`
	},
	css: {
		src: "src/css/**",
		dest: `${BASE_BUILD}/css`
	},
	dist: {
		src: "dist/**",
		dest: `${BASE_BUILD}/content`
	},
	extension: {
		src: "src/extension/**",
		dest: `${BASE_BUILD}/extension`
	},
	lib: {
		src: "lib/**",
		dest: `${BASE_BUILD}/lib`
	},
	background: {
		src: "src/background.js",
		dest: `${BASE_BUILD}`
	},
	index: {
		src: "src/index.html",
		dest: `${BASE_BUILD}`
	},
	manifest: {
		src: "manifest.json",
		dest: `${BASE_BUILD}`
	},
}

const UTILS = [
	'src/common/store.js',
	'src/common/util.js'
]

const TARGETS = {
	'dndbeyond_character': [
		...UTILS,
		'src/content/dndbeyond/utils.js',
		'src/content/models/character.js',
		'src/content/dndbeyond/character.js',
		'src/content/dndbeyond/content.js',
	],
	'dicecloud_character': [
		...UTILS,
		'src/content/models/character.js',
		'src/content/dicecloud/character.js',
		'src/content/dicecloud/content.js',
	],
	'harmlesskey_character': [
		...UTILS,
		'src/content/models/character.js',
		'src/content/harmlesskey/character.js',
		'src/content/harmlesskey/content.js',
	],
}

const targets = {}
for (const target in TARGETS) {
	const task = {
		[target]: () => {
			return gulp.src(TARGETS[target])
				.pipe(gulp_concat(`${target}.js`))
				.pipe(gulp.dest('./dist/'))
		}
	}
	targets[target] = task[target]
	// Add specific task. usage: `npm run gulp harmlesskey_character`
	gulp.task(target, targets[target]);
}

const build_dist = gulp.series(...Object.values(targets));

const copy_dist_nobuild = () =>
	gulp.src("./dist/**").pipe(gulp.dest('./build/base/content/'));

const clean_dist = () =>
	gulp.src('./dist/', { read: false, allowEmpty: true }).pipe(gulp_clean());

const copy_dist = gulp.series(clean_dist, build_dist, copy_dist_nobuild);


const clean_build = () => 
	gulp.src('./build/', {read: false, allowEmpty: true}).pipe(gulpClean());
	
const copy_assets = () => 
	gulp.src(PATHS.assets.src).pipe(gulp.dest(PATHS.assets.dest))

const copy_css = () =>
	gulp.src(PATHS.css.src).pipe(gulp.dest(PATHS.css.dest))

const copy_extension = () =>
	gulp.src(PATHS.extension.src).pipe(gulp.dest(PATHS.extension.dest))
	
const copy_lib = () =>
	gulp.src(PATHS.lib.src).pipe(gulp.dest(PATHS.lib.dest))
	
const copy_background = () =>
	gulp.src(PATHS.background.src).pipe(gulp.dest(PATHS.background.dest))
	
const copy_index = () =>
	gulp.src(PATHS.index.src).pipe(gulp.dest(PATHS.index.dest))
	
const copy_manifest = () => 
	gulp.src(PATHS.manifest.src).pipe(gulp.dest(PATHS.manifest.dest))


const watch_targets = () => {
	for (const target in TARGETS) {
		gulp.watch(TARGETS[target], targets[target]);
	}
	gulp.watch("dist/**", copy_dist_nobuild)
}

const watch = () => {
	watch_targets();
	gulp.watch(PATHS.assets.src, copy_assets)
	gulp.watch(PATHS.css.src, copy_css)
	gulp.watch(PATHS.extension.src, copy_extension)
	gulp.watch(PATHS.lib.src, copy_lib)
	gulp.watch(PATHS.background.src, copy_background)
	gulp.watch(PATHS.index.src, copy_index)
	gulp.watch(PATHS.manifest.src, copy_manifest)
}

const build_base = gulp.parallel([
		copy_dist,
		copy_extension,
		copy_background,
		copy_manifest,
		copy_index,
		copy_assets,
		copy_css,
		copy_lib
	]);

exports.build = gulp.series(clean_build, build_base);
exports.default = gulp.series(clean_build, build_base, watch);