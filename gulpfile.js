var gulp = require('gulp');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var addSrc = require('gulp-add-src');

var srcDir = 'src/',
destDir = 'public/',
tempDir = '.tmp/';

var clean = function(cb) {
    del(['public'], cb);
};

var makeSass = function() {
    return gulp.src(srcDir + 'styles/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(destDir + 'css/'));
};

var writeScripts = function() {
    return gulp.src(srcDir + 'scripts/*.js')
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(tempDir + 'scripts/'))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(destDir + 'scripts/'));
};

var copyTemplates = function() {
    return gulp.src([srcDir + 'views/*.html', '!' + srcDir + 'views/index.html'])
        .pipe(gulp.dest(destDir + 'views/'));
};

var copyIndexTpl = function() {
    return gulp.src(srcDir + 'views/index.html')
        .pipe(gulp.dest(destDir));
};

gulp.task('lint', function() {
    return gulp.src(srcDir + 'scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

gulp.task('copyIndexTpl', copyIndexTpl);
gulp.task('clean', clean);
gulp.task('sass', makeSass);
gulp.task('scripts', ['lint'], writeScripts);
gulp.task('templates', ['copyIndexTpl'], copyTemplates);

gulp.task('sassForBuild', ['clean'], makeSass);
gulp.task('scriptsForBuild', ['clean', 'lint'], writeScripts);
gulp.task('copyIndexTplForBuild', ['clean'], copyIndexTpl);
gulp.task('templatesForBuild', ['copyIndexTplForBuild'], copyTemplates);

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(srcDir + 'scripts/*.js', ['scripts']);
    gulp.watch(srcDir + 'styles/*.scss', ['sass']);
    gulp.watch(srcDir + 'views/*.html', ['templates']);
});

// build task
gulp.task('build', ['scriptsForBuild', 'sassForBuild', 'templatesForBuild']);

// Default Task
gulp.task('default', ['build', 'watch']);