// gulp
var gulp = require('gulp');
// modules
var fs = require('fs');

gulp.task('help', function() {
  var displayHelp = require(process.cwd() + '/lib/jhipsteruml/help').displayHelp
  return displayHelp();
});

gulp.task('version', function() {
  var displayVersion = require(process.cwd() + '/lib/jhipsteruml/version').displayVersion
  return displayVersion();
});

gulp.task('gen-sql', function() {
  var jhu = require(process.cwd() + '/lib/jhipsteruml').generateAll
/*
  gulp
    .pipe(jhu()).on('error', function(error) {
      // we have an error
      done(error); 
    })
    .on('end', function() {
      // in case of success
      done();
    });
*/
  return jhu();
});

gulp.task('gen', ['gen-sql']);
