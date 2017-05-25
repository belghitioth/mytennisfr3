'use strict';

angular.module('mytennisfr2App')

  .controller('connexionAdherentCtrl',["$scope", "$firebaseAuth",'$location','$rootScope',"$firebaseObject","$cookies","$firebaseArray",
   function ($scope, $firebaseAuth, $location,$rootScope,$firebaseObject,$cookies,$firebaseArray) {
      $scope.log = '';
      var auth = $firebaseAuth();
       var ref=firebase.database().ref('/clubs/');
      $scope.clubs = $firebaseArray(ref.orderByChild("nom"));

        var uEmail=$cookies.get('uEmail');
        console.log(uEmail);
        $scope.adherent=[];
        $scope.adherent.email=uEmail;
      
         
      $scope.connecterAdherent = function() {
       
        $scope.log = 'Connexion ....';
        var club =$scope.adherent.club;   
        var email = $scope.adherent.email;
        var password = $scope.adherent.mdp; 
        var key_club="";    

        auth.$signInWithEmailAndPassword(email, password).then(function(authData){

          auth.$onAuthStateChanged(function(firebaseUser) {
            if (firebaseUser) {  
              $rootScope.userid=firebaseUser.uid;  

               $cookies.put('userId', firebaseUser.uid);  
                $cookies.put('nomClub', club);  

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
                // Vérification si adherent activé ou non

                var ref = firebase.database().ref('/clubs/');
                var obj = $firebaseObject(ref);
                obj.$loaded().then(function() {
                  angular.forEach(obj, function(value, key) {  
                  
                    if(value.nom==$scope.adherent.club){
                      console.log(value.nom);
                      key_club=key;



                    var ref = firebase.database().ref('/clubs/'+key_club+'/adherents/');
                    var obj = $firebaseObject(ref);
                 	obj.$loaded().then(function() {
                      angular.forEach(obj, function(value, key) {
                      
                      	if (key==userCookie){
                                            
                        	if(value.adherent_active=='non'){
                          		$location.path("/attente");
                              console.log('Erreur : Adhérent non activé');
                              

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


    }]);

