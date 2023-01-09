// var {series, parallel, src, dest, watch} = require('gulp');
var gulp = require('gulp');
var gulp_concat = require('gulp-concat');
var gulp_clean = require('gulp-clean');

const UTILS = [
	'src/common/store.js',
	'src/common/util.js'
]

const TARGETS = {
	'dndbeyond_character': [
		...UTILS,
		'src/dndbeyond/utils.js',
		'src/models/character.js',
		'src/dndbeyond/character.js',
		'src/dndbeyond/content.js',
	],
	'harmlesskey_character': [
		...UTILS,
		'src/models/character.js',
		'src/harmlesskey/character.js',
		'src/harmlesskey/content.js',
	],
}

const targets = {}
for (const target in TARGETS) {
	const task = {
		[target]: () => {
			return gulp.src(TARGETS[target])
				.pipe(gulp_concat(`${target}.js`))
				.pipe(gulp.dest('dist/'))
		}
	}
	targets[target] = task[target]
	// Add specific task. usage: `npm run gulp harmlesskey_character`
	gulp.task(target, targets[target]);
}


const clean = () => {
	return gulp.src('./dist/', { read: false, allowEmpty: true }).pipe(gulp_clean());
}

const build = async () => {
	return gulp.series(...Object.values(targets))();
}

const watch = () => {
	for (target in TARGETS) {
		gulp.watch(TARGETS[target], targets[target]);
	}
}

const copy_src = () => {
	return gulp.src('./src/**')
		.pipe(gulp.dest('./build/base/src/'))
}

const copy_css = () => {
	return gulp.src('./css/**')
		.pipe(gulp.dest('./build/base/css/'))
}

const copy_assets = () => {
	return gulp.src('./assets/**')
		.pipe(gulp.dest('./build/base/assets/'))
}

const copy_dist_nobuild = () => {
    return gulp.src("./dist/**")
        .pipe(gulp.dest('./build/base/dist/'));
}

gulp.task("copy-dist", gulp.series("build", "copy-dist-nobuild"));

gulp.task('build-base', gulp.parallel([
	'copy-src',
	'copy-dist',
]))


exports.build = build;
exports.default = gulp.series(clean, build, watch);