'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano');

var path = {
    build: {
        css: '/'
    },
    src: {
        css: ['/style.scss'],
    }
};

gulp.task('css:build', function () {
    var plugins = [
        autoprefixer({browsers: ['last 2 version']}),
        cssnano()
    ];
    return gulp.src(path.src.css)
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
});

gulp.task('build', function (cb) {
    runSequence('css:build', cb);
});

gulp.task('default', function (cb) {
    runSequence('build', cb);
});