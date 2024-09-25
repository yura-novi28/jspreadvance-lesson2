const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const del = require('del');

// pug to html

const html = () => {
    return gulp.src('./src/pug/*.pug')
        .pipe(pug( {pretty: true} ))
        .pipe(gulp.dest('build'))
}

// scss to css

const styles = () => {
    return gulp.src('./src/styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename( {suffix: '.min'} ))
        .pipe(gulp.dest('build/css'))
}

const family = () => {
    return gulp.src('./src/styles/fonts/**/*', {
        encoding: false
    })
        .pipe(gulp.dest('./build/css/fonts/'))
}

// images min

const images = () => {
    return gulp.src('./src/images/*.*', {
        encoding: false
    })
        .pipe(imagemin())
        .pipe(gulp.dest('build/images'))
}


// server

const server = () => {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        notify: false
    })
    browserSync.watch('build', browserSync.reload)
}

// delete

const deleteBuild = (cb) => {
    return del('build/**/*.*').then(() => cb())
}

// watch

const watch = () => {
    gulp.watch('src/pug/**/*.pug', html);
    gulp.watch('src/styles/**/*.scss', styles);
    gulp.watch('src/images/*.*', images);
}

// exports

exports.default = gulp.series(
    deleteBuild,
    gulp.parallel(html, styles, images, family),
    gulp.parallel(watch, server)
)