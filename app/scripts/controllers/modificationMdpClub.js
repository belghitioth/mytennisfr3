'use strict';

angular.module('mytennisfr2App')

  .controller('modificationMdpClubCtrl',["$scope", "$firebaseAuth",'$location','$rootScope',"$firebaseObject","$cookies","$firebaseArray",
   function ($scope, $firebaseAuth, $location,$rootScope,$firebaseObject,$cookies,$firebaseArray) {

        // Récupération de l'identifiant de l'utilisateur connecté
      var uid=$cookies.get('userId');
      var nomClub=$cookies.get('nomClub');
      $scope.nom=nomClub;

     $scope.retour= function() {      
      $location.path("/gestionClub");    
    }
      



      $scope.modifier=function(){

         

	       var email = $scope.club.email;
         var currentPassword = $scope.club.oldMdp;
			   var newPassword = $scope.club.newMdp ;
         var newPassword2 = $scope.club.newMdp2;
         
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
