'use strict';

angular.module('mytennisfr2App')


  .controller('reservationsAdherentCtrl',["$scope", "$firebaseAuth",'$location',"$firebaseObject",'$rootScope',"$firebaseArray","$cookies",
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
          afficher_creneaux($scope.club_id);
          

	     		
		     	});


			
   		}
   		var afficher_creneaux = function(club_id){
        var ref_creneaux = firebase.database().ref('/clubs/'+club_id+'/creneaux');
        var obj_creneaux= $firebaseObject(ref_creneaux);
        $scope.creneaux={};

        obj_creneaux.$loaded().then(function(){
          angular.forEach(obj_creneaux,function(value,key){
            if (value.id_user==uid){
              $scope.creneaux[key]=value;
            };
            
          });
  
        });
       
    
   		}
      var recuperer_infos_user = function(club_id,user_id){
        var ref_adherent=firebase.database().ref('clubs/'+club_id+'/adherents/'+user_id);
        var obj_adherent=$firebaseObject(ref_adherent);

          obj_adherent.$loaded().then(function(){
            angular.forEach(obj_adherent, function(value, key){
              if(key=='prenom'){
                $scope.prenom=value;
              }
              
            });
          })   
    
      }

  	 	recuperer_infos();
      
      	
   	  
		
		
		$scope.deconnecterAdherent = function() {
			var auth = $firebaseAuth();
			auth.$signOut();
			 $location.path("/");
    
		}
		         
    }]);
