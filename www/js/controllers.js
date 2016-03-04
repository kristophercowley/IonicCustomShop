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
                // console.log("Signup createUser, did we get here?")
                // console.log(authData);
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
                // db.child('wat?').child("WAT").update({ name: "fug", wat: "wat?" });
            }
            // console.log(user.email + user.password)
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
        
        // Testing pasing data to a constructor for view change
        $scope.Tester1 = function (shirt, image) {
            ShirtService.tempShirt = shirt;
            ShirtService.tempImage = image;
            // console.log(ShirtService.shirtTest, ShirtService.imageTest)
        }
        
        // Declares an empty object for save data
        $scope.saved = {
            name: '',
            email: ''
        }
        
        //Saves user designs to database 
        $scope.save = function () {
            alert($scope.saved.name + " has been saved to the account " + $scope.saved.email);
            $scope.order.details = {
                name: $scope.saved.name,
                email: $scope.saved.email,
                saveNum: saveNum,
                price: 19.99,
                user: "Mock User Name",
                date: Date.now(),
                shirtColor: ShirtService.tempShirt.color,
                shirtUrl: ShirtService.tempShirt.front,
                imageName: ShirtService.tempImage.name,
                imageUrl: ShirtService.tempImage.image,

                // Doesnt work if shirt is not selected// need to assign default shirt
                //  Data not passing from design to save view
                // shirtColor: $scope.selectedShirt.color,
                // shirtUrl: $scope.selectedShirt.front,
                // imageName: $scope.selectedImage.name,
                // imageUrl: $scope.selectedImage.image
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
// Might not use this controller// MAybe just shirt controller// Or move save data here if no conflict
    .controller('savePageCtrl', function ($scope) {
        $scope.test = "Save Test";
    })
 