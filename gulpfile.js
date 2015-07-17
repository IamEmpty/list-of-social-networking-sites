var gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  plumber = require('gulp-plumber'),
  spritesmith = require('gulp.spritesmith'),
  jade = require('gulp-jade'),
  open = require('gulp-open');

var paths = {
  jade: 'index.jade',
  jadeWatch: [
    'index.jade',
    'blocks/**/*.jade'
  ],
  stylus: 'main.styl',
  stylusWatch: [
    'main.styl',
    'blocks/**/*.styl'
  ],
  copyCss: [ 'bower_components/normalize.css/normalize.css', ],
  copyStatic: [
    'bower_components/axshare-nav/**/*.{ttf,woff,eof,svg,eot}'
  ],
  sprite: [
    'bower_components/interjacent/blocks/forms/_date/img/calendar.png',
    'bower_components/interjacent/static/img/icons-source/**/*.png'
  ],
  build: 'build/'
};


// Compile .jade into .html for development
gulp.task( 'html', function() {
  return gulp.src( paths.jade )
    .pipe(plumber())
    .pipe(jade({
      basedir: './',
      pretty: true
    }))
    .pipe(gulp.dest( paths.build ))
});

// Compile .stylus into CSS for development
gulp.task( 'css', function() {
  return gulp.src( paths.stylus )
    .pipe(plumber())
    .pipe(stylus({
      'include css': true
    }))
    .pipe(gulp.dest( paths.build + 'css/' ))
});


// Copy files into development build folder
gulp.task( 'copy', [ 'copy-css', 'copy-static' ]);

  // Copy stylesheets files into development build folder
  gulp.task( 'copy-css', function() {
    gulp.src( paths.copyCss )
      .pipe( gulp.dest( paths.build + 'css/' ));
  });

  // Copy files from static into development build folder
  gulp.task( 'copy-static', function() {
    gulp.src( paths.copyStatic )
      .pipe(gulp.dest( paths.build ));
  });


// Create common sprite for dellin pages
gulp.task( 'sprite', function() {

  var spriteData =
    gulp.src( paths.sprite ) // path to images for sprite
      .pipe(spritesmith({
        imgName: 'icon-sprite.png',
        imgPath: '/img/sprites/icon-sprite.png',
        cssName: '_icon-sprite.styl',
        cssVarMap: function (sprite) {
          sprite.name = 'icon-' + sprite.name;
        }
      }));

  spriteData.img.pipe(gulp.dest( 'static/img/sprites' ));           // path for images
  spriteData.css.pipe(gulp.dest( 'public/stylesheets/partials' ));  // path for stylesheets
});


// Rerun the task when a file changes
gulp.task( 'watch', function() {
  gulp.watch( paths.jadeWatch, [ 'html' ]);
  gulp.watch( paths.stylusWatch, [ 'css' ]);
});


gulp.task( 'build', [ 'html', 'css', 'copy' ] );
gulp.task( 'default', [ 'build', 'watch' ] );
