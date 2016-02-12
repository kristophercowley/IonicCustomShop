/* global DBREF */
angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])

.service('AuthService', [function(){
    this.user = {}
     this.getUser = function(){
         return this.user
     }
}]);

