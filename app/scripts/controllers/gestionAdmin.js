'use strict';

angular.module('mytennisfr2App')


  .controller('gestionAdminCtrl',["$scope", "$firebaseAuth",'$location',"$firebaseObject",'$rootScope',"$firebaseArray","$cookies",
   function ($scope, $firebaseAuth, $location, $firebaseObject,$rootScope, $firebaseArray,$cookies) {
  	 		
      	

     	var uid=$cookies.get('userId');
       
		
	    var ref = firebase.database().ref('/clubs/');
	    var nb_clubs=0;

    	// Récupération du nombre de clubs
		var obj = $firebaseObject(ref);
		obj.$loaded().then(function() {
        	angular.forEach(obj, function(value, key) {    			
    			nb_clubs+=1;		        
       		});
       		$scope.nb_clubs=nb_clubs
       		// Récupération des données des clubs dans un tableau
	     	$scope.clubs = $firebaseArray(ref);
		    var query = ref.orderByChild("nom");
		    $scope.filteredClubs = $firebaseArray(query);

     	});

		


	    $scope.activationClub = function(nomClub,etat) {
	    	
    		var ref = firebase.database().ref('/clubs/');
    		var obj = $firebaseObject(ref);
    		var newetat='';
        	etat=='oui'? newetat="non":newetat="oui";
			obj.$loaded().then(function() {
	        	angular.forEach(obj, function(value, key) {  
	    			if (value.nom==nomClub){
	    				firebase.database().ref('/clubs/'+key).update({
					  	club_active:newetat,
					  });

	    			}					        
	       		});
	     	});


		}

		  
		  
		
		$scope.deconnecterAdmin = function() {
			var auth = $firebaseAuth();
			auth.$signOut();
			 $location.path("/");
    

		}


		    
       
       
                  
       // $location.path("/gestionClub/" );
       
      }]);
