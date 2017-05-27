'use strict';

angular.module('mytennisfr2App')


  .controller('gestionAdherentsCtrl',["$scope", "$firebaseAuth",'$location',"$firebaseObject",'$rootScope',"$firebaseArray","$cookies",
   	function ($scope, $firebaseAuth, $location, $firebaseObject,$rootScope,$firebaseArray,$cookies) {
  	 		
    	var uid=$cookies.get('userId');
	  	

		  //recupérer infos club
      var ref = firebase.database().ref('/clubs/'+uid);
      ref.once("value").then(function(snapshot) {
            $scope.infos_club=snapshot.val();
          });
  

	     var ref_adherents=firebase.database().ref('/clubs/'+uid+'/adherents');
        $scope.adherents = $firebaseArray(ref_adherents.orderByChild("nom"));
  
         
    
     	
   
			
   	   $scope.activationAdherent = function(cid,etat) {
          
        var ref = firebase.database().ref('/clubs/'+uid+'/adherents/');
        var obj = $firebaseObject(ref);
        var newetat='';
        etat=='oui'? newetat="non":newetat="oui";
      obj.$loaded().then(function() {
            angular.forEach(obj, function(value, key) {  
            if (key==cid){
              firebase.database().ref('/clubs/'+uid+'/adherents/'+key).update({
              adherent_active:newetat,
            });

            }                 
            });
        });


    }

		
		
		$scope.deconnecterClub = function() {
      var auth = $firebaseAuth();
			auth.$signOut();
			 $location.path("/");
    
		}

    $scope.modifierMdp = function() {
      $location.path("/modificationMdpClub");
    }
    
   

    $scope.supprimerAdherent = function(cid){
      var ref = firebase.database().ref('/clubs/'+uid+'/adherents/');
      var obj = $firebaseObject(ref);
      
      var nb_adherentsnew=$scope.nb_adherents;
      nb_adherentsnew=nb_adherentsnew-1;
      
      firebase.database().ref('/clubs/' +uid).update({

                nombre_adherents:nb_adherentsnew

            });
      $scope.nb_adherents=nb_adherentsnew;
      obj.$loaded().then(function() {
            angular.forEach(obj, function(value, key) {  
              if (key==cid){
                firebase.database().ref('/clubs/'+uid+'/adherents/'+key).remove();

                }
            });
      });
    }

		               
    }]);
