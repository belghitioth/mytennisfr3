'use strict';

angular.module('mytennisfr2App')


  .controller('inscriptionAdherentCtrl',["$scope", "$firebaseObject", "$firebaseAuth","$location", '$animate','$firebaseArray',
    function ($scope, $firebaseObject, $firebaseAuth, $location, $animate, $firebaseArray) {
      var auth = $firebaseAuth();
       var ref=firebase.database().ref('/clubs/');
        $scope.clubs = $firebaseArray(ref.orderByChild("nom"));

       
      
      $scope.inscrireAdherent = function() {

        var nom =$scope.adherent.nom;
        var email = $scope.adherent.email;
        var password = $scope.adherent.mdp;
        var prenom = $scope.adherent.prenom;
        var club = $scope.adherent.club;
        console.log("club entré",club);
        var sexe = $scope.adherent.sexe;
        var key_club = "";
        var birthday = $scope.adherent.birthday;
        var nb_adherents = $scope.nb_adherents;
        var tel = $scope.adherent.tel;
        var classement = $scope.adherent.classement;

        var ref_clubs = firebase.database().ref('/clubs/');
    		var obj_clubs = $firebaseObject(ref_clubs);

         obj_clubs.$loaded().then(function() {
          angular.forEach(obj_clubs, function(value, key) {
          
              if(value.nom==club){             
                $scope.key_club = key;
              }           
              console.log($scope.key_club);    
              
              
            })

          auth.$createUserWithEmailAndPassword(email, password)
         .then(function(userRecord) {
        // A UserRecord representation of the newly created user is returned
            console.log("Utilisateur créé:", userRecord.uid);
            firebase.database().ref('/clubs/'+key_club +'/adherents/' +userRecord.uid).set({
              cid:userRecord.uid,
              nom: nom,
              prenom: prenom,
              sexe:sexe,
              email:email,
              birthday:birthday,
              tel:tel,
              classement:classement,
              mdp_adherent:password,
              adherent_active:'non'
              
            });
            //$location.path("/attente");
             $scope.status="Adhérent crée avec succés";     
            console.log("adherent créé en attente d'activation ...");
            


          //$location.path("/connexionAdherent");


          })
         .catch(function(error) {
        // Gestion des erreux
          var errorCode = error.code;         
          console.log(errorCode);         
          if(errorCode=='auth/weak-password'){
            $scope.status="Erreur : Mot de passe à - de 6 caractères";            
          }
          else if (errorCode=='auth/email-already-in-use'){      
            $scope.status="Erreur : Email déjà utilisé";           
              
            }       
          });

         obj_clubs.$loaded().then(function() {
          angular.forEach(obj_clubs, function(value, key) {  
            
            if(value.nom==$scope.adherent.club){
              key_club=key;
              console.log(key_club);
              $scope.nb_adherents=value.nombre_adherents;
              console.log($scope.nb_adherents);
              $scope.nb_adherents+=1;
              firebase.database().ref('/clubs/'+key_club).update({
                    nombre_adherents:$scope.nb_adherents,
                  });
            }

                  
            });
        });




      });
      
			
        



         

     }



       
      }
]);





