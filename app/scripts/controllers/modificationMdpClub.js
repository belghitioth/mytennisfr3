'use strict';

angular.module('mytennisfr2App')

  .controller('modificationMdpClubCtrl',["$scope", "$firebaseAuth",'$location','$rootScope',"$firebaseObject","$cookies","$firebaseArray",
   function ($scope, $firebaseAuth, $location,$rootScope,$firebaseObject,$cookies,$firebaseArray) {

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



      $scope.modifier=function(){

         

	       var email = $scope.adherent.email;
         var currentPassword = $scope.adherent.oldMdp;
			   var newPassword = $scope.adherent.newMdp ;
         var newPassword2 = $scope.adherent.newMdp2;
         
         firebase.auth().signInWithEmailAndPassword(email, currentPassword).then(function(){
              var user = firebase.auth().currentUser;
         
              if (newPassword==newPassword2){
                  $scope.log='Votre mot de passe a bien été modifié';
                  console.log(newPassword);
               

                  user.updatePassword(newPassword).then(function() {
                // Update successful.
                  console.log('mdp modifie');
                  
                  
                    }, function(error) {
                  // An error happened.
                    });
               }
               else {
                $scope.log='  Modification impossible: Les deux champs Nouveau Mot de Passe ne sont pas identiques';
                
               }
         })
         .catch(function(error) {
            // Handle Errors here.
            $scope.log= ' Email ou Mot de Passe incorrect ';
            var errorCode = error.code;
            var errorMessage = error.message;
            
            // ...
          });


          
         
      }
      $scope.deconnecterAdherent = function() {
        var auth = $firebaseAuth();
        auth.$signOut();
        $location.path("/");
    
    }

    }]);
