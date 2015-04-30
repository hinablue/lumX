var gulp = require('gulp'),
    minimist = require('minimist'),
    spawn = require('child_process').spawn,
    merge = require('merge-stream'),
    summary = require('jshint-summary'),
    plugins = require('gulp-load-plugins')();

var libs = 'libs';

var paths = {
    js: [
        'core/js/**/*.js',
        'modules/**/*.js'
    ],
    scss: [
        'core/scss/**/*.scss',
        'modules/**/*.scss'
    ],
    templates: [
        'build/js/templates/dropdown_template.js',
        'build/js/templates/file-input_template.js',
        'build/js/templates/text-field_template.js',
        'build/js/templates/search-filter_template.js',
        'build/js/templates/select_template.js',
        'build/js/templates/tabs_template.js',
        'build/js/templates/date-picker_template.js',
        'build/js/templates/time-picker_template.js',
        'build/js/templates/progress_template.js'
    ],
    demo: [
        'demo/**/*',
        '!demo/scss/**/*',
        '!demo/scss'
    ],
    examples: [
        'modules/**/demo/**/*.html'
    ],
    css: ['build/**/*.css'],
    fonts: 'fonts/**/*'
};

function watcherWithCache(name, src, tasks)
{
    var watcher = gulp.watch(src, tasks);
    watcher.on('change', function (event)
    {
        if (event.type === 'deleted')
        {
            delete plugins.cached.caches.scripts[event.path];
            plugins.remember.forget(name, event.path);
        }
    });
}

var knownOptions =
{
    string: 'version',
    default: { version: '' }
};

var options = minimist(process.argv.slice(2), knownOptions);

// Clean
gulp.task('clean:build', function()
{
    return gulp.src('build/*', { read: false })
        .pipe(plugins.plumber())
        .pipe(plugins.rimraf());
});

gulp.task('clean:dist', function()
{
    return gulp.src('dist/*', { read: false })
        .pipe(plugins.plumber())
        .pipe(plugins.rimraf());
});

gulp.task('clean:css', function()
{
    return gulp.src('css/**/*.css', { read: false })
        .pipe(plugins.plumber())
        .pipe(plugins.rimraf());
});


// Develop
gulp.task('lint', function()
{
    return gulp.src(paths.js)
        .pipe(plugins.plumber())
        .pipe(plugins.cached('lint'))
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-summary'))
        .pipe(plugins.jshint.reporter('fail'))
        .pipe(plugins.remember('lint'));
});

gulp.task('scss', function()
{
    return gulp.src('demo/scss/lumx.scss')
        .pipe(plugins.plumber())
        .pipe(plugins.rubySass())
        // Gulp ruby sass doesn't handle disabling css map for Sass 3.4 and after
        .pipe(plugins.removeLines({'filters': [/\/\*# sourceMappingURL=/]}))
        .pipe(gulp.dest('demo/css'));
});


// Dist
gulp.task('scss:move', function()
{
    return gulp.src(['scss/**/*'])
        .pipe(gulp.dest('dist/scss'));
});

gulp.task('scss:paths', ['scss:move'], function()
{
    return gulp.src(['dist/scss/main/_lumx.scss'])
        .pipe(plugins.plumber())
        .pipe(plugins.replace(/..\/..\/libs/g, '../../../..'))
        .pipe(gulp.dest('dist/scss/main'));
});

gulp.task('dist:css', ['scss:paths'], function()
{
    return gulp.src(['scss/main/_lumx.scss'])
        .pipe(plugins.plumber())
        .pipe(plugins.rename('lumx.scss'))
        .pipe(plugins.rubySass())
        .pipe(plugins.minifyCss({ keepSpecialComments: 0 }))
        .pipe(plugins.insert.prepend('/*\n LumX ' + options.version + '\n (c) 2014-' + new Date().getFullYear() + ' LumApps http://ui.lumapps.com\n License: MIT\n*/\n'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('tpl:dropdown', function()
{
    return gulp.src('js/dropdown/**/*.html')
        .pipe(plugins.plumber())
        .pipe(plugins.templatecache({
            output: 'lumx.dropdown.tpl.js',
            moduleName: 'lumx.dropdown',
            strip: 'views/'
        }))
        .pipe(gulp.dest('build/js'));
});

gulp.task('tpl:file-input', function()
{
    return gulp.src('js/file-input/**/*.html')
        .pipe(plugins.plumber())
        .pipe(plugins.templatecache({
            output: 'lumx.file-input.tpl.js',
            moduleName: 'lumx.file-input',
            strip: 'views/'
        }))
        .pipe(gulp.dest('build/js'));
});

gulp.task('tpl:text-field', function()
{
    return gulp.src('js/text-field/**/*.html')
        .pipe(plugins.plumber())
        .pipe(plugins.templatecache({
            output: 'lumx.text-field.tpl.js',
            moduleName: 'lumx.text-field',
            strip: 'views/'
        }))
        .pipe(gulp.dest('build/js'));
});

gulp.task('tpl:search-filter', function()
{
    return gulp.src('js/search-filter/**/*.html')
        .pipe(plugins.plumber())
        .pipe(plugins.templatecache({
            output: 'lumx.search-filter.tpl.js',
            moduleName: 'lumx.search-filter',
            strip: 'views/'
        }))
        .pipe(gulp.dest('build/js'));
});

gulp.task('tpl:select', function()
{
    return gulp.src('js/select/**/*.html')
        .pipe(plugins.plumber())
        .pipe(plugins.templatecache({
            output: 'lumx.select.tpl.js',
            moduleName: 'lumx.select',
            strip: 'views/'
        }))
        .pipe(gulp.dest('build/js'));
});

gulp.task('tpl:tabs', function()
{
    return gulp.src('js/tabs/**/*.html')
        .pipe(plugins.plumber())
        .pipe(plugins.templatecache({
            output: 'lumx.tabs.tpl.js',
            moduleName: 'lumx.tabs',
            strip: 'views/'
        }))
        .pipe(gulp.dest('build/js'));
});

gulp.task('tpl:date-picker', function()
{
    return gulp.src('js/date-picker/**/*.html')
        .pipe(plugins.plumber())
        .pipe(plugins.templatecache({
            output: 'lumx.date-picker.tpl.js',
            moduleName: 'lumx.date-picker',
            strip: 'views/'
        }))
        .pipe(gulp.dest('build/js'));
});

gulp.task('tpl:time-picker', function()
{
    return gulp.src('modules/time-picker/views/*.html')
        .pipe(plugins.plumber())
        .pipe(plugins.templatecache({
            output: 'time-picker_template.js',
            moduleName: 'lumx.time-picker',
            strip: 'views/'
        }))
        .pipe(gulp.dest('build/js/templates'));
});


gulp.task('tpl:progress', function()
{
    return gulp.src('modules/progress/views/*.html')
        .pipe(plugins.plumber())
        .pipe(plugins.templatecache({
            output: 'progress_template.js',
            moduleName: 'lumx.progress',
            strip: 'views/'
        }))
        .pipe(gulp.dest('build/js/templates'));
});

gulp.task('dist:scripts', ['tpl:dropdown', 'tpl:file-input', 'tpl:text-field', 'tpl:search-filter', 'tpl:select', 'tpl:tabs', 'tpl:date-picker', 'tpl:time-picker', 'tpl:progress'], function()
{
    return gulp.src(paths.js)
        .pipe(plugins.plumber())
        .pipe(plugins.concat('lumx.js'))
        .pipe(plugins.insert.prepend('/*\n LumX ' + options.version + '\n (c) 2014-' + new Date().getFullYear() + ' LumApps http://ui.lumapps.com\n License: MIT\n*/\n'))
        .pipe(gulp.dest('dist/js'))
        .pipe(plugins.uglify())
        .pipe(plugins.insert.prepend('/*\n LumX ' + options.version + '\n (c) 2014-' + new Date().getFullYear() + ' LumApps http://ui.lumapps.com\n License: MIT\n*/\n'))
        .pipe(plugins.rename('lumx.min.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('dist:fonts', function()
{
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('watch', ['build'], function()
{
    watcherWithCache('lint', paths.scripts, ['lint']);
    watcherWithCache('scss', [paths.scss, 'demo/scss/**/*.scss'], ['scss']);
    watcherWithCache('demo', paths.demo, ['demo']);
    watcherWithCache('examples', paths.examples, ['examples']);
    watcherWithCache('libs', paths.libs, ['libs']);
    watcherWithCache('tpl:dropdown', 'modules/dropdown/views/*.html', ['tpl:dropdown']);
    watcherWithCache('tpl:file-input', 'modules/file-input/views/*.html', ['tpl:file-input']);
    watcherWithCache('tpl:text-field', 'modules/text-field/views/*.html', ['tpl:text-field']);
    watcherWithCache('tpl:search-filter', 'modules/search-filter/views/*.html', ['tpl:search-filter']);
    watcherWithCache('tpl:select', 'modules/select/views/*.html', ['tpl:select']);
    watcherWithCache('tpl:tabs', 'modules/tabs/views/*.html', ['tpl:tabs']);
    watcherWithCache('tpl:date-picker', 'modules/date-picker/views/*.html', ['tpl:date-picker']);
    watcherWithCache('tpl:time-picker', 'modules/time-picker/views/*.html', ['tpl:time-picker']);
    watcherWithCache('tpl:progress', 'modules/progress/views/*.html', ['tpl:progress']);
});

gulp.task('clean', ['clean:build', 'clean:dist', 'clean:css']);

gulp.task('build', ['lint', 'scss', 'demo', 'examples', 'libs', 'tpl:dropdown', 'tpl:file-input', 'tpl:text-field', 'tpl:search-filter', 'tpl:select', 'tpl:tabs', 'tpl:date-picker', 'tpl:time-picker', 'tpl:progress']);
gulp.task('dist', ['clean:dist'], function()
{
   // Bad practices, but best way to force clean before executing all the tasks
   gulp.start('dist:css');
   gulp.start('dist:scripts');
   gulp.start('dist:fonts');
});

gulp.task('default', ['auto-reload']);
