/**
 * How to run grunt tasks:
 *   - At project root, run 'npm install' - It will install nodedependencies declared in package,json in <root>/.node_modules
 *   - install grunt CLI tools globally, run 'npm install -g grunt-cli'
 *   - run a grunt target defined in Gruntfiles.js, ex: 'grunt lint'
 *
 * Note: The 'ghost' grunt task have special deps on CasperJS and phantomjs.
 *       For now, It's configured to run only on TravisCI where these deps are
 *       correctly defined.
 *       If you run this task locally, it may require some env set up first.
 */

module.exports = function(grunt) {

  grunt.initConfig({
    clean: {
      before: ['dest']
    },
    jshint: {
      options: {
        indent:2,
        undef : true,
        latedef : true,
        browser : true,
        trailing : true,
        curly : true,
        es3 : true,
        globals : {'$':true, 'jQuery' : true, 'pskl':true, 'Events':true, 'Constants':true, 'console' : true, 'module':true, 'require':true}
      },
      files: [
        'Gruntfile.js',
        'package.json',
        'src/js/**/*.js',
        '!src/js/lib/**/*.js' // Exclude lib folder (note the leading !)
      ]
    },
    express: {
      regular: {
        options: {
          port: 9051,
          hostname : 'localhost',
          bases: ['dest']
        }
      },
      debug: {
        options: {
          port: 9951,
          hostname : 'localhost',
          bases: ['src']
        }
      }
    },
    open : {
      regular : {
        path : 'http://localhost:9051/'
      },
      debug : {
        path : 'http://localhost:9951/?debug'
      }
    }
  });

  grunt.config.set('leadingIndent.indentation', 'spaces');
  grunt.config.set('leadingIndent.jsFiles', {
    src: [
      'src/js/**/*.js',
      '!src/js/lib/**/*.js'
    ]
  });
  grunt.config.set('leadingIndent.cssFiles', {
    src: ['src/css/**/*.css']
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-leading-indent');

  // Validate
  grunt.registerTask('lint', ['leadingIndent:jsFiles', 'leadingIndent:cssFiles', 'jshint']);

  // Validate & Test
  grunt.registerTask('test', ['lint']);

  // Start webserver on src folder, in debug mode
  grunt.registerTask('server', ['express:debug', 'open:debug', 'express-keepalive']);
};
