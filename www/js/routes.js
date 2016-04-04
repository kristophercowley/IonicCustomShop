angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
        
    .state('login', {
      url: '/page1',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })
        
        
    .state('signup', {
      url: '/page2',
      templateUrl: 'templates/signup.html',
      controller: 'signupCtrl'
    })
           
    .state('tabsController.t-ShirtDesigner', {
      url: '/page4',
      views: {
        'tab5': {
          templateUrl: 'templates/t-ShirtDesigner.html',
          controller: 't-ShirtDesignerCtrl'
        }
      }
    })
           
    .state('tabsController.shoppingCart', {
      url: '/page5',
      views: {
        'tab8': {
          templateUrl: 'templates/shoppingCart.html',
           controller:  't-ShirtDesignerCtrl'// 'shoppingCartCtrl'
        }
      }
    })
        
      
      
    .state('tabsController', {
      url: '/page3',
      abstract:true,
      templateUrl: 'templates/tabsController.html'
    })
      
      
        
    .state('tabsController.brandedPrints', {
      url: '/page7',
      views: {
        'tab9': {
          templateUrl: 'templates/brandedPrints.html',
          controller: 'brandedPrintsCtrl'
        }
      }
    })
    
    // Setup for member design page
    .state('tabsController.memberDesigns', {
      url: '/page9',
      views: {
        'tab10': {
          templateUrl: 'templates/memberDesigns.html',
          controller: 't-ShirtDesignerCtrl'
        }
      }
    })
        
      
       
    .state('savePage', {
      url: '/page8',
      templateUrl: 'templates/savePage.html',
      controller: 't-ShirtDesignerCtrl'
    })
        
      
    

  // This is the fallback
  $urlRouterProvider.otherwise('/page1');

});