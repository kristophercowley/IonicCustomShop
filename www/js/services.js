/* global DBREF */
angular.module('app.services', [])

    .factory('BlankFactory', [function () {

    }])

    .factory('ShirtService', [function () {
        var selectedImage;
        var setLogo = function(img){
            selectedImage = img
        }
        var getLogo = function(){
            return selectedImage;
        }
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
            {   name: "strange icon",
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

