/* global Firebase */
angular.module('app.controllers', [])
    .constant('DBREF', 'https://customshop.firebaseio.com/')

    .controller('AuthController', function ($rootScope, $scope, $firebaseObject, $firebaseArray, DBREF, $state) {
        var db = new Firebase(DBREF);

        // Handles DB responses/ Sets DB paths
        function handleDBResponse(err, authData) {
            if (err) {
                console.log(err);
                return;
            }
            // console.log("Login Auth, did we get here?")
            // console.log(authData)

            $rootScope.member = $firebaseObject(new Firebase(DBREF + 'users/' + authData.uid));
            $rootScope.myDesigns = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myDesigns'));
            $rootScope.myOrders = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myOrders'));
            $rootScope.myImages = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myImages'));
            $rootScope.myCart = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myCart'));

            $rootScope.member.$loaded(function () {
                $state.go('tabsController.t-ShirtDesigner');
            })
        }
        var authData = db.getAuth();
        if (authData) {
            handleDBResponse(null, authData);
        }

        //Logs the user out
        $scope.logout = function (user) {
            alert('Logout Button Clicked')
            $state.go('login')
            db.unauth();
        }


    })

    .controller('loginCtrl', function ($rootScope, $scope, $firebaseObject, $firebaseArray, DBREF, $state) {
        var db = new Firebase(DBREF);
        $scope.user = {}

        function handleDBResponse(err, authData) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Login Auth, did we get here?")
            console.log(authData)
            // Sets up DB references
            $rootScope.member = $firebaseObject(new Firebase(DBREF + 'users/' + authData.uid));
            $rootScope.myDesigns = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myDesigns'));
            $rootScope.myOrders = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myOrders'));
            $rootScope.myImages = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myImages'));
            $rootScope.myCart = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myCart'));

            $rootScope.member.$loaded(function () {
                $state.go('tabsController.t-ShirtDesigner');
            })
        }
        $scope.login = function (user) {
            user ? db.authWithPassword(user, handleDBResponse) : ''
            // console.log(user.email + user.password)
        }
    })
    // AuthService,
    .controller('signupCtrl', function ($scope, DBREF, $firebaseArray, $state, $rootScope, $firebaseObject) {
        var db = new Firebase(DBREF);
        $scope.user = {}
        // var db = AuthService.db();
        $rootScope.member = {};
        $scope.errorMessage = '';
        // $scope.user = AuthService.getUser();
        $scope.signup = function (user) {
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

                //This sets up DB references
                db.child('users').child(authData.uid).update(userToSave);
                $rootScope.member = $firebaseObject(new Firebase(DBREF + 'users/' + authData.uid));
                $rootScope.myDesigns = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myDesigns'));
                $rootScope.myOrders = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myOrders'));
                $rootScope.myImages = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myImages'));
                $rootScope.myCart = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/myCart'));
                // $rootScope.currentDesign = $firebaseArray(new Firebase(DBREF + 'users/' + authData.uid + '/currentDesign'));

            }
        }
    })

    .controller('t-ShirtDesignerCtrl', function ($scope, $state, ShirtService, OrderService, CreateService, $ionicScrollDelegate, DBREF, RefService, PayService, $firebaseArray, $rootScope) {
        //Testing PayService
        // var promise = PayService.paymentApi();
        // promise.then(function (data) {
        //     console.log("promise data:", promise, data)
        // })
        // test


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
        // $scope.printedShirts = ShirtService.printedShirts;
        $scope.images = ShirtService.images;
        $scope.shirts = ShirtService.shirts;
        $scope.selectedImage = ShirtService.getLogo();
        // $scope.showCard = true;
        // Sets an empty variable for shirt designs
        $scope.design = {};




        // Shows and Hides upload window
        $scope.uploadWindow = function () {
            $scope.showUpload = !$scope.showUpload;
        }

        // Sets up upload object for user image upload
        $scope.upload = {
            name: '',
            image: '',
            description: ''
        }


        // Used to hide size/quantity picker before saving design
        $scope.isSaved = false;


        // Pushes new image object to images array in ShirtService
        $scope.uploadImage = function (img) {
            $rootScope.myImages.$add(img);
            $scope.showUpload = !$scope.showUpload;
        }


        // Testing pasing data to a constructor for view change
        $scope.PassInfo = function (shirt, image) {
            console.log('shirt:',shirt,'image:',image,'$scope.design',$scope.design)
            if (!image) {
                alert("You didnt create a design yet, please choose an image");
            }
            else {
                // Old but working method
                // ShirtService.tempShirt = shirt;
                // ShirtService.tempImage = image;
                // ShirtService.tempDesign = $scope.design;
                // Using create service to seperate reponsibility
                CreateService.currentCreation.tempShirt = shirt;
                CreateService.currentCreation.tempImage = image;
                CreateService.currentCreation.tempDesign = $scope.design;
                 console.log('jQUERY',$('.image-div').offset())
                CreateService.currentCreation.$save()


                $state.go('savePage');
                // console.log(ShirtService.tempDesign)
            }
        }

        // Reset ShirtService temp values
        var resetShirtService = function () {
            ShirtService.tempShirt = "";
            ShirtService.tempImage = "";
            ShirtService.tempDesign = "";
        }

        // Declares an empty object for save data
        $scope.saved = {
            name: '',
            email: ''
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



        //Saves user designs to database 
        $scope.save = function () {
            if ($rootScope.member) {
                // alert($scope.saved.name + " has been saved to your account " + $rootScope.member.username);
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
                shirtColor: CreateService.currentCreation.tempShirt.color,
                shirtUrl: CreateService.currentCreation.tempShirt.front,
                imageName: CreateService.currentCreation.tempImage.name,
                imageUrl: CreateService.currentCreation.tempImage.image,
            }
            //Perpetuating logo info on state change? Not sure im still using this...
            $scope.design.logo = {
                position: CreateService.currentCreation.tempDesign.logo.position,
                size: CreateService.currentCreation.tempDesign.logo.size
            }
            // Clears temp values
            // resetShirtService()

            // Sends design to current users saved designs
            $rootScope.myDesigns.$add($scope.design);

            // Testing Firebase object for live design to get it off root
            CreateService.currentCreation.design = $scope.design;
            CreateService.currentCreation.$save()

            // $state.go('quantityPicker');
            $scope.isSaved = true;
            // clearDesign();
        }

        // Clears values & resets defaults for design
        function clearDesign() {
            $scope.design = {};
            $scope.design.details = {};
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
        }

        // Counts current order sizes and quantity
        function getCount() {

        }

        // Get Item Sub Total
        $scope.getTotal = function () {
            var s = $scope.design.sizes
            var quantity = 0;
            for (var val in s) {
                quantity += s[val]
            }
            console.log("quantity", quantity);
            $scope.design.quantity = quantity;
            $scope.design.total = 0;
            $scope.design.total = $scope.design.details.price * quantity;
        }

        // Sets cart total to 0
        $rootScope.myCart.cartTotal = 0;

        // Totals all items in cart// Object Cart
        $scope.getCartTotal = function () {
            $rootScope.myCart.cartTotal = 0;
            var total = 0;
            for (var i = 0; i < $rootScope.myCart.length; i++) {
                total += $rootScope.myCart[i].total;
            }
            $rootScope.myCart.cartTotal = total;
        }


        // Keeping cart up to date
        $scope.$watch($rootScope.myCart, function (newValue) {
            // alert('Watcher is working!');
            $scope.getCartTotal();
        })

        $scope.$on('$stateChangeSuccess', function () {
            // alert('On state change function working');
            $scope.getCartTotal()
        });

        $scope.getCartTotal()




        //Adds user designs to cart
        $scope.addToCart = function () {
            $scope.getTotal();
            $rootScope.myCart.$add($scope.design);
            $state.go('tabsController.shoppingCart');
            // clearDesign();
            $scope.isSaved = false;
            $scope.getCartTotal();
        }

        //Initializes Order object
        var currentOrder = {
            items: [],
            orderDate: 0
        }

        //Fills currentOrder.items array
        function createOrderObj(arr) {
            for (var i = 0; i < arr.length; i++) {
                currentOrder.items.push(arr[i]);
                currentOrder.orderDate = Date.now();
                currentOrder.email = $rootScope.member.username;
                currentOrder.grandTotal = $rootScope.myCart.cartTotal;
            }
        }

        // Clears cart after order
        function clearCart() {
            for (var i = 0; i < $rootScope.myCart.length; i++) {
                $rootScope.myCart.$remove(i)
            }
            $rootScope.myCart.cartTotal = 0;
        }

        // Processes order/sends to Firebase
        $scope.orderNow = function (info, total) {
            // test/dummy info
            !info ? info = { name: "John", cc_num: 12345678910, cc_cvc: 999 } : info = info;
            info.currency = total
            info.cc_exp_mo = 12;
            info.cc_exp_year = 2016;
            info.merch_acct_id_str = "154";


            // PayService.paymentApi(info).then(function (data, err) {
            //     console.log('orderpage: ' + data + '----err: ' + err)

            // })
            console.log("incoming from form", info)
            createOrderObj($rootScope.myCart);
            $scope.activeOrders.$add(currentOrder);
            alert("Payment processing is in progress.... Thank you for you Order! Thank you for participating in our testing phase. This order has been sent to the payment api and desktop application for processing");
            var currentOrder = {
                items: [],
                orderDate: 0
            }            // $scope.showCard = false;
            // Clears the cart array
            clearCart();
        }

        // Removes an item from the cart
        $scope.removeFromCart = function (index) {
            console.log("remove from cart:", index);
            $rootScope.myCart.$remove(index).then(function (ref) {
                $scope.getCartTotal();
            }), function (err) { console.log("Firebase remove error:", err) };
        }


        // Add member designs to cart
        $scope.addMemberDesign = function (shirt) {
            // Need to create component for quantity picker
            alert('Thank you for participating in the pre-release test phase. This feature is coming soon in version 1.1')
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
        $scope.shirtView = function (view, shirt) {
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
            console.log("save image:", image)
            var logo = {
                size: image.size,
                position: image.position
            }
            $scope.design.logo = logo;
        }

        //Connects print object to service // Provived a blank template//
        $scope.printOrder = OrderService.printOrder

        // Printed shirt picker
        // $rootScope.printOrder = {};
        $scope.printedShirts = ShirtService.printedShirts;
        $scope.buyPrint = function (print) {
            // alert("running buy prints function.... shirt is:", print);
            console.log(print)
            console.log("printOrder:", $scope.printOrder)
            $scope.printOrder.details = {
                price: print.price,
                shirtUrl: print.url,
                color: print.color,
                name: print.name,
                description: print.description,
                // total: 0
            }
            OrderService.printOrder = $scope.printOrder
            console.log("this is the OrderService.printOrder Post function:", OrderService.printOrder)
            // console.log($rootScope.printOrder)
            $state.go('savePage');
        }
    })

    .controller('shoppingCartCtrl', function ($scope, ShirtService, OrderService, DBREF, $firebaseArray, $rootScope) {


    })

    .controller('chooseCustomClipArtCtrl', function ($scope) {

    })

    // Not currently in use
    .controller('brandedPrintsCtrl', function ($scope, ShirtService, $state) {
        $scope.printedShirts = ShirtService.printedShirts;
        $scope.buyPrint = function () {
            alert("running buy prints function")
            // $state.go('quantityPage');
            // need to link this back to quantity function on save page with shirt data
            $scope.isSaved = true;
        }

    })
    // Might not use this controller// MAybe just shirt controller// Or move save data here if no conflict
    .controller('savePageCtrl', function ($scope) {
        $scope.test = "Save Test";
    })
