const gulp = require('gulp');

const isDevMode = process.env.NODE_ENV === 'development';

require('./templates');
require('./assets');
require('./images');

gulp.task('dev', ['html_dev', 'watch_assets']);
gulp.task('prod', ['html_prod']);
gulp.task('default', isDevMode ? ['dev'] : ['prod']);
