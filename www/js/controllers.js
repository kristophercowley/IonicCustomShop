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
                    uploads: [],
                    current: {}
                }
                // console.log(userToSave);
                //This line saves user to DB
                db.child('users').child(authData.uid).update(userToSave);
                // Testing $Rootscope member for authorized saves 
                $rootScope.member = userToSave;
                // console.log("rootscope.member = ", $rootScope.member)
            }
            // console.log(user.email + user.password)
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
        $scope.activeOrders = new $firebaseArray(activeRef);
        var saveNum = 1;
        $scope.savedDesigns = new $firebaseArray(savedRef);
        $scope.user = "Users Name";
        $scope.images = ShirtService.images;
        $scope.shirts = ShirtService.shirts;
        $scope.selectedImage = ShirtService.getLogo();
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
            // ShirtService.images.push(img) //dont need this anymore I think
            $rootScope.member.uploads.push(img);
            // console.log("This is rootscope.member.uploads", $rootScope.member.uploads);
            $scope.showUpload = !$scope.showUpload;
        }


        // Testing pasing data to a constructor for view change
        $scope.PassInfo = function(shirt, image) {
            if (!image) {
                alert("You didnt create a design yet, please choose an image");
            }
            else {
                $state.go('savePage');
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
        $scope.saveDesign = function() {
            // $rootScope.member.designs.push();
        }

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
            $scope.design.logo = {
                position: ShirtService.tempDesign.logo.position,
                size: ShirtService.tempDesign.logo.size
            }
            $scope.savedDesigns.$add($scope.design);
            // Temp sending to Custom shop home for testing
            $scope.activeOrders.$add($scope.design);
            // $rootScope.member.current = $scope.design;
            // console.log("$rootScope.member.current : " , $rootScope.member.current)
            // console.log($scope.activeOrders)
            // console.log(ShirtService.tempDesign)
            saveNum++;
            $scope.isSaved = true;
        }

        // Get Total
        $scope.getTotal = function() {
            debugger;
            var s = $scope.design.sizes
            var quantity = 0;
            for (var val in s) {
                quantity += s[val]
            }
            // var quantity = (s.sm + s.md + s.lg + s.xl + s.xxl); 
            console.log(quantity);
            $scope.design.total = 0;
            $scope.design.total = $scope.design.details.price * quantity;
            // return total; 
        }

        //adds user designs to cart ///maybe just use $$rootscope.member//Might not need this
        $scope.addToCart = function() {
            $scope.getTotal();
            $rootScope.member.current = $scope.design;

            console.log($rootScope.member.current)
            console.log($rootScope.member.current.total)
            $state.go('tabsController.shoppingCart');
            // Test sending to service for cart
            // ShirtService.myCartOrder = $scope.design;
            // Test sendin to OrderService
            // OrderService.setCurrentOrder($scope.order);
            // OrderService.currentOrder = $scope.design;
        }
        
         $scope.orderNow = function() {
            $scope.activeOrders.$add($rootScope.member.current);
            alert("Thanks for you Order!")
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
                $scope.design.logo = $scope.design.logo || {};
                $scope.design.logo.position = image.position;
            }
        });

        // Toggle Handles for image div
        $(document).click(function() {
            $('#toggle').toggle('highlight')
        })

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
        $scope.cart = {};
        // $scope.orders2 = OrderService.getCurrentOrder();
        // $scope.orders2 = OrderService.currentOrder;
        console.log("$rootScope.member.current = ", $rootScope.member.current)
        $scope.current = $rootScope.member.current;
        console.log("$scope.current = ", $scope.current)


        $scope.cartTest = function() {
            // console.log($scope.orders)
            // $scope.orders1 = ShirtService.myCartOrder;
            // console.log($scope.orders1)
            // $scope.orders2 = OrderService.currentOrder;
            // console.log($scope.orders2)

            console.log("Button pressed, $rootscope.member.details", $rootScope.members.details)
            console.log("Button pressed, $scope.current.details", $scope.current.details)


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
