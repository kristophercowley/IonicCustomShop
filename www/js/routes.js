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
          controller: 'shoppingCartCtrl'
        }
      }
    })
        
      
    
      
        
    // .state('tabsController.chooseCustomClipArt', {
    //   url: '/page6',
    //   views: {
    //     'tab6': {
    //       templateUrl: 'templates/chooseCustomClipArt.html',
    //       controller: 't-ShirtDesignerCtrl'
    //     }
    //   }
    // })
        
      
    
      
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
        
      
    
      
        
    .state('tab5DefaultPage', {
      url: '/page8',
      templateUrl: 'templates/tab5DefaultPage.html',
      controller: 'tab5DefaultPageCtrl'
    })
        
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/page1');

});