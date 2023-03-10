// var {series, parallel, src, dest, watch} = require('gulp');
var gulp = require('gulp');
var gulp_concat = require('gulp-concat');
var gulp_clean = require('gulp-clean');
const gulpClean = require('gulp-clean');

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

const copy_css = () =>
	gulp.src('./src/css/**').pipe(gulp.dest('./build/base/css/'))

const copy_assets = () => 
	gulp.src('./src/assets/**').pipe(gulp.dest('./build/base/assets/'))

const copy_ext = () =>
gulp.src('./src/extension/**').pipe(gulp.dest('./build/base/extension/'))

const copy_lib = () =>
	gulp.src('./lib/**').pipe(gulp.dest('./build/base/lib/'))

const copy_background = () =>
	gulp.src('./src/background.js').pipe(gulp.dest('./build/base/'))
	
const copy_index = () =>
	gulp.src('./src/index.html').pipe(gulp.dest('./build/base/'))
	
const copy_manifest = () => 
	gulp.src('manifest.json').pipe(gulp.dest('./build/base/'))


const watch_targets = () => {
	for (const target in TARGETS) {
		gulp.watch(TARGETS[target], targets[target]);
	}
}

const build_base = gulp.parallel([
		copy_dist,
		copy_ext,
		copy_background,
		copy_manifest,
		copy_index,
		copy_assets,
		copy_css,
		copy_lib
	]);

exports.build = gulp.series(clean_build, build_base);
exports.default = gulp.series(clean_dist, build_base, watch);