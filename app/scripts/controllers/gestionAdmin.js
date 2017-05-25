'use strict';

angular.module('mytennisfr2App')


  .controller('gestionAdminCtrl',["$scope", "$firebaseAuth",'$location',"$firebaseObject",'$rootScope',"$firebaseArray","$cookies",
   function ($scope, $firebaseAuth, $location, $firebaseObject,$rootScope, $firebaseArray,$cookies) {
  	 		
      	

     	var uid=$cookies.get('userId');
       
		
	    var ref = firebase.database().ref('/clubs/');
	    var nb_clubs=-1;

    	// Récupération du nombre de clubs
		var obj = $firebaseObject(ref);
		obj.$loaded().then(function() {
        	angular.forEach(obj, function(value, key) {    			
    			nb_clubs+=1;	
    			console.log(nb_clubs)	;		        
       		});
       		// Récupération des données des clubs dans un tableau
	     	$scope.clubs = $firebaseArray(ref);
		    var query = ref.orderByChild("nom").limitToLast(nb_clubs);
		    $scope.filteredClubs = $firebaseArray(query);

     	});

		


	    $scope.activerClub = function(cid) {
	    		
    		var ref = firebase.database().ref('/clubs/');
    		var obj = $firebaseObject(ref);
			obj.$loaded().then(function() {
	        	angular.forEach(obj, function(value, key) {  
	    			if (key==cid){
	    				firebase.database().ref('/clubs/'+key).update({
					  	club_active:'oui',
					  });

	    			}					        
	       		});
	     	});


		}

		  $scope.desactiverClub = function(cid) {
	    			
		 	var ref = firebase.database().ref('/clubs/');
		 	var obj = $firebaseObject(ref);
			obj.$loaded().then(function() {
	        	angular.forEach(obj, function(value, key) {  
	    			if (key==cid){
	    				firebase.database().ref('/clubs/'+key).update({
					  	club_active:'non',
					  });

	    			}					        
	       		});
	     	});


		}

		  
		var auth = $firebaseAuth();
		$scope.deconnecterAdmin = function() {
			auth.$signOut();
			 $location.path("/");
    

		}


		    
       
       
                  
       // $location.path("/gestionClub/" );
       
      }]);
