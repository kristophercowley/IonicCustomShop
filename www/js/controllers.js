/* global Firebase */
angular.module('app.controllers', [])

    .controller('loginCtrl', function ($scope) {
        $scope.login = function (user) {
            console.log(user.username + user.password)
        }
        
        // var db = new Firebase('FBREF')
        // $scope.db.$add({name:'test'})
    })

    .controller('signupCtrl', function ($scope) {
        $scope.signup = function (user) {
            console.log(user.name + user.username + user.password)
        }
    })

    .controller('t-ShirtDesignerCtrl', function ($scope) {
        $scope.test = "Is this working?";
        $scope.shirts = [
            {
                color: "Black",
                photo: "img/black-shirt.jpg"
            },
            {
                color: "Grey",
                photo: "img/grey-shirt.png"
            },
            {
                color: "Brown",
                photo: "img/brown-shirt.png"
            },
            {
                color: "Pink",
                photo: "img/pink-shirt.png"
            }
        ];
        // $scope.shirts.push();
        // console.log($scope.shirts);
        console.log($scope.shirtColor)
        $scope.shirtPicker = function (s) {
            debugger
            console.log(s)
            for (var i = 0; i < $scope.shirts.length; i++) {
                var current = $scope.shirts[i].color;
                if (s == current) {
                    console.log(s)
                }
            }
        }
    })

    .controller('shoppingCartCtrl', function ($scope) {

    })

    .controller('chooseCustomClipArtCtrl', function ($scope) {

    })

    .controller('brandedPrintsCtrl', function ($scope) {

    })

    .controller('tab5DefaultPageCtrl', function ($scope) {

    })
 