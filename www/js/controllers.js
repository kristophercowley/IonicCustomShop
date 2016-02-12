/* global Firebase */
angular.module('app.controllers', [])
    .constant('DBREF', 'https://customshop.firebaseio.com/')

    .controller('loginCtrl', function ($scope, DBREF, AuthService, $state) {
        var db = new Firebase(DBREF)
        // var db = AuthService.db();
        $scope.user = AuthService.getUser();
        function handleDBResponse(err, authData) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Login Auth, did we get here?")
            console.log(authData)
            $state.go('tabsController.t-ShirtDesigner')
            //Creates User
            var userToSave = {
                username: $scope.user.email,
                reputation: 0,
                created: Date.now()
            }
            console.log(userToSave)
            //This line saves user to DB
            db.child('users').child(authData.uid).update(userToSave);
        }
        $scope.login = function (user) {
            user ? db.authWithPassword(user, handleDBResponse) : ''
            // console.log(user.email + user.password)
        }
    })

    .controller('signupCtrl', function ($scope, DBREF, AuthService, $firebaseArray, $state) {
        var db = new Firebase(DBREF);
        // var db = AuthService.db();
        $scope.user = AuthService.getUser();
        $scope.signup = function (user) {
            db.createUser(user, handleDBResponse)
            function handleDBResponse(err, authData) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("Signup createUser, did we get here?")
                console.log(authData);
                $state.go('tabsController.t-ShirtDesigner')
                //Creates User
                var userToSave = {
                    username: $scope.user.email,
                    reputation: 0,
                    created: Date.now()
                }
                console.log(userToSave)
                //This line saves user to DB
                db.child('users').child(authData.uid).update(userToSave);
            }
            console.log(user.email + user.password)
        }
    })

    .controller('t-ShirtDesignerCtrl', function ($scope) {
        $scope.test = "Is this working?";


        // $scope.shirtView = function (view) {
        //     console.log($scope.shirtViewer = "selectedShirt" + view);
        //     // $scope.selectedShirt =  view
        //     $scope.shirtViewer = "selectedShirt" + view
        // }
        $scope.shirts = [
            {
                color: "Black",
                photo: "img/black-shirt.jpg",
                photoback: "img/black-shirt-back.jpg"
            },
            {
                color: "Grey",
                photo: "img/grey-shirt.jpg",
                photoback: "img/grey-shirt-back.jpg"
            },
            {
                color: "Brown",
                photo: "img/brown-shirt.jpg",
                photoback: "img/brown-shirt-back.jpg"
            },
            {
                color: "Pink",
                photo: "img/pink-shirt.jpg",
                photoback: "img/pink-shirt-back.jpg"
            }
        ];
        $scope.selectedShirt = $scope.shirts[0];
        // $scope.shirtViewer;
    })

    .controller('shoppingCartCtrl', function ($scope) {

    })

    .controller('chooseCustomClipArtCtrl', function ($scope) {

    })

    .controller('brandedPrintsCtrl', function ($scope) {

    })

    .controller('tab5DefaultPageCtrl', function ($scope) {

    })
 