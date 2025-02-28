var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass')); // Certifique-se de usar a versão correta do Sass

// Tarefa para compilar o Sass
function compileSass() {
    return gulp.src(['node_modules/bootstrap/scss/*.scss', 'src/scss/*.scss'])
        .pipe(sass().on('error', sass.logError)) // Converte o Sass em CSS e exibe erros
        .pipe(gulp.dest('css'));  // Salva o CSS na pasta especificada
}

// Tarefa para observar mudanças nos arquivos SCSS
function watchFiles() {
    gulp.watch(['node_modules/bootstrap/scss/*.scss', 'src/scss/*.scss'], compileSass);
}

// Definir tarefas no Gulp 4
gulp.task('sass', compileSass);
gulp.task('watch', watchFiles);
gulp.task('default', gulp.parallel('sass', 'watch'));
