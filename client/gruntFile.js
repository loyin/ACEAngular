module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-docular');
  // Default task.
  grunt.registerTask('default', ['jshint','build','karma:unit']);
  //grunt.registerTask('build', ['clean','html2js','concat','recess:build','copy:assets']);
  grunt.registerTask('build', ['clean','html2js','concat','copy:assets','less:dev']);
  grunt.registerTask('release', ['clean','html2js','uglify','jshint','karma:unit','concat:index', 'recess:min','copy:assets']);
  grunt.registerTask('test-watch', ['karma:watch']);

  //LESS TASKS
  // grunt.registerTask('default', ['less']);
  // grunt.registerTask('production',['less:production']);
  // grunt.registerTask('dev',['less:dev']);

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  var karmaConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, keepalive: true };
    var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  //DOCULAR TASK
  grunt.registerTask('documentation', ['docular']);

  // Project configuration.
  grunt.initConfig({
    distdir: 'dist',
    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
    ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
    src: {
      js: ['src/**/*.js', '<%= distdir %>/templates/**/*.js'],
      specs: ['test/**/*.spec.js'],
      scenarios: ['test/**/*.scenario.js'],
      html: ['src/index.html'],
      tpl: {
        app: ['src/app/**/*.tpl.html'],
        common: ['src/common/**/*.tpl.html']
      },
      //less: ['src/less/stylesheet.less'], // recess:build doesn't accept ** in its file patterns
      // less: ['vendor/bootstrap-3.2.0/less/bootstrap.less'],
      // lessWatch: ['src/less/**/*.less']

    },
    docular: {
    groups: [
          {
              groupTitle: 'FrameWorkCoppel',
              groupId: 'framework',
              groupIcon: 'icon-beer',
              sections: [
                  {
                      id: "servicios",
                      title: "Servicios",
                      docs: ["code"],
                      scripts: ["src/"]
                  }
              ]
          }
      ],
      showDocularDocs: true,
      showAngularDocs: true
    },
    less: {
        dev:{
          options:{
            paths: ["assets"],
            sourceMap:true,
            dumpLineNumbers: 'comments',
            relativeUrls:true
          },
          files:{
            //'<%= distdir %>/bootstrap.debug.css':'vendor/bootstrap-3.2.0/less/bootstrap.less'
            '<%= distdir %>/bootstrap.debug.css':'vendor/coppel-ace/css/less/ace.less'
          }
        },
        production:{
          options:{
            paths: ["assets"],
            cleancss:true,
            compress:true,
            relativeUrls:true
          },
          files:{
            //'<%= distdir %>/bootstrap.css':'vendor/bootstrap-3.2.0/less/bootstrap.less'
          }
        }
      },
    clean: ['<%= distdir %>/*'],
    copy: {
      assets: {
        files: [{ dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src/assets/' },{ dest: '<%= distdir %>/assets', src : '**', expand: true, cwd: 'vendor/coppel-ace/' }]
      }
    },
    karma: {
      unit: { options: karmaConfig('test/config/unit.js') },
      watch: { options: karmaConfig('test/config/unit.js', { singleRun:false, autoWatch: true}) }
    },
    html2js: {
      app: {
        options: {
          base: 'src/app'
        },
        src: ['<%= src.tpl.app %>'],
        dest: '<%= distdir %>/templates/app.js',
        module: 'templates.app'
      },
      common: {
        options: {
          base: 'src/common'
        },
        src: ['<%= src.tpl.common %>'],
        dest: '<%= distdir %>/templates/common.js',
        module: 'templates.common'
      }
    },
    concat:{
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.js %>'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      },
      index: {
        src: ['src/index.html'],
        dest: '<%= distdir %>/index.html',
        options: {
          process: true
        }
      },
      angular: {
        src:['vendor/angular/angular-1.2.18.js', 'vendor/angular/angular.route.js', 'vendor/angular/angular.resource.js','vendor/angular/angular-sanitize.js'],
        dest: '<%= distdir %>/angular.js'
      },
      // mongo: {
      //   src:['vendor/mongolab/*.js'],
      //   dest: '<%= distdir %>/mongolab.js'
      // },
      bootstrap: {
       src:['vendor/angular-ui/ui-bootstrap-tpls-0.11.0.min.js','vendor/angular-ui/ng-grid.js','vendor/angular-ui/ng-grid-layout.js'],
        dest: '<%= distdir %>/ui-bootstrap.js'
      },
      uiutils:{
        src:['vendor/angular-ui/ui-utils.js'],
        dest:'<%= distdir %>/ui-utils.js'
      },
      // bootstrap3: {
      //   src:['vendor/coppel-ace/js/uncompressed/bootstrap.js'],
      //   dest: '<%= distdir %>/bootstrap3.js'
      // },
      jquery: {
        src:['vendor/coppel-ace/js/jquery-1.10.2.min.js'],
        dest: '<%= distdir %>/jquery.js'
      },
      angularstorage: {
        src:['vendor/angular/angular.local.storage.js'],
        dest: '<%= distdir %>/angular-local-storage.js'
      },
      angulartree:{
        src:['vendor/angular-treecontrol/angular-tree-control.js'],
        dest: '<%= distdir %>/angular-tree-control.js'
      }
      // angularstrap: {
      //   src:['vendor/angular-strap/angular-strap.min.js','vendor/angular-strap/angular.strap.tpl.min.js'],
      //   dest: '<%= distdir %>/angular-strap-full.js'
      // }
    },
    uglify: {
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.js %>'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      },
      angular: {
        src:['<%= concat.angular.src %>'],
        dest: '<%= distdir %>/angular.js'
      }
      // mongo: {
      //   src:['vendor/mongolab/*.js'],
      //   dest: '<%= distdir %>/mongolab.js'
      // },
      // bootstrap: {
      //   src:['vendor/angular-ui/bootstrap/*.js'],
      //   dest: '<%= distdir %>/bootstrap.js'
      // },
      // jquery: {
      //   src:['vendor/jquery/*.js'],
      //   dest: '<%= distdir %>/jquery.js'
      // }
    },
    // recess: {
    //   build: {
    //     files: {
    //       '<%= distdir %>/<%= pkg.name %>.css':
    //       ['<%= src.less %>'] },
    //     options: {
    //       compile: true
    //     }
    //   },
    //   min: {
    //     files: {
    //       '<%= distdir %>/<%= pkg.name %>.css': ['<%= src.less %>']
    //     },
    //     options: {
    //       compress: true
    //     }
    //   }
    // },
    watch:{
      all: {
        files:['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
        tasks:['default','timestamp']
      },
      build: {
        files:['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
        tasks:['build','timestamp']
      }
    },
    jshint:{
      files:['gruntFile.js', '<%= src.js %>', '<%= src.specs %>', '<%= src.scenarios %>'],
      options:{
        curly:true,
        eqeqeq:true,
        immed:true,
        latedef:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true,
        globals:{}
      }
    }
  });
};
