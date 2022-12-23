var {series, parallel, src, dest, watch} = require('gulp');
var concat = require('gulp-concat');
var clean = require('gulp-clean');

const UTILS = [
	'src/common/store.js'
]

const DNDBEYOND_CHARACTER = [
	...UTILS,
	'src/dndbeyond/utils.js',
	'src/models/character.js',
	'src/dndbeyond/character.js',
	'src/dndbeyond/content.js',
]

const POPUP = [
	...UTILS,
	'popup.js'
]

const cleanDist = () => {
	return src('./dist/', { read: false, allowEmpty: true }).pipe(clean());
}

const build = () => {
	return src(DNDBEYOND_CHARACTER)
			.pipe(concat('dndbeyond_character.js'))
			.pipe(dest('dist/'))
}

const watchSrc = () => {
	watch(DNDBEYOND_CHARACTER, build);
}

exports.build = build;
exports.default = series(cleanDist, build, watchSrc);