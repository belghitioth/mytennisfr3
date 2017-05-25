'use strict';

angular.module('mytennisfr2App')

  .controller('connexionClubCtrl',
   function ($scope, $firebaseAuth, $location,$rootScope,$firebaseObject, $cookies) {
      $scope.log = '';
      var auth = $firebaseAuth();
      
         
      $scope.connecterClub = function() {
       
        $scope.log = 'Connexion ....';       
        var email = $scope.club.email;
        var password = $scope.club.mdp;  
  

        auth.$signInWithEmailAndPassword(email, password).then(function(authData){

          auth.$onAuthStateChanged(function(firebaseUser) {
            if (firebaseUser) {  
              $rootScope.userid=firebaseUser.uid; 
                // Setting a cookie
             $cookies.put('userId', firebaseUser.uid);  

                    // Retrieving a cookie
           var userCookie = $cookies.get('userId');
                   
              // Si Admin connecté
              if (userCookie=='PrGY6VjbMJVxixsv1L99DoskXMZ2'){
                // Direction Interface Administrateur
                console.log("Connecté en tant qu'Admin ",userCookie);
                $location.path("/gestionAdmin");
              }
              else{
             
                console.log("Connecté en tant que: ",userCookie);
                // Vérification si club activé ou non
                var ref = firebase.database().ref('/clubs/');
                var obj = $firebaseObject(ref);
                obj.$loaded().then(function() {
                  angular.forEach(obj, function(value, key) {  
            
                    if (key==userCookie){           
                           
                      if(value.club_active=='non'){
                        console.log('Erreur : Club non activé');
                        $scope.log = "Erreur : Club non activé , votre inscription n'as pas encore été validé par l'administrateur";

                      }
                      // Si Club activé direction gestionClub
                      else{
                        console.log('Redirection...'); 
                        $location.path("/gestionClub");

                      }
                      
                    }                 
                    });
                });
              
              }

            }

          });        
        // Si Mot de passe erroné ou Utilisateur inexistant
        }).catch(function(error) {
            // Gestion des erreurs.
            
            var errorCode = error.code;
            
            if (errorCode=='auth/wrong-password'){
              console.log('Mot de passe erroné');
              $scope.log = 'Mot de passe erroné';
                         
            }
            else if(errorCode== 'auth/user-not-found'){
              console.log("Utilisateur inexistant")
               $scope.log = 'Utilisateur inexistant';             
            
            }
            
        });
       
      }


    });

