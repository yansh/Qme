// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',
    'ionic.service.core',
    'toaster',
    'ionic.service.push', 'starter.controllers', 'starter.services', 
    'ngCordova'])

    .run(function ($ionicPlatform,$rootScope, $ionicHistory, $state) {

        $ionicPlatform.ready(function () {
            
           window.plugins.webintent.getExtra(window.plugins.webintent.EXTRA_TEXT,
             function (url) {
             
             $state.go('ask');
               // url is the value of EXTRA_TEXT
              // $scope.data.question = url;
              //alert("Got it!:"+url);
             }, function () {
               // There was no extra supplied.
             }
             );
             
        });            
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider) {
        $ionicConfigProvider.tabs.position('bottom');        
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
        // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            })
            .state('ask', {
                url: '/ask',
                templateUrl: 'templates/ask.html',
                controller: 'AskCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })
            .state('tab.public', {
                url: '/public',
                views: {
                    'tab-public': {
                        templateUrl: 'templates/public.html',
                        controller: 'PublicCtrl'
                    }
                }
            })            
            .state('tab.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/main.html',
                        controller: 'MainCtrl'
                    }
                }
            })
            .state('questions', {
                url: '/questions/:qId',
                templateUrl: 'templates/question-detail.html',
                controller: 'QuestionCtrl'

            })
            .state('public-questions', {
                url: '/public/questions',
                templateUrl: 'templates/public.html',
                controller: 'PublicCtrl'

            })            
            .state('tab.asked', {
                url: '/asked',
                views: {
                    'tab-asked': {
                        templateUrl: 'templates/tab-asked.html',
                        controller: 'AskedTabCtrl'
                    }
                }
            })
            .state('tab.answered', {
                url: '/answered',
                views: {
                    'tab-answered': {
                        templateUrl: 'templates/tab-answered.html',
                        controller: 'AnsweredCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/public/questions');

    });
