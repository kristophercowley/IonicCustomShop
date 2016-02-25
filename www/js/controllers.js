/* global Firebase */
angular.module('app.controllers', [])
    .constant('DBREF', 'https://customshop.firebaseio.com/')

    .controller('loginCtrl', function ($scope, DBREF, AuthService, $state) {
        var db = new Firebase(DBREF)
       
        
        
        //User/Order/Customer schema
        //End User/Order/Customer schema
        $scope.warn = function () {
            alert("If you are not logged into an account, anything you create in this app cannot be saved");
        }
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
                //tests database use
                db.child('wat?').child("WAT").update({ name: "fug", wat: "wat?" });
            }
            console.log(user.email + user.password)
        }
    })

    .controller('t-ShirtDesignerCtrl', function ($scope, $state, ShirtService, $ionicScrollDelegate, DBREF, $firebaseArray) {
        var db = new Firebase(DBREF);
        //Declares orders db and saved projects db
        var ref = new Firebase(DBREF);
        $scope.orders = new $firebaseArray(ref);
        $scope.addOrders = function () {

        }
        $scope.savedOrders = new $firebaseArray(ref);
        $scope.save = function () {
            $scope.savedOrdersName = prompt("Please enter a name for this design, " + $scope.user + "?");
            alert($scope.savedOrdersName + " has allegedly been saved to your account");
            $scope.orders.$add({user: "Mock User Name", shirtColor: "Mock Black", image: "BCW"})
        }
        $scope.user = "Big Daddy";
        $scope.images = ShirtService.images;
        $scope.selectedImage = ShirtService.getLogo();

        $scope.imagePicker = function (i) {
            console.log("Is this working? did you click ", i.name + "?");
            ShirtService.selectedImage = i;
            // console.log(ShirtService.selectedImage);
            // $state.go('tabsController.t-ShirtDesigner');
            $scope.selectedImage = i;
            $ionicScrollDelegate.scrollTop();
        }

       
        // $scope.images = [
        //     {   name: "biohazard",
        //         image:"img/bio.png",
        //         description: "testing1,2,3",
        //         checked: true
        //     },
        //      {   name: "tape",
        //         image:"img/tape.png"
        //     },
        //      {   name: "x",
        //         image:"img/x.png"
        //     },
        //      {   name: "swirl",
        //         image:"img/swirl.png"
        //     },
        //      {   name: "tea",
        //         image:"img/tea.png"
        //     },
        //      {   name: "diamond",
        //         image:"img/diamond.png"
        //     },
        //     {   name: "strange icon",
        //         image:"img/favicon.png"
        //     },
        //      {   name: "bcw1",
        //         image:"img/bcw.png"
        //     },
        //      {   name: "finalunderground",
        //         image:"img/fug.jpg"
        //     },
        //      {   name: "strange logo",
        //         image:"img/strange-logo.png"
        //     }
        // ]
        // $scope.dataBasePush = function(){
        // db.child('data').child('images').set($scope.images)


        // jQuery ui draggable resizable
        $('.image-div').resizable({ aspectRatio: true }).draggable();

        $scope.shirtView = function (view, shirt) {
            if (shirt) {
                $scope.selectedShirt = shirt;
            }

            $scope.shirtViewer = $scope.selectedShirt[view];;
            console.log(view);
        }
        $scope.shirts = [
            {
                color: "Black",
                front: "img/black-shirt.jpg",
                back: "img/black-shirt-back.jpg"
            },
            {
                color: "Grey",
                front: "img/grey-shirt.jpg",
                back: "img/grey-shirt-back.jpg"
            },
            {
                color: "Brown",
                front: "img/brown-shirt.jpg",
                back: "img/brown-shirt-back.jpg"
            },
            {
                color: "Pink",
                front: "img/pink-shirt.jpg",
                back: "img/pink-shirt-back.jpg"
            }
        ];
        // $scope.selectedShirt = $scope.shirts[0];
        $scope.shirtViewer = $scope.shirts[0].front;
        // $scope.shirtViewer;
    })

    .controller('shoppingCartCtrl', function ($scope) {
        $scope.totalPrice = 0;
    })

    .controller('chooseCustomClipArtCtrl', function ($scope) {

    })

    .controller('brandedPrintsCtrl', function ($scope) {

    })

    .controller('tab5DefaultPageCtrl', function ($scope) {

    })
 