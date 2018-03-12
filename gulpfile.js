const gulp = require('gulp');
const ts = require('gulp-typescript');
const clean = require('gulp-clean');

gulp.task('build', function() {
    const merge = require('merge2');
    const tsProject = ts.createProject('tsconfig-prod-build.json');

    var tsResult = tsProject.src()
        .pipe(tsProject());

    return merge([
        tsResult.dts.pipe(gulp.dest('./ngx-paypal-dist')),
        tsResult.js.pipe(gulp.dest(tsProject.config.compilerOptions.outDir))
    ]);
});

gulp.task('clean', function () {
    return gulp.src(['ngx-paypal-dist', 'ngx-paypal-dist'], { read: false })
        .pipe(clean())
});


