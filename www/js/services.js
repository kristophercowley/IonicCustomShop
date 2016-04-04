/* global DBREF */
angular.module('app.services', [])

    .service('BlankService', [function () {

    }])

    .factory('ShirtService', [function () {
        var selectedImage;
        var setLogo = function(img){
            selectedImage = img
        }
        var getLogo = function(){
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
            }
        ];
        var images = [
            {   name: "biohazard",
                image:"img/bio.png",
                description: "testing1,2,3",
                checked: true
            },
             {   name: "tape",
                 image:"img/tape.png"
            },
             {   name: "x",
                 image:"img/x.png"
            },
             {   name: "swirl",
                 image:"img/swirl.png"
            },
             {   name: "tea",
                 image:"img/tea.png"
            },
             {   name: "diamond",
                 image:"img/diamond.png"
            },
            {    name: "strange icon",
                 image:"img/favicon.png"
            },
             {   name: "bcw1",
                 image:"img/bcw.png"
            },
             {   name: "finalunderground",
                 image:"img/fug.jpg"
            },
             {   name: "strange logo",
                 image:"img/strange-logo.png"
            },
            {
                name: "star wars",
                image: "http://vignette2.wikia.nocookie.net/logopedia/images/5/5b/Star-Wars-Logo_Silver.png/revision/latest?cb=20151106011636"
            }
        ]
        
        var printedShirts = [
            {   name: "Red Shirt",
                description: "To show the color red",
                url:"img/HaZGfL4NSfWrZxS6elpE_red.jpg"
            },
             {  name: "The Dude",
                description: "Your Brand Name Here",
                url:"img/0wnQdP9rTri3jPQDabCb_dude.jpg"
            },
             {  name: "Example",
                description: "Put Some Info Here",
                url:"img/HL8o9tVlS9mcDc8pUXks_screen.jpg"
            },
             {  name: "MMA",
                description: "Copyright not mine",
                url:"img/73Uqk9EQX6I9fvfUF8zQ_mma.jpg"
            },
             {  name: "Construction",
                description: "Brown Shirt Description",
                url:"img/dxgHxn27R8WiP3GczJF9_construction.jpg"
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

    .service('AuthService', [function () {
        this.user = {}
        this.getUser = function () {
            return this.user
        }
    }])
    
     .service('CartService', [function () {
        // this.cartOrder = {}
        // this.getCartOrder = function () {
        //     return this.cartOrder;
        // }
        
        
    }])
    
     .factory('OrderService', [function () {
         var currentOrder =  {};
         var setCurrentOrder = function(order){
             currentOrder = order;
         }
         var getCurrentOrder = function(){
             return currentOrder;
         }
         return {
             setCurrentOrder: setCurrentOrder,
             getCurrentOrder: getCurrentOrder,
             currentOrder: currentOrder
         }
      
    }])

