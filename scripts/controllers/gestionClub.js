'use strict';

angular.module('mytennisfr2App')


  .controller('gestionClubCtrl',["$scope", "$firebaseAuth",'$location',"$firebaseObject",'$rootScope',"$firebaseArray","$cookies",
   	function ($scope, $firebaseAuth, $location, $firebaseObject,$rootScope,$firebaseArray,$cookies) {
  	 		
      	var uid=$cookies.get('userId');
	  	
		//recupérer infos club
	    var ref = firebase.database().ref('/clubs/'+uid);
	    ref.once("value").then(function(snapshot) {
	            $scope.infos_club=snapshot.val();
	          });
  
       	var ref_terrains=firebase.database().ref('/clubs/'+uid+'/terrains');
 		$scope.terrains = $firebaseArray(ref_terrains.orderByChild("nom"));
     	
		
		$scope.deconnecterClub = function() {
			var auth = $firebaseAuth();
			auth.$signOut();
			 $location.path("/");
    
		}
		$scope.afficherPlanning=function(nom_terrain){
			var ref_terrains=firebase.database().ref('/clubs/'+uid+'/terrains/');
			var obj_terrains= $firebaseObject(ref_terrains);
			obj_terrains.$loaded().then(function() {
	     	angular.forEach(obj_terrains, function(value, key) {
	           	if(value.nom==nom_terrain){		       		
		       		 $cookies.put('terrain_id', key);  
		       	}
		       	$location.path("/planningClub");	 		       					       
		        
	       	});

	     })
	       
		}
		$scope.supprimerTerrain = function(nom){
			console.log("ok");
	      var ref = firebase.database().ref('/clubs/'+uid+'/terrains/');
	      var obj = $firebaseObject(ref);
	      
	      var nb_terrainsnew=$scope.nb_terrains;
	      nb_terrainsnew=nb_terrainsnew-1;
	      
	      firebase.database().ref('/clubs/' +uid).update({

	                nombre_terrains:nb_terrainsnew

	            });
	      $scope.nb_terrains=nb_terrainsnew;
	      obj.$loaded().then(function() {
	            angular.forEach(obj, function(value, key) {  
	              if (value.nom==nom){
	                firebase.database().ref('/clubs/'+uid+'/terrains/'+key).remove();

	                }
	            });
	      });
	    }


		
		$scope.ajouterTerrain = function() {
			var nb_terrainsnew=$scope.nb_terrains+1;
			$scope.nb_terrains+=1;
			firebase.database().ref('/clubs/' +uid).update({
                nombre_terrains:nb_terrainsnew
            });
			firebase.database().ref('/clubs/' +uid+'/terrains/'+nb_terrainsnew).set({
                nom:$scope.terrainnew.nom,
                type:$scope.terrainnew.type
            });
    
		}

		
      $scope.retour= function() {      
      $location.path("/gestionClub");    
    }
 
		
		    
              
    }]);
