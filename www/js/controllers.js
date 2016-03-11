/* global Firebase */
angular.module('app.controllers', [])
    .constant('DBREF', 'https://customshop.firebaseio.com/')

    .controller('loginCtrl', function($scope, DBREF, AuthService, $state) {
        var db = new Firebase(DBREF);
        $scope.user = AuthService.getUser();

        function handleDBResponse(err, authData) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Login Auth, did we get here?")
            console.log(authData)
            $state.go('tabsController.t-ShirtDesigner')
            //Creates User Object To Send To DB
            var userToSave = {
                username: $scope.user.email,
                reputation: 0,
                created: Date.now()
            }
            console.log(userToSave)
            //This line saves user to DB
            db.child('users').child(authData.uid).update(userToSave);
        }
        $scope.login = function(user) {
            user ? db.authWithPassword(user, handleDBResponse) : ''
            // console.log(user.email + user.password)
        }
    })

    .controller('signupCtrl', function($scope, DBREF, AuthService, $firebaseArray, $state, $rootScope) {
        var db = new Firebase(DBREF);
        // var db = AuthService.db();
        $rootScope.member = {};
        $scope.errorMessage = '';
        $scope.user = AuthService.getUser();
        $scope.signup = function(user) {
            db.createUser(user, handleDBResponse)
            function handleDBResponse(err, authData) {
                if (err) {
                    console.log(err);
                    // $scope.errorMessage = err;
                    // console.log($scope.errorMessage);
                    return;
                }
                // console.log("Signup createUser, did we get here?")
                // console.log(authData);
                $state.go('tabsController.t-ShirtDesigner')
                //Creates User
                var userToSave = {
                    username: $scope.user.email,
                    reputation: 0,
                    created: Date.now(),
                    designs: [],
                    orders: [],
                    uploads: []
                }
                // console.log(userToSave);
                //This line saves user to DB
                db.child('users').child(authData.uid).update(userToSave);
                // Testing $Rootscope member for authorized saves 
                $rootScope.member = userToSave;
                console.log("rootscope.member = " , $rootScope.member)
            }
            // console.log(user.email + user.password)
        }
    })

    .controller('t-ShirtDesignerCtrl', function($scope, $state, ShirtService, OrderService, $ionicScrollDelegate, DBREF, $firebaseArray, $rootScope) {
        var db = new Firebase(DBREF);
        var ref = new Firebase(DBREF);
        var activeRef = ref.child('Active Orders')
        // future order num
        // var orderNum = 1;
        var saveNum = 1;
        $scope.orders = new $firebaseArray(activeRef);
        $scope.user = "Users Name";
        $scope.images = ShirtService.images;
        $scope.shirts = ShirtService.shirts;
        $scope.selectedImage = ShirtService.getLogo();
        $scope.order = {};
        // Shows and Hides upload window
        $scope.uploadWindow = function() {
            $scope.showUpload = !$scope.showUpload;
        }
        // Sets up upload object for user image upload
        $scope.upload = {
            name: '',
            image: ''
        }
        // Pushes new image object to images array in ShirtService
        $scope.uploadImage = function(img) {
            ShirtService.images.push(img)
            console.log(img);
            $scope.showUpload = !$scope.showUpload;
        }
        // firebase array reference for saved orders
        $scope.savedOrders = new $firebaseArray(ref);

        // Testing pasing data to a constructor for view change
        $scope.PassInfo = function(shirt, image) {
            ShirtService.tempShirt = shirt;
            ShirtService.tempImage = image;
            ShirtService.tempOrder = $scope.order;
            // console.log(ShirtService.tempOrder)
        }

        // Declares an empty object for save data
        $scope.saved = {
            name: '',
            email: ''
        }

        $scope.isSaved = false;
        //Saves user designs to database 
        $scope.save = function() {
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
            // Test for perpetuating logo info
            $scope.order.logo = {
                position: ShirtService.tempOrder.logo.position,
                size: ShirtService.tempOrder.logo.size
            }
            $scope.orders.$add($scope.order);
            // console.log($scope.order)
            // console.log(ShirtService.tempOrder)
            saveNum++;
            $scope.isSaved = true;
        }
        // Creates Cart Obj
        $scope.myOrder = {};

        //adds user designs to cart 
        $scope.addToCart = function() {
            // $scope.save();
            $scope.myOrder = $scope.order;
            console.log($scope.myOrder);
            $state.go('tabsController.shoppingCart');
            // Test sending to service for cart
            ShirtService.myCartOrder = $scope.order;
            // Test sendin to OrderService
            // OrderService.setCurrentOrder($scope.order);
            OrderService.currentOrder = $scope.order;

        }

        //Selects clip art and scrolls to shirt designer
        $scope.imagePicker = function(i) {
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
            stop: function(e, image) {
                $scope.order.logo = $scope.order.logo || {};
                $scope.order.logo.position = image.position;
            }
        });

        //Selects shirt color and view
        $scope.shirtView = function(view, shirt) {
            if (shirt) {
                $scope.selectedShirt = shirt;
            }
            $scope.shirtViewer = $scope.selectedShirt[view];;
            // console.log(view);
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

    .controller('shoppingCartCtrl', function($scope, ShirtService, OrderService, DBREF, $firebaseArray) {
        //Referencing and testing if i need to directly talk to firebase or if i should be sharing a service
        var ref = new Firebase(DBREF);
        var activeRef = ref.child('Active Orders');
        $scope.orders = new $firebaseArray(activeRef);
        $scope.cart = {};
        // $scope.orders2 = OrderService.getCurrentOrder();
        // $scope.orders2 = OrderService.currentOrder;

        $scope.cartTest = function() {
            // console.log($scope.orders)
            // $scope.orders1 = ShirtService.myCartOrder;
            // console.log($scope.orders1)
            $scope.orders2 = OrderService.currentOrder;
            console.log($scope.orders2)

            // console.log($scope.cart.details.price)

        }

        // End references and testing

        // Need to decide on what services, factories, and controllers to use to pass information from one view to another
        // Need to figure out my data Structure- I should refactor my data all into services and make sure it is saving to firebase
        // Need to clean up naming conventions of variables to clarify intent
        $scope.totalPrice = 0;

    })

    .controller('chooseCustomClipArtCtrl', function($scope) {

    })

    .controller('brandedPrintsCtrl', function($scope) {

    })
    // Might not use this controller// MAybe just shirt controller// Or move save data here if no conflict
    .controller('savePageCtrl', function($scope) {
        $scope.test = "Save Test";
    })
