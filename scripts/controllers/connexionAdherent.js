'use strict';

angular.module('mytennisfr2App')

  .controller('connexionAdherentCtrl',["$scope", "$firebaseAuth",'$location','$rootScope',"$firebaseObject","$cookies","$firebaseArray",
   function ($scope, $firebaseAuth, $location,$rootScope,$firebaseObject,$cookies,$firebaseArray) {
      
      var ref=firebase.database().ref('/clubs/');
      $scope.clubs = $firebaseArray(ref.orderByChild("nom"));

      var uEmail=$cookies.get('uEmail');
      $scope.adherent=[];
      $scope.adherent.email=uEmail;

        var authentification=function(club,email,password){
          var auth = $firebaseAuth();
          auth.$signInWithEmailAndPassword(email, password).then(function(authData){

            auth.$onAuthStateChanged(function(firebaseUser) {
              if (firebaseUser) {  
                $rootScope.userid=firebaseUser.uid;
                $cookies.put('userId', firebaseUser.uid);  
                $cookies.put('nomClub', club);  
                var userCookie = $cookies.get('userId');               
                console.log("Connecté en tant que: ",userCookie);
                // Vérification si adherent activé ou non
                var ref = firebase.database().ref('/clubs/');
                var obj = $firebaseObject(ref);
                obj.$loaded().then(function() {
                angular.forEach(obj, function(value, key) {  
                
                  if(value.nom==club){
                    console.log(value.nom);
                    var key_club=key;
                    var ref = firebase.database().ref('/clubs/'+key_club+'/adherents/');
                    var obj = $firebaseObject(ref);
                    obj.$loaded().then(function() {
                    angular.forEach(obj, function(value, key) {                        
                      if (key==userCookie){
                                          
                        if(value.adherent_active=='non'){
                            $scope.status='Vous êtes bien inscris ... Cependant il faut attendre que votre inscription soit validé par votre club';
                            //$location.path("/attente");
                        }
                      // Si Adherent activé direction accueilAdherent
                        else{
                            console.log('Redirection...'); 
                            $location.path("/accueilAdherent");
                            }          
                        }                 
                       });
                      });
                    }
                  });
                });  
              }
            });        
          // Si Mot de passe erroné ou Utilisateur inexistant
          }).catch(function(error) {
              // Gestion des erreurs.
              
              var errorCode = error.code;
              
              if (errorCode=='auth/wrong-password'){
                console.log('Mot de passe erroné');
                $scope.status = 'Mot de passe erroné';
                           
              }
              else if(errorCode== 'auth/user-not-found'){
                console.log("Utilisateur inexistant")
                 $scope.status = 'Utilisateur inexistant';             
              
              }
              
          });
        }
      
         
      $scope.connecterAdherent = function() {
       
       
        var club =$scope.adherent.club;   
        var email = $scope.adherent.email;
        var password = $scope.adherent.mdp; 
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
              if(!cluboradmin){
                $scope.status="Connexion..."
                authentification(club,email,password);
              }
              else{
                $scope.status="Erreur: l'email n'est pas celui d'un adhérent";
              }
              
          })   
        //Fin vérification  

    
       
      }


    }]);

