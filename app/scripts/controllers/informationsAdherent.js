'use strict';

angular.module('mytennisfr2App')

  .controller('informationsAdherentCtrl',["$scope", "$firebaseAuth",'$location',"$firebaseObject",'$rootScope',"$firebaseArray","$cookies",
   	function ($scope, $firebaseAuth, $location, $firebaseObject,$rootScope,$firebaseArray, $cookies) {

   		// Récupération de l'identifiant de l'utilisateur connecté
   		var uid=$cookies.get('userId');
   		var nomClub=$cookies.get('nomClub');
   		  
   		// Récupération des informations liées à l'utilisateur connecté
   		var recuperer_infos = function(){

	   	var ref_clubs = firebase.database().ref('/clubs/');
			var obj_clubs = $firebaseObject(ref_clubs);
			
			obj_clubs.$loaded().then(function() {
		     	angular.forEach(obj_clubs, function(value, key) {
		           	if(value.nom==nomClub){		       			
			       		$scope.club_id=key;
			       	}	 		       		   			        
		       	});
          recuperer_infos_user($scope.club_id,uid);
         

	     		
		     	});


			
   		}
   		
      var recuperer_infos_user = function(club_id,user_id){
        var ref_adherent=firebase.database().ref('clubs/'+club_id+'/adherents/'+user_id);
        var obj_adherent=$firebaseObject(ref_adherent);
        $scope.infos={};

          obj_adherent.$loaded().then(function(){
            angular.forEach(obj_adherent, function(value, key){
              $scope.infos[key]=value;
             
                $scope.prenom=$scope.infos['prenom'];
           
              
            });
          })   
    
      }

  	 	recuperer_infos();
      
      	
   	$scope.modifierMdp = function() {
      $location.path("/modificationMdp");
    }
		
		
		$scope.deconnecterAdherent = function() {
			var auth = $firebaseAuth();
			auth.$signOut();
			 $location.path("/");
    
		}
		         
    }]);