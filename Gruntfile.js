(function () {
    "use strict";
    var LIVERELOAD_PORT;

    LIVERELOAD_PORT = 35728;


    module.exports = function (grunt) {
        var yeomanConfig;
        require("load-grunt-tasks")(grunt);
        require("time-grunt")(grunt);
        yeomanConfig = {
            app: "client",
            dist: "dist"
        };

        grunt.initConfig({
            yeoman: yeomanConfig,
            watch: {
                less: {
                    files: ["<%= yeoman.app %>/styles/**/*.less"],
                    tasks: ["less:server"]
                },
                livereload: {
                    options: {
                        livereload: LIVERELOAD_PORT
                    },
                    files: ["<%= yeoman.app %>/index.html", "<%= yeoman.app %>/views/**/*.html", "<%= yeoman.app %>/styles/**/*.less", ".tmp/styles/**/*.css", "{.tmp,<%= yeoman.app %>}/scripts/**/*.js", "<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}"]
                }
            },
            // The actual grunt server settings
            connect: {
                options: {
                    port: 8080,
                    // Change this to '0.0.0.0' to access the server from outside.
                    hostname: 'localhost',
                    livereload: 35729
                },
                livereload: {
                    options: {
                        open: true,
                        middleware: function (connect) {
                            return [
                                connect.static('.tmp'),
                                connect().use(
                                    '/bower_components',
                                    connect.static('./bower_components')
                                ),
                                connect.static(yeomanConfig.app)
                            ];
                        }
                    }
                },
                test: {
                    options: {
                        port: 9001,
                        middleware: function (connect) {
                            return [
                                connect.static('.tmp'),
                                connect.static('test'),
                                connect().use(
                                    'bower_components',
                                    connect.static('./bower_components')
                                ),
                                connect.static(yeomanConfig.app)
                            ];
                        }
                    }
                },
                dist: {
                    options: {
                        open: true,
                        base: '<%= yeoman.dist %>'
                    }
                }
            },
            open: {
                server: {
                    url: "http://localhost:<%= connect.options.port %>"
                }
            },
            clean: {
                dist: {
                    files: [
                        {
                            dot: true,
                            src: [".tmp", "<%= yeoman.dist %>/*", "!<%= yeoman.dist %>/.git*"]
                        }
                    ]
                },
                server: ".tmp"
            },
            jshint: {
                options: {
                    jshintrc: ".jshintrc"
                },
                all: ["Gruntfile.js", "<%= yeoman.app %>/scripts/**/*.js"]
            },
            karma: {
                unit: {
                    options: {
                        configFile: 'test/karma.conf.js',
                        singleRun: true
                    }
                }
            },
            less: {
                server: {
                    options: {
                        strictMath: true,
                        dumpLineNumbers: true,
                        sourceMap: true,
                        sourceMapRootpath: "",
                        outputSourceFiles: true
                    },
                    files: [
                        {
                            expand: true,
                            cwd: "<%= yeoman.app %>/styles",
                            src: "main.less",
                            dest: ".tmp/styles",
                            ext: ".css"
                        }
                    ]
                },
                dist: {
                    options: {
                        cleancss: true,
                        report: 'min'
                    },
                    files: [
                        {
                            expand: true,
                            cwd: "<%= yeoman.app %>/styles",
                            src: "main.less",
                            dest: ".tmp/styles",
                            ext: ".css"
                        }
                    ]
                }
            },
            useminPrepare: {
                html: "<%= yeoman.app %>/index.html",
                options: {
                    dest: "<%= yeoman.dist %>",
                    flow: {
                        steps: {
                            js: ["concat"],
                            css: ["concat"]
                        },
                        post: []
                    }
                }
            },
            usemin: {
                html: ["<%= yeoman.dist %>/**/*.html", "!<%= yeoman.dist %>/bower_components/**"],
                css: ["<%= yeoman.dist %>/styles/**/*.css"],
                options: {
                    dirs: ["<%= yeoman.dist %>"]
                }
            },
            htmlmin: {
                dist: {
                    options: {},
                    files: [
                        {
                            expand: true,
                            cwd: "<%= yeoman.app %>",
                            src: ["*.html", "views/*.html"],
                            dest: "<%= yeoman.dist %>"
                        }
                    ]
                }
            },
            copy: {
                dist: {
                    files: [
                        {
                            expand: true,
                            dot: true,
                            cwd: "<%= yeoman.app %>",
                            dest: "<%= yeoman.dist %>",
                            src: ["favicon.ico", "bower_components/font-awesome/css/*", "bower_components/font-awesome/fonts/*", "bower_components/weather-icons/css/*", "bower_components/weather-icons/font/*", "fonts/**/*", "i18n/**/*", "images/**/*", "styles/bootstrap/**/*", "styles/fonts/**/*", "styles/img/**/*", "styles/ui/images/**/*", "views/**/*"]
                        },
                        {
                            expand: true,
                            cwd: ".tmp",
                            dest: "<%= yeoman.dist %>",
                            src: ["styles/**", "assets/**"]
                        },
                        {
                            expand: true,
                            cwd: ".tmp/images",
                            dest: "<%= yeoman.dist %>/images",
                            src: ["generated/*"]
                        }
                    ]
                },
                styles: {
                    expand: true,
                    cwd: "<%= yeoman.app %>/styles",
                    dest: ".tmp/styles/",
                    src: "**/*.css"
                }
            },
            concurrent: {
                server: ["less:server", "copy:styles"],
                test: ["less:server", "copy:styles"],
                dist: ["less:dist", "copy:styles", "htmlmin"]
            },
            concat: {
                options: {
                    separator: grunt.util.linefeed + ';' + grunt.util.linefeed
                }
            },
            uglify: {
                options: {
                    mangle: false,
                    compress: {
                        drop_console: true
                    }
                },
                dist: {
                    files: {
                        "<%= yeoman.dist %>/scripts/app.js": [".tmp/**/*.js", "<%= yeoman.app %>/scripts/**/*.js"]
                    }
                }
            }
        });
        grunt.registerTask('test', [
            'clean:server',
            'concurrent:test',
            'connect:test',
            'karma'
        ]);
        grunt.registerTask("server", function (target) {
            if (target === "dist") {
                return grunt.task.run(["build", "open", "connect:dist:keepalive"]);
            }
            return grunt.task.run(["clean:server", "concurrent:server", "connect:livereload", "open", "watch"]);
        });

        grunt.registerTask("build", ["clean:dist", "useminPrepare", "concurrent:dist", "copy:dist", "concat", "uglify", "usemin"]);
        return grunt.registerTask("default", ["server"]);
    };

}).call(this);
