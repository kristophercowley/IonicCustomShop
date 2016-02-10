/* global Firebase */
angular.module('app.controllers', [])
    .constant('DBREF', 'https://customshop.firebaseio.com/')

    .controller('loginCtrl', function ($scope, DBREF, AuthService) {

        var db = new Firebase(DBREF)
        $scope.login = function (user) {
            user ? db.authWithPassword(user, handleDBResponse) : ''
            // console.log(user.email + user.password)
        }
        function handleDBResponse(err, authData) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Login Auth, did we get here?")
            console.log(authData)
        }
    })

    .controller('signupCtrl', function ($scope, DBREF, AuthService) {
        var db = new Firebase(DBREF)
        $scope.signup = function (user) {
            db.createUser(user, handleDBResponse)
            function handleDBResponse(err, authData) {
                if (err) {
                    // console.log(err);
                    return;
                }
                console.log("Signup createUser, did we get here?")
                console.log(authData);
            }
            // console.log(user.email + user.password)
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
        $scope.selectedShirt = $scope.shirts[0];
    })

    .controller('shoppingCartCtrl', function ($scope) {

    })

    .controller('chooseCustomClipArtCtrl', function ($scope) {

    })

    .controller('brandedPrintsCtrl', function ($scope) {

    })

    .controller('tab5DefaultPageCtrl', function ($scope) {

    })
 