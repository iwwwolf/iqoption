'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-clean-css'),
    wait = require('gulp-wait'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    flatten = require('gulp-flatten'),
    gulpPug = require('gulp-pug'),
    webserver = require('gulp-webserver');;

var path = {
    build: { // куда складывать
        html: 'build/',
        js: 'build/js/',
        images: 'build/images/',
        css: 'build/css/',
        fonts: 'build/fonts/'
    },
    src: { // откуда брать
        html: 'assets/index.pug',
        js: 'assets/js/main.js',
        jsLibs: 'assets/libs/js/*.js',
        images: ['assets/images/*.*', 'assets/images/**/*.*'],
        style: 'assets/scss/main.scss',
        styleLibs: 'assets/libs/css/*.css',
        fonts: 'assets/fonts/*.*'
    },
    watch: { // за чем наблюдать
        html: 'assets/components/*.pug',
        js: 'assets/js/main.js',
        jsLibs: 'assets/libs/js/*.js',
        images: 'assets/images/*.*',
        style: 'assets/scss/*.scss',
        styleLibs: 'assets/libs/css/*.css'
    },
    clean: './assets'
};




function log(error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------",
        ("[" + error.name + " in " + error.plugin + "]"),
        error.message,
        "----------ERROR MESSAGE END----------",
        ''
    ].join('\n'));
    this.end();
}

gulp.task('webserver', function() {
  gulp.src('./build')
    .pipe(webserver({
      livereload: true,
      //directoryListing: true,
      open: true
    }));
});


// Собрать Pug в html

gulp.task('html:build', function () {

    //var config = require(__dirname + '/assets/content.json');

    return gulp.src(path.src.html)
    .pipe(gulpPug({
        // pug: pug,
        pretty: true
        //locals: config
    }))
    .on('error', log)
    .pipe(flatten())
    .pipe(gulp.dest(path.build.html))
});


// шрифты

gulp.task('fonts', function() {
  gulp.src(path.src.fonts)
      .pipe(gulp.dest(path.build.fonts))
});


/* собрать скрипты */
gulp.task('js:build', function () {
    gulp.src(path.src.js)
        //.pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(path.build.js))
});
// библиотеки
gulp.task('jsLibs:build', function () {
    gulp.src(path.src.jsLibs)
        .pipe(uglify())
        .pipe(concat('libs.js'))
        .pipe(gulp.dest(path.build.js))
});

/* собрать scss в css */
gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(wait(200))
        .pipe(sass().on('error', sass.logError))
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest(path.build.css))
});

// библиотеки

gulp.task('styleLibs:build', function () {
    gulp.src(path.src.styleLibs)
        .pipe(wait(200))
        .pipe(cssmin())
        .pipe(concat('libs.css'))
        .pipe(gulp.dest(path.build.css))
});


/* сжать картинки */
gulp.task('images:build', function () {
    gulp.src(path.src.images)
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.images))
});

/* собрать всё */
gulp.task('build', [
    'html:build',
    'js:build',
    'jsLibs:build',
    'style:build',
    'styleLibs:build',
    'images:build',
    'webserver',
    'fonts'
]);


/* следить за изменениями */
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.styleLibs], function(event, cb) {
        gulp.start('styleLibs:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch(path.watch.jsLibs, function(event, cb) {
        gulp.start('jsLibs:build');
    });
    watch([path.watch.images], function(event, cb) {
        gulp.start('images:build');
    });
});

gulp.task('default', ['build', 'watch']);
