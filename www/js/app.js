/* global FBREF */
/* global FBREF */
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules

angular.module('app', ['ionic', 'firebase', 'app.controllers', 'app.routes', 'app.services', 'app.directives','ngQuill','ngSanitize'])


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    // if(window.cordova && window.cordova.plugins.Keyboard) {
    //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    // }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

//https://customshop.firebaseio.com/