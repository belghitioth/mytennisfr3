'use strict';

angular.module('mytennisfr2App')
  .controller('inscriptionClubCtrl',
    function ($scope, $firebaseAuth, $location) {
      var auth = $firebaseAuth();
      $scope.log = '';

      $scope.inscrireClub = function() {

        var nom =$scope.club.nom;
        var email = $scope.club.email;
        var password = $scope.club.mdp;
        var ville = $scope.club.ville;
        var tel=$scope.club.tel;


         auth.$createUserWithEmailAndPassword(email, password)
         .then(function(userRecord) {
        // A UserRecord representation of the newly created user is returned
            console.log("Utilisateur créé:", userRecord.uid);
            firebase.database().ref('/clubs/' +userRecord.uid).set({
              nom: nom,
              ville: ville,
              email:email,
              club_active:'non',
              nombre_terrains:0,
              nombre_adherents:0
            });
            console.log("Club crée en attente d'activation ...");


            $scope.log="Club crée en attente d'activation ...";


          $location.path("/connexionClub");


          })
         .catch(function(error) {
        // Gestion des erreur
          var errorCode = error.code;         
          console.log(errorCode);         
          if(errorCode=='auth/weak-password'){
            $scope.log="Erreur : Mot de passe à - de 6 caractères";            
          }
          else if (errorCode=='auth/email-already-in-use'){      
            $scope.log="Erreur : Email déjà utilisé";           
              
            }       
          });


     }

       
      });
