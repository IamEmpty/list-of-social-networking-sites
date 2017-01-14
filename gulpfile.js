const gulp = require('gulp'),
  plugins = require('gulp-load-plugins')();

const paths = {
  pug: 'index.pug',
  pugWatch: [
    'index.pug',
    'blocks/**/*.pug'
  ],
  stylus: 'main.styl',
  stylusWatch: [
    'main.styl',
    'blocks/**/*.styl'
  ],
  copyCss: ['bower_components/normalize.css/normalize.css'],
  copyStatic: [
    'static/**/*.{ttf,woff,eof,svg,eot}',
    'static/**/*.{png,jpg}'
  ],
  sprite: [
    'bower_components/interjacent/blocks/forms/_date/img/calendar.png',
    'bower_components/interjacent/static/img/icons-source/**/*.png'
  ],
  build: 'build/'
};


// Compile pug files into .html
function html() {
  return gulp.src( paths.pug )
    .pipe(plugins.plumber())
    .pipe(plugins.pug({
      basedir: './',
      pretty: true
    }))
    .pipe(gulp.dest( paths.build ))
}

// Compile .stylus into CSS for development
function css() {
  return gulp.src( paths.stylus )
    .pipe(plugins.plumber())
    .pipe(plugins.stylus({
      'include css': true
    }))
    .pipe(gulp.dest( paths.build + 'css/' ))
}

// Copy stylesheets files into development build folder
function copyCss() {
  return gulp.src( paths.copyCss )
    .pipe( gulp.dest( paths.build + 'css/' ));
}

// Copy files from static into development build folder
function copyStatic() {
  return gulp.src( paths.copyStatic )
    .pipe(gulp.dest( paths.build ));
}

// Copy files into development build folder
const copy = gulp.parallel(copyCss, copyStatic);

// Create common sprite for dellin pages
function sprite() {
  let spriteData =
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
}


// Rerun the task when a file changes
function watch() {
  gulp.watch(paths.pugWatch, html);
  gulp.watch(paths.stylusWatch, css);
}

gulp.task('build', gulp.parallel(html, css, copy));
gulp.task('default', gulp.series('build', watch));

gulp.task('deploy', gulp.series('build', () =>
  gulp.src('./build/**/*')
    .pipe(plugins.ghPages())
));
