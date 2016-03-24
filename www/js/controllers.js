/* global Firebase */
angular.module('app.controllers', [])
    .constant('DBREF', 'https://customshop.firebaseio.com/')

    .controller('AuthController', function($rootScope, $scope, $firebaseObject, $firebaseArray, DBREF, AuthService, $state) {
        var db = new Firebase(DBREF);
        // $scope.user = AuthService.getUser();
        
        // Handles DB responses/ Sets DB paths
        function handleDBResponse(err, authData) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Login Auth, did we get here?")
            console.log(authData)

            $rootScope.member = $firebaseObject(new Firebase(DBREF + 'users/' + authData.uid));
            $rootScope.myDesigns = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myDesigns'));
            $rootScope.myOrders = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myOrders'));
            $rootScope.myImages = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myImages'));
            $rootScope.myCart = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myCart'));
            // $rootScope.myCart.items = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myCart/items'));


            $rootScope.member.$loaded(function() {
                $state.go('tabsController.t-ShirtDesigner');
            })
        }
        var authData = db.getAuth();
        if (authData) {
            handleDBResponse(null, authData);
        }
        
        //Logs the user out
        $scope.logout = function(user){
            alert('Logout Button Clicked')
                db.unauth();
        } 
        
        
    })

    .controller('loginCtrl', function($rootScope, $scope, $firebaseObject, $firebaseArray, DBREF, AuthService, $state) {
        var db = new Firebase(DBREF);
        $scope.user = AuthService.getUser();

        function handleDBResponse(err, authData) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Login Auth, did we get here?")
            console.log(authData)

            $rootScope.member = $firebaseObject(new Firebase(DBREF + 'users/' + authData.uid));
            $rootScope.myDesigns = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myDesigns'));
            $rootScope.myOrders = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myOrders'));
            $rootScope.myImages = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myImages'));
            $rootScope.myCart = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myCart/items'));
            // $rootScope.myCart.items = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myCart/items'));


            $rootScope.member.$loaded(function() {
                $state.go('tabsController.t-ShirtDesigner');
            })
        }
        $scope.login = function(user) {
            user ? db.authWithPassword(user, handleDBResponse) : ''
            // console.log(user.email + user.password)
        }
    })

    .controller('signupCtrl', function($scope, DBREF, AuthService, $firebaseArray, $state, $rootScope, $firebaseObject) {
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
                    uploads: [],
                    current: {}
                }

                //This line saves user to DB
                db.child('users').child(authData.uid).update(userToSave);
                $rootScope.member = $firebaseObject(new Firebase(DBREF + 'users/' + authData.uid));
                $rootScope.myDesigns = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myDesigns'));
                $rootScope.myOrders = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myOrders'));
                $rootScope.myImages = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myImages'));

            }
        }
    })

    .controller('t-ShirtDesignerCtrl', function($scope, $state, ShirtService, OrderService, $ionicScrollDelegate, DBREF, $firebaseArray, $rootScope) {

        var db = new Firebase(DBREF);
        // Original reference
        var ref = new Firebase(DBREF);
        // Child reference for saved designs
        var savedRef = ref.child('Saved Designs');
        // child reference for Active Orders// Currently using to view orders in custom Shop Home
        var activeRef = ref.child('Active Orders');
        // These are goin to be replaced with $rootScope.myDesigns and $rootScope.myOrders
        $scope.activeOrders = new $firebaseArray(activeRef);
        $scope.savedDesigns = new $firebaseArray(savedRef);

        $scope.images = ShirtService.images;
        $scope.shirts = ShirtService.shirts;
        $scope.selectedImage = ShirtService.getLogo();

        // Sets an empty variable for shirt designs
        $scope.design = {};

        // Shows and Hides upload window
        $scope.uploadWindow = function() {
            $scope.showUpload = !$scope.showUpload;
        }

        // Sets up upload object for user image upload
        $scope.upload = {
            name: '',
            image: '',
            description: ''
        }

        // Pushes new image object to images array in ShirtService
        $scope.uploadImage = function(img) {
            $rootScope.myImages.$add(img);
            $scope.showUpload = !$scope.showUpload;
        }


        // Testing pasing data to a constructor for view change
        $scope.PassInfo = function(shirt, image) {
            if (!image) {
                alert("You didnt create a design yet, please choose an image");
            }
            else {
                $state.go('savePage');
                // New Angular Fire Reference

                // Old but working method
                ShirtService.tempShirt = shirt;
                ShirtService.tempImage = image;
                ShirtService.tempDesign = $scope.design;
                // console.log(ShirtService.tempDesign)
            }
        }

        // Declares an empty object for save data
        $scope.saved = {
            name: '',
            email: ''
        }

        // Uses rootscope.member to save member designs
        // $scope.saveDesign = function() {
        //     // $rootScope.member.designs.push();
        // }

        //Sets default values for logo object//These values need to match the css values for .image-div for proper operation
        $scope.design.logo = {
            position: {
                left: 159,
                top: 65
            },
            size: {
                height: 40,
                width: 40
            }
        }

        // Used to hide size/quantity picker before saving design
        $scope.isSaved = false;


        //Saves user designs to database 
        $scope.save = function() {
            if ($rootScope.member) {
                alert($scope.saved.name + " has been saved to your account " + $rootScope.member.username);
            } else {
                alert("You must be logged in to save. Please login or create an account");
                $state.go('login')
            }
            $scope.design.details = {
                name: $scope.saved.name,
                email: $scope.saved.email,
                price: 19.99,
                user: $rootScope.member.username,
                date: Date.now(),
                shirtColor: ShirtService.tempShirt.color,
                shirtUrl: ShirtService.tempShirt.front,
                imageName: ShirtService.tempImage.name,
                imageUrl: ShirtService.tempImage.image,
            }
            //Perpetuating logo info on state change
            $scope.design.logo = {
                position: ShirtService.tempDesign.logo.position,
                size: ShirtService.tempDesign.logo.size
            }

            // Sends design to current users saved designs
            // Need to create a view for this
            $rootScope.myDesigns.$add($scope.design);

            // Opens size and quantity picker
            $scope.isSaved = true;
        }

        // Get Item Total
        $scope.getTotal = function() {
            var s = $scope.design.sizes
            var quantity = 0;
            for (var val in s) {
                quantity += s[val]
            }
            console.log(quantity);
            $scope.design.quantity = quantity;
            $scope.design.total = 0;
            $scope.design.total = $scope.design.details.price * quantity;
            // return total; 
        }

        //Totals all items in cart-- Array cart way
        // $scope.getCartTotal = function() {
        //     $rootScope.myCart.cartTotal = 0;
        //     for (var i = 0; i < $rootScope.myCart.length; i++) {
        //         $rootScope.myCart.cartTotal += $rootScope.myCart[i].total;
        //         alert("cart total running");
        //     }
        // };


        // Sets cart total to 0
        $rootScope.myCart.cartTotal = 0;

       // Totals all items in cart// Object Cart
        $scope.getCartTotal = function() {
            for (var i = 0; i < $rootScope.myCart.length; i++) {
                $rootScope.myCart.cartTotal += $rootScope.myCart[i].total;
                alert("Cart total is running now");
            }
        }

        //Calls getCart Total
       $scope.getCartTotal();

       
       
        //Adds user designs to cart
        $scope.addToCart = function() {
            $scope.getTotal();
            $rootScope.myCart.$add($scope.design);
            $scope.getCartTotal();
            $state.go('tabsController.shoppingCart');
        }

        //Initializes Order object
        var currentOrder = {
            items: [],
            orderDate: 0
        }
        
        //Fills currentOrder.items array
        function createOrderObj(arr){
            for(var i = 0; i < arr.length; i++){
                currentOrder.items.push(arr[i]);
                currentOrder.orderDate = Date.now();
                currentOrder.email = $rootScope.member.username;
                currentOrder.grandTotal = $rootScope.myCart.cartTotal;
            }
        }

        // Processes order/sends to Firebase
        $scope.orderNow = function() {
            createOrderObj($rootScope.myCart);
            $scope.activeOrders.$add(currentOrder);
            alert("Payment processing is in progress.... Thank you for you Order!");
            currentOrder = {};
        }

        //Selects clip art and scrolls to shirt designer
        $scope.imagePicker = function(i) {
            console.log("Is this working? did you click ", i.name + "?");
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
                $scope.design.logo = $scope.design.logo || {};
                $scope.design.logo.position = image.position;
            }
        });

        // jQuery text box draggable resizable
        $('.text-div').resizable({
            aspectRatio: true,
            handles: 'ne,se,sw,nw',
            //  stop: saveImage,
        }).draggable({
            //  stop: function(e, image) {
            //     $scope.design.logo = $scope.design.logo || {};
            //     $scope.design.logo.position = image.position;
            // }
        });

        // Toggle css handles on click
        // $scope.toggleHandles = function(){
        //     alert("I work!");
        //   $scope.active = !$scope.active;

        // }


        // Toggle hides image div
        // $(document).click(function() {
        //     $('#toggle').toggle('highlight')
        // })

        //Selects shirt color and view
        $scope.shirtView = function(view, shirt) {
            // console.log(shirt);
            if (shirt) {
                $scope.selectedShirt = shirt;
            }
            $scope.shirtViewer = $scope.selectedShirt[view];;
            // console.log(view);
        }

        // Initializes Shirt View
        $scope.shirtView('front', ShirtService.shirts[0])

        // Saves selected image 
        function saveImage(e, image) {
            var logo = {
                size: image.size,
                position: image.position
            }
            $scope.design.logo = logo;
        }


    })

    .controller('shoppingCartCtrl', function($scope, ShirtService, OrderService, DBREF, $firebaseArray, $rootScope) {
        //Referencing and testing if i need to directly talk to firebase or if i should be sharing a service
        var ref = new Firebase(DBREF);
        var activeRef = ref.child('Active Orders');
        $scope.orders = new $firebaseArray(activeRef);
        $scope.cart = [];
        // console.log("$rootScope.member.current = ", $rootScope.member.current)

        // The old way
        // $scope.current = $rootScope.member.current;

        // console.log($scope.cart)
        // console.log("$scope.current = ", $scope.current)
        

        // Gets total of all items in the cart
        // // Need to use closure to privatize cartTotal
        // $scope.cartTotal = 0;
        // $scope.getCartTotal = function() {
        //     for(var i = 0; i < myCart.length; i++){
        //         $scope.cartTotal += myCart[i].total;
        //     }
        // };

        // $scope.getCartTotal();

        // $scope.totalPrice = 0;

    })

    .controller('chooseCustomClipArtCtrl', function($scope) {

    })

    .controller('brandedPrintsCtrl', function($scope) {

    })
    // Might not use this controller// MAybe just shirt controller// Or move save data here if no conflict
    .controller('savePageCtrl', function($scope) {
        $scope.test = "Save Test";
    })
