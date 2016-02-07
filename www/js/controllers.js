angular.module('app.controllers', [])
  
.controller('loginCtrl', function($scope) {

})
   
.controller('signupCtrl', function($scope) {

})
   
.controller('t-ShirtDesignerCtrl', function($scope) {
        $scope.test = "Is this working?";
        $scope.shirts = [];
        $scope.shirts.push({color:"red",photo:"url"},{color:"black",photo:"url2"},{color:"blue",photo:"url3"},{color:"brown",photo:"url4"},{color:"yellow",photo:"url"});
        console.log($scope.shirts);
})
   
.controller('shoppingCartCtrl', function($scope) {

})
   
.controller('chooseCustomClipArtCtrl', function($scope) {

})
      
.controller('brandedPrintsCtrl', function($scope) {

})
   
.controller('tab5DefaultPageCtrl', function($scope) {

})
 