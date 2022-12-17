// https://stackoverflow.com/questions/17008472/how-to-minify-multiple-javascript-files-in-a-folder-with-uglifyjs
module.exports = function (grunt) {
  grunt.initConfig({
    uglify: {
      files: {
        src: 'src/public/scripts/*.js',
        dest: 'src/public/scripts/',
        expand: true,
        flatten: true,
        ext: '.min.js',
      },
    },
    watch: {
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
