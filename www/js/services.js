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
            }
        ]
        
        return {
            shirts: shirts,
            images: images,
            setLogo: setLogo,
            getLogo: getLogo
        }
        
    }])

    .service('AuthService', [function () {
        this.user = {}
        this.getUser = function () {
            return this.user
        }
    }]);

