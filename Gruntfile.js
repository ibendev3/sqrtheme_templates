(function () {
    "use strict";
    var LIVERELOAD_PORT, lrSnippet, mountFolder;

    LIVERELOAD_PORT = 35728;

    lrSnippet = require("connect-livereload")({
        port: LIVERELOAD_PORT
    });

    mountFolder = function (connect, dir) {
        return connect["static"](require("path").resolve(dir));
    };

    module.exports = function (grunt) {
        var yeomanConfig;
        require("load-grunt-tasks")(grunt);
        require("time-grunt")(grunt);
        yeomanConfig = {
            app: "client",
            dist: "dist"
        };
        try {
            yeomanConfig.app = require("./bower.json").appPath || yeomanConfig.app;
        } catch (_error) {
        }
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
            connect: {
                options: {
                    port: 8000,
                    hostname: "localhost"
                },
                livereload: {
                    options: {
                        middleware: function (connect) {
                            return [lrSnippet, mountFolder(connect, ".tmp"), mountFolder(connect, yeomanConfig.app)];
                        }
                    }
                },
                test: {
                    options: {
                        middleware: function (connect) {
                            return [mountFolder(connect, ".tmp"), mountFolder(connect, "test")];
                        }
                    }
                },
                dist: {
                    options: {
                        middleware: function (connect) {
                            return [mountFolder(connect, yeomanConfig.dist)];
                        }
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
