'use strict';

angular.module('mytennisfr2App')

  .controller('connexionClubCtrl',
   function ($scope, $firebaseAuth, $location,$rootScope,$firebaseObject, $cookies) {
     
      
      var authentification =function(email,password){

        var auth = $firebaseAuth();
        auth.$signInWithEmailAndPassword(email, password).then(function(authData){

          auth.$onAuthStateChanged(function(firebaseUser) {
            if (firebaseUser) {  
              $rootScope.userid=firebaseUser.uid;             
              $cookies.put('userId', firebaseUser.uid);  
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
                var ref_club = firebase.database().ref('/clubs/'+userCookie);
                var obj_club = $firebaseObject(ref_club);
                obj_club.$loaded().then(function() {
                  angular.forEach(obj_club, function(value, key) {  
            
                    if (key=='club_active'){           
                           
                      if(value=='non'){
                        console.log('Erreur : Club non activé');
                        $scope.status= "Erreur : Club non activé , votre inscription n'as pas encore été validé par l'administrateur";
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
              $scope.status = 'Mot de passe erroné';
                         
            }
            else if(errorCode== 'auth/user-not-found'){             
               $scope.status = 'Utilisateur inexistant';         
            }
            
        });
      


      }
      
         
      $scope.connecterClub = function() {
       
        $scope.log = 'Connexion ....'; 
        var email = $scope.club.email;
        var password = $scope.club.mdp;    
       //Vérification si Admin ou Club
        var cluboradmin=false;     
        var ref_clubs=firebase.database().ref('/clubs/');
        var obj_clubs=$firebaseObject(ref_clubs);
         obj_clubs.$loaded().then(function() {
              angular.forEach(obj_clubs, function(value, key) { 
                  if(value.email==email){
                    cluboradmin=true;
                  } 
              })  
               if(email=='admin@gmail.com'){
                  cluboradmin=true;
              }
              if(cluboradmin){
                authentification(email,password);
              }
              else{
                $scope.status="Erreur: l'email n'est pas celui d'un club";
              }
              
          })   

          //Fin vérification si Admin ou Club    
      }


    });

