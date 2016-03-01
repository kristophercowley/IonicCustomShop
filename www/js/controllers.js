/* global Firebase */
angular.module('app.controllers', [])
    .constant('DBREF', 'https://customshop.firebaseio.com/')

    .controller('loginCtrl', function ($scope, DBREF, AuthService, $state) {
        var db = new Firebase(DBREF)

        $scope.order = {};
        
        
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
        var ref = new Firebase(DBREF);
        var activeRef = ref.child('Active Orders')
        // future order num
        var orderNum = 1;
        var saveNum = 1;
        $scope.orders = new $firebaseArray(activeRef);
        $scope.user = "Users Name";
        $scope.images = ShirtService.images;
        $scope.shirts = ShirtService.shirts;
        $scope.selectedImage = ShirtService.getLogo();
        $scope.order = {};
        
        //adds user designs to cart 
        $scope.addToCart = function () {

        }
        
        // firebase array reference for saved orders
        $scope.savedOrders = new $firebaseArray(ref);
        
        //Saves user designs to database 
        $scope.save = function () {
            $scope.savedOrdersName = prompt("Please enter a name for this design, " + $scope.user + "?");
            alert($scope.savedOrdersName + " has been saved to your account");
            $scope.order.details = {
                name: $scope.savedOrdersName,
                saveNum: saveNum,
                price: 19.99,
                user: "Mock User Name",
                date: Date.now(),
                // Doesnt work if shirt is not selected// need to assign default shirt
                shirtColor: $scope.selectedShirt.color,
                shirtUrl: $scope.selectedShirt.front,
                imageName: $scope.selectedImage.name,
                imageUrl: $scope.selectedImage.image
            }
            $scope.orders.$add($scope.order);
            saveNum++;
        }

        //Selects clip art and scrolls to shirt designer
        $scope.imagePicker = function (i) {
            // console.log("Is this working? did you click ", i.name + "?");
            ShirtService.selectedImage = i;
            $scope.selectedImage = i;
            $ionicScrollDelegate.scrollTop();
        }

        // jQuery ui draggable resizable
        $('.image-div').resizable({
            aspectRatio: true,
            handles: 'ne,se,sw,nw',
            stop: saveImage,
        }).draggable({
            stop: function (e, image) {
                $scope.order.logo = $scope.order.logo || {};
                $scope.order.logo.position = image.position;
            }
        });
        


        //Selects shirt color and view
        $scope.shirtView = function (view, shirt) {
            if (shirt) {
                $scope.selectedShirt = shirt;
            }

            $scope.shirtViewer = $scope.selectedShirt[view];;
            console.log(view);
        }

        $scope.shirtViewer = $scope.shirts[0].front;
        // $scope.selectedShirt = $scope.shirts[0];
     
        function saveImage(e, image) {
            var logo = {
                size: image.size,
                position: image.position
            }
            $scope.order.logo = logo;
        }
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
 