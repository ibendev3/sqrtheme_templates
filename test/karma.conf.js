module.exports = function (config) {
    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'client/bower_components/angular/angular.js',
            'client/bower_components/angular-mocks/angular-mocks.js',
            'client/bower_components/angular-animate/angular-animate.js',
            'client/bower_components/angular-cookies/angular-cookies.js',
            'client/bower_components/angular-resource/angular-resource.js',
            'client/bower_components/angular-route/angular-route.js',
            'client/bower_components/angular-sanitize/angular-sanitize.js',
            'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'client/bower_components/jquery.easy-pie-chart/dist/angular.easypiechart.min.js',
            'client/bower_components/angular-wizard/dist/angular-wizard.min.js',
            'client/bower_components/textAngular/dist/textAngular.min.js',
            'client/bower_components/textAngular/dist/textAngular-sanitize.min.js',
            'client/bower_components/angular-ui-tree/dist/angular-ui-tree.min.js',
            'client/bower_components/angularjs-google-maps/dist/ng-map.min.js',
            'client/bower_components/ng-tags-input/ng-tags-input.min.js',
            'client/scripts/**/*.js',
            'test/spec/**/*.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            'Chrome'
        ],

        // Which plugins to enable
        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine'
        ],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        proxies: {
            '/': 'http://localhost:9001/'
        },
        // URL root prevent conflicts with the site root
         urlRoot: '_karma_'
    });
};
