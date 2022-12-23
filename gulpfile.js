const gulp = require('gulp');
const del = require('del');


const SRC_FILES = {
	dndbeyond_character: [
		'src/models/character.js',
		'src/dndbeyond/character.js',
		'src/dndbeyond/content.js'
	]
}

const targets = {};
for (const target in SRC_FILES) {
	const task = {
		[target]: () => gulp.src(SRC_FILES[target])
			.pipe(concat(`${target}.js`))
			.pipe(gulp.dest("dist"))
	}
}


build = gulp.series(...Object.values(targets))

gulp.task('build', build)

gulp.task('default', gulp.series(['build']))