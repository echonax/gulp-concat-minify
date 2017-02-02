//https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md
var fs = require('fs');
var path = require('path');
var merge = require('merge-stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
//https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md
var del = require('del');
//*****above is imports*********
 
gulp.task('clean', function(cb){
    return del(['./project/**/*'], {dryRun: false, force:true}).then(paths => {
        console.log('Files and folders that would be deleted:\n', paths.join('\n'));
    });
});
 
function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}
 
var scriptsPath = './scripts'; //input dir
var scriptsDestPath = './project'; //output dir
// •folders.map - executes the function once per folder, and returns the async stream -> angular2 map observable
// •merge - combines the streams and ends only when all streams emitted end -> angular2 forkjoin
gulp.task('scripts', ['clean'], function() {
   var folders = getFolders(scriptsPath);
 
   folders.map(function(folder) {
      gulp.src(path.join(scriptsPath, folder, '/**/*.js'))
        // concat into foldername.js
        .pipe(concat(folder + '.js'))
        // write to output
        .pipe(gulp.dest(scriptsPath))
        // minify
        .pipe(uglify())   
        // rename to folder.min.js
        .pipe(rename(folder + '.min.js'))
        // write to output again
        .pipe(gulp.dest(scriptsDestPath))
        .on('end', function(){
            gulp.src(path.join(scriptsDestPath, '/*.js'))
                .pipe(concat('main.js'))
                .pipe(gulp.dest(scriptsDestPath))
                .pipe(uglify())
                .pipe(rename('main.min.js'))
                .pipe(gulp.dest(scriptsDestPath));
        });  
   });
});
 
gulp.task('default', ['clean', 'scripts']);