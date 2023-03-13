// https://stackoverflow.com/questions/17008472/how-to-minify-multiple-javascript-files-in-a-folder-with-uglifyjs
// https://stackoverflow.com/questions/18997852/grunt-js-uglify-is-appending-uglified-code-to-file-instead-of-rewriting-it
https: module.exports = function (grunt) {
  grunt.initConfig({
    uglify: {
      files: {
        options: {
          force: true,
        },
        src: ['src/public/scripts/**/*.js', '!src/public/scripts/**/*.min.js'],
        dest: 'src/public/scripts/',
        expand: true,
        flatten: true,
        ext: '.min.js',
      },
    },
    watch: {
      options: {
        livereload: true,
        nospawn: true,
      },
      js: { files: 'src/public/scripts/*.js', tasks: ['uglify'] },
    },
    copy: {
      main: {
        files: [
          { expand: true, cwd: 'src', src: ['**/public/robots.txt'], dest: 'build', filter: 'isFile' },
          { expand: true, cwd: 'src', src: ['**/tools/plugins/do_not_delete.txt'], dest: 'build', filter: 'isFile' },
          { expand: true, cwd: 'src', src: ['**/tools/themes/do_not_delete.txt'], dest: 'build', filter: 'isFile' },
          { expand: true, cwd: 'src', src: ['**/public/styles/styles.css'], dest: 'build', filter: 'isFile' },
          { expand: true, cwd: 'src', src: ['**/public/scripts/*.min.js'], dest: 'build', filter: 'isFile' },
          { expand: true, cwd: 'src', src: ['**/public/img/**'], dest: 'build' },
          { expand: true, cwd: 'src', src: ['**/admin/**'], dest: 'build' },
          { expand: true, cwd: 'src', src: ['**/tools/themes/**'], dest: 'build' },
        ],
      },
    },
  });

  // load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // register at least this one task
  grunt.registerTask('default', ['uglify']);
};
