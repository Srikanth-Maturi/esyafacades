
// var APP = angular.module("RoutingApp", ["ngRoute"]); 

// APP.controller("RoutingCtrl", function(){
	
// })

// APP.config(function($routeProvider){
// 	$routeProvider
// 	.when('/', {
// 		templateUrl : "views/main.html",
// 	})
// 	.when('/about', {
// 		templateUrl : "views/about.html",
// 		controller : "AboutCtrl"
// 	})
	
// 	.when('/products', {
// 		templateUrl:"views/products.html",
// 		controller : "ProductsCtrl"
//     })
//     .when('/projects', {
//     	templateUrl:"views/projects.html",
//     	controller : "ProjectsCtrl"
//     })
//     .when('/contact', {
// 		templateUrl : "views/contact.html",
// 		controller : "ContactCtrl"
// 	})
// 	.otherwise({
// 		templateUrl : "views/404-page.html"
		
// 	})
// });

var APP = angular.module("RoutingApp", ["ngRoute"]); 

APP.controller("RoutingCtrl", function(){
	
})

APP.config(function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl : "views/main.html",
	})
	.when('/about', {
		templateUrl : "views/about.html",
		controller : "AboutCtrl"
	})
	
	.when('/products', {
		templateUrl:"views/products.html",
		controller : "ProductsCtrl"
    })
    .when('/glass-railings', {
		templateUrl:"views/glass-railings.html",
		controller : "GlassrailsCtrl"
    })

    .when('/glass-railings/handrails', {
		templateUrl:"views/glass-railings/handrails.html",
		controller : "HandrailsCtrl"
    })
     .when('/glass-railings/handrails/tubes-and-bars', {
		templateUrl:"views/glass-railings/handrails/tubes-and-bars.html",
		controller : "Tubes-and-barsCtrl"
    })
    .when('/glass-railings/cap-rails', {
		templateUrl:"views/glass-railings/cap-rails.html",
		controller : "CaprailsCtrl"
    })
    .when('/glass-railings/glass-panels-and-connectors', {
		templateUrl:"views/glass-railings/glass-panels-and-connectors.html",
		controller : "GlasspanelandconnectorsCtrl"
    })
    .when('/glass-railings/glass-railing-bases', {
		templateUrl:"views/glass-railings/glass-railing-bases.html",
		controller : "GasrailingbasesCtrl"
    })
    .when('/glass-railings/d-line', {
		templateUrl:"views/glass-railings/d-line.html",
		controller : "d-lineCtrl"
    })
    .when('/glass-railings/easy-glass-hybrid', {
		templateUrl:"views/glass-railings/easy-glass-hybrid.html",
		controller : "EasyglasshybridCtrl"
    })
    .when('/glass-railings/juliet-balcony', {
		templateUrl:"views/glass-railings/juliet-balcony.html",
		controller : "JulietbalconyCtrl"
    })

    .when('/glass-railings/accessories', {
		templateUrl:"views/glass-railings/accessories.html",
		controller : "AccessoriesCtrl"
    })

    .when('/baluster-railings', {
		templateUrl:"views/baluster-railings.html",
		controller : "BalusterrailingCtrl"
    })
    .when('/baluster-railings/baluster-posts', {
		templateUrl:"views/baluster-railings/baluster-posts.html",
		controller : "Baluster-postsCtrl"
    })
    .when('/baluster-railings/easy-alu', {
		templateUrl:"views/baluster-railings/easy-alu.html",
		controller : "Baluster-easyaluCtrl"
    })
    .when('/baluster-railings/handrails', {
		templateUrl:"views/baluster-railings/handrails.html",
		controller : "Baluster-handrailsCtrl"
    })
    .when('/baluster-railings/infills-and-connectors', {
		templateUrl:"views/baluster-railings/infills-and-connectors.html",
		controller : "Baluster-infills-and-connectorsCtrl"
    })
    .when('/baluster-railings/d-line', {
		templateUrl:"views/baluster-railings/d-line.html",
		controller : "Baluster-d-lineCtrl"
    })
    .when('/baluster-railings/barrier-line', {
		templateUrl:"views/baluster-railings/barrier-line.html",
		controller : "Baluster-barrier-lineCtrl"
    })

    .when('/wall-railings', {
		templateUrl:"views/wall-railings.html",
		controller : "Wall-railingCtrl"
    })
    .when('/wall-railings/handrails', {
		templateUrl:"views/wall-railings/handrails.html",
		controller : "Wall-handrailsCtrl"
    })
    .when('/wall-railings/d-line', {
		templateUrl:"views/wall-railings/d-line.html",
		controller : "Wall-d-lineCtrl"
    })
    .when('/wall-railings/accessories', {
		templateUrl:"views/wall-railings/accessories.html",
		controller : "Wall-accessoriesCtrl"
    })

    .when('/projects', {
    	templateUrl:"views/projects.html",
    	controller : "ProjectsCtrl"
    })

    .when('/contact', {
		templateUrl : "views/contact.html",
		controller : "ContactCtrl"
	})
	.otherwise({
		templateUrl : "views/404-page.html"
		
	})

	
});

