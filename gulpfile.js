var gulp                = require('gulp')
var gulpUtil            = require('gulp-util')
var gulpJSHint          = require('gulp-jshint')
var gulpSass            = require('gulp-sass')
var gulpSourcemaps      = require('gulp-sourcemaps')
var gulpAutoprefixer    = require('gulp-autoprefixer')
var gulpConcat          = require('gulp-concat')
var gulpConnect         = require('gulp-connect')
var gulpUglify          = require('gulp-uglify')
var gulpBabel           = require('gulp-babel')
var gulpPlumber         = require('gulp-plumber')

gulp.task('default', ['watch'])

gulp.task('jshint', () => {
    return gulp.src(['js/**/*.js', '!js/**/*.min.js'])
        .pipe(gulpPlumber())
        .pipe(gulpJSHint({
            "asi": true,
            "esversion": 6,
            "strict": false,
            "browser": true,
            "devel": true
        }))
        .pipe(gulpJSHint.reporter('jshint-stylish'))
})

gulp.task('build-sass', () => {
    return gulp.src('sass/**/*.sass')
        .pipe(gulpPlumber())
        .pipe(gulpSourcemaps.init())
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(gulpAutoprefixer())
        .pipe(gulpSourcemaps.write())
        .pipe(gulp.dest('./css'))
        .pipe(gulpConnect.reload())
})

gulp.task('build-js', () => {
    return gulp.src(['js/**/*.js', '!js/**/*.min.js'])
        .pipe(gulpPlumber())
        .pipe(gulpSourcemaps.init())
        .pipe(gulpBabel({
            presets: ['es2015']
        }))
        .pipe(gulpConcat('bundle.min.js'))
        .pipe(gulpUglify())
        .pipe(gulpSourcemaps.write())
        .pipe(gulp.dest('js'))
        .pipe(gulpConnect.reload())
})

gulp.task('watch', () => {
    gulpConnect.server({
        livereload: true
    })
    gulp.watch('js/**/*.js', ['jshint', 'build-js'])
    gulp.watch('sass/**/*.sass', ['build-sass'])
})