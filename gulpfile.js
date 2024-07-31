// Initialize modules
const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssNano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();


// Sass Task
function scssTask() {
    return src('app/scss/style.scss', { sourcemaps: true })
      .pipe(sass().on('error', sass.logError)) // Handle Sass errors
      .pipe(postcss([autoprefixer(), cssNano()]))
      .pipe(dest('dist', { sourcemaps: '.' }));
  }

// JavaScript Task
function jsTask() {
  return src('app/js/main.js', { sourcemaps: true })
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// BrowserSync
function browserSyncServe(cb) {
  browserSync.init({
    server: {
      baseDir: '.',
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: '0',
      },
    },
  });
  cb;
}
function browserSyncReload(cb) {
  browserSync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch('*.html', browserSyncReload);
  watch(
    ['app/scss/**/*.scss', 'app/**/*.js'],
    series(scssTask, jsTask, browserSyncReload)
  );
}

// Default Gulp Task
exports.scssTask = scssTask;
exports.jsTask = jsTask;
exports.watchTask = watchTask;


exports.default = parallel(series(scssTask, jsTask, browserSyncServe),watchTask);

// Build Gulp Task
exports.build = series(scssTask, jsTask);