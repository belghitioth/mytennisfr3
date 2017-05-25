'use strict';

angular.module('mytennisfr2App')


  .controller('gestionAdherentsCtrl',["$scope", "$firebaseAuth",'$location',"$firebaseObject",'$rootScope',"$firebaseArray","$cookies",
   	function ($scope, $firebaseAuth, $location, $firebaseObject,$rootScope,$firebaseArray,$cookies) {
  	 		
      	var uid=$cookies.get('userId');
	  	var ref = firebase.database().ref('/clubs/'+uid);
		var obj = $firebaseObject(ref);

		obj.$loaded().then(function() {
	     	angular.forEach(obj, function(value, key) {
	     		
	           	if(key=='nom'){		       		
		       		$scope.nom = value;
		       	}	 		       		
		       	if(key=='nombre_adherents'){
		       		$scope.nb_adherents= value;		       		
		       	}			       
		        
	       	});
	       	ref=firebase.database().ref('/clubs/'+uid+'/adherents');
     		$scope.adherents = $firebaseArray(ref.orderByChild("nom"));
     		
     	});
			
   	   $scope.activerAdherent = function(cid) {
          
        var ref = firebase.database().ref('/clubs/'+uid+'/adherents/');
        var obj = $firebaseObject(ref);
      obj.$loaded().then(function() {
            angular.forEach(obj, function(value, key) {  
            if (key==cid){
              firebase.database().ref('/clubs/'+uid+'/adherents/'+key).update({
              adherent_active:'oui',
            });

            }                 
            });
        });


    }

      $scope.desactiverAdherent = function(cid) {
            
      var ref = firebase.database().ref('/clubs/'+uid+'/adherents/');
      var obj = $firebaseObject(ref);
      obj.$loaded().then(function() {
            angular.forEach(obj, function(value, key) {  
            if (key==cid){
              firebase.database().ref('/clubs/'+uid+'/adherents/'+key).update({
              adherent_active:'non',
            });

            }                 
            });
        });


    }
		
		var auth = $firebaseAuth();
		$scope.deconnecterClub = function() {
			auth.$signOut();
			 $location.path("/");
    
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


		$scope.ajouterAdherent = function() {
			
		auth.$createUserWithEmailAndPassword($scope.adherentnew.email,'123456')
         .then(function(userRecord) {
        // A UserRecord representation of the newly created user is returned

			console.log("j'ajoute un adhérent");
			var nb_adherentsnew=$scope.nb_adherents+1;
			$scope.nb_adherents+=1;
			firebase.database().ref('/clubs/' +uid).update({
                nombre_adherents:nb_adherentsnew
            });
			firebase.database().ref('/clubs/' +uid+'/adherents/'+userRecord.uid).set({
                nom:$scope.adherentnew.nom,
                prenom:$scope.adherentnew.prenom,
                birthday:$scope.adherentnew.birthday,
                email:$scope.adherentnew.email,
                cid:userRecord.uid,
                adherent_active:"non"
            });
    
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
		               
    }]);
