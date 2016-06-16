/* global DBREF */
angular.module('app.services', [])

    .service('BlankService', [function () {

    }])

    .factory('ShirtService', [function () {
        var selectedImage;
        var setLogo = function (img) {
            selectedImage = img
        }
        var getLogo = function () {
            return selectedImage;
        }
        var shirts = [
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
            },
             {
                color: "-Black Hat",
                front: "img/hat.jpg",
                back: "img/hat-back2.jpg"
            }
        ];
        var images = [
            {
                name: "biohazard",
                image: "img/bio.png",
                description: "testing1,2,3",
                checked: true
            },
            {
                name: "tape",
                image: "img/tape.png"
            },
            {
                name: "x",
                image: "img/x.png"
            },
            {
                name: "swirl",
                image: "img/swirl.png"
            },
            {
                name: "tea",
                image: "img/tea.png"
            },
            {
                name: "diamond",
                image: "img/diamond.png"
            },
            {
                name: "strange icon",
                image: "img/favicon.png"
            },
            {
                name: "bcw1",
                image: "img/bcw.png"
            },
            {
                name: "finalunderground",
                image: "img/fug.jpg"
            },
            {
                name: "strange logo",
                image: "img/strange-logo.png"
            },
            {
                name: "star wars",
                image: "http://vignette2.wikia.nocookie.net/logopedia/images/5/5b/Star-Wars-Logo_Silver.png/revision/latest?cb=20151106011636"
            }
        ]

        var printedShirts = [
            {
                name: "Red Shirt",
                description: "To show the color red",
                url: "img/HaZGfL4NSfWrZxS6elpE_red.jpg",
                price: 16.99,
                color: "red"

            },
            {
                name: "The Dude",
                description: "Your Brand Name Here",
                url: "img/0wnQdP9rTri3jPQDabCb_dude.jpg",
                price: 24.99,
                color: "brown"

            },
            {
                name: "Example",
                description: "Put Some Info Here",
                url: "img/HL8o9tVlS9mcDc8pUXks_screen.jpg",
                price: 15.99,
                color: "mix"

            },
            {
                name: "MMA",
                description: "Copyright not mine",
                url: "img/73Uqk9EQX6I9fvfUF8zQ_mma.jpg",
                price: 18.99,
                color: "unknown"

            },
            {
                name: "Construction",
                description: "Brown Shirt Description",
                url: "img/dxgHxn27R8WiP3GczJF9_construction.jpg",
                price: 14.99,
                color: "brown"
            },
        ]
        return {
            shirts: shirts,
            images: images,
            setLogo: setLogo,
            getLogo: getLogo,
            printedShirts: printedShirts
        }

    }])

    .factory('RefService', ['DBREF', '$firebaseArray', '$firebaseObject', '$rootScope', function (DBREF, $firebaseArray, $firebaseObject, $rootScope) {
        var db = new Firebase('https://customshop.firebaseio.com/');
        var liveDesign = new $firebaseObject(db.child('liveDesign:' + $rootScope.member.$id))
        return {
            db: db,
        }
    }])

    .factory('CreateService', ['DBREF', '$firebaseArray', '$firebaseObject', '$rootScope', function (DBREF, $firebaseArray, $firebaseObject, $rootScope) {
        var currentCreation = $firebaseObject(new Firebase(DBREF + 'users/' + $rootScope.member.$id + '/currentCreation'));
        currentCreation.Test = "Test";
        currentCreation.$save();
        console.log('creation:', currentCreation)
        return {
            currentCreation: currentCreation,
        }
    }])

    .factory('PayService', ['$http', '$q', function ($http, $q) {
        var myData;
        // Going though bcw server
        var url = "http://bcw-getter.herokuapp.com/?url=";
        var url2 = "https://fluido.acceptiva.com/api/?api_key=Gu6Kt4WhagSQ99UmIQAP1LV0l3kpLgdg";
        var apiUrl = url + encodeURIComponent(url2);
        var paymentApi = function (orderInfo) {
            // return $http.post(apiUrl + '&action[0]=charge', JSON.stringify(orderInfo))
            return $http.get(apiUrl + '&action[0]=charge&params[0][payment_type]=1&params[0][items][0][id]=This%20%26%20That&params[0][items][0][desc]=This%20%26%20That&params[0][items][0][amt]=12.34&params[0][items][1][id]=This%20%26%20That&params[0][items][1][desc]=This%20%26%20That&params[0][items][1][amt]=12.34')
                .then(function (res, err) {
                    if (res) {
                        console.log('response:', res)
                        myData = res.data;
                        return myData;
                    } else if (err) {
                        console.log('error:', err);
                        return { 'error': err }
                    }
                })
        }
        // paymentApi()
        return {
            paymentApi: paymentApi
        }
        //API key for charge
        //https://fluido.acceptiva.com/api/?api_key=Gu6Kt4WhagSQ99UmIQAP1LV0l3kpLgdg&action[0]=charge

        //Full Test
        // + '&action[0]=charge&params[0][payer_' +
        // 'name]=Jane%20Tester&params[0][payment_type]=1&params[0][merch_acct_id_str]=15' +
        // '4&params[0][cc_num]=4111111111111111&params[0][cc_exp_mo]=12&params[0][cc_' +
        // 'exp_yr]=2016&params[0][dynamic_descriptor]=Building%20Fund&params[0][client_tr' +
        // 'ans_id]=12345&params[0][sub_id1]=112233&params[0][items][0][id]=00123&params[' +
        // '0][items][0][desc]=Widget&params[0][items][0][amt]=12.34&params[0][items][0][qty]=2'

    }])

    .factory('OrderService', [function () {
        var printOrder = {
            details: {
                date: 0,
                email: "",
                name: "",
                shirtColor: "",
                imageName: "",
                description: "",
                price: 0,
                design: "",
                shirtUrl: "",
                imageUrl: "",
                user: ""
            },
            logo: {
                postion: {
                    left: 0,
                    top: 0
                },
                size: {
                    height: 0,
                    width: 0
                }
            },
            quantity: 0,
            sizes: {},
            total: 0
        };
        //  var setCurrentOrder = function(order){
        //      currentOrder = order;
        //  }
        //  var getCurrentOrder = function(){
        //      return currentOrder;
        //  }
        return {
            //  setCurrentOrder: setCurrentOrder,
            //  getCurrentOrder: getCurrentOrder,
            printOrder: printOrder
        }

    }])

