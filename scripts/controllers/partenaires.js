'use strict';

angular.module('mytennisfr2App')

  .controller('partenairesCtrl',["$scope", "$firebaseAuth",'$location','$rootScope',"$firebaseObject","$cookies","$firebaseArray",
   function ($scope, $firebaseAuth, $location,$rootScope,$firebaseObject,$cookies,$firebaseArray) {
      $scope.log = '';
      			// Récupération de l'identifiant de l'utilisateur connecté
   		var uid=$cookies.get('userId');
   		var nomClub=$cookies.get('nomClub');
   		var club_id="";
   				var ref_clubs = firebase.database().ref('/clubs/');
			var obj_clubs = $firebaseObject(ref_clubs);
			
			obj_clubs.$loaded().then(function() {
		     	angular.forEach(obj_clubs, function(value, key) {
		           	if(value.nom==nomClub){		       			
			       		club_id=key;
			       	}	 		       		   			        
		       	});
		      });
		$scope.adherents={};

   		

      	$scope.trouverPartenaire = function(){
      		$scope.adherents={};
      		var classement=$scope.demande.classement;
      		var sexe=$scope.demande.sexe;
      		var birthday=$scope.demande.birthday;

      			console.log(classement);
	      var ref_adherents=firebase.database().ref('/clubs/'+club_id+'/adherents').orderByChild('classement');
	      var obj_adherents=$firebaseObject(ref_adherents);
			console.log(obj_adherents);
			 obj_adherents.$loaded().then(function(){
          angular.forEach(obj_adherents,function(value,key){
            if ((value.classement==classement || classement==undefined) && (value.sexe==sexe || sexe==undefined) && (value.birthday==birthday || classement==undefined)){
              $scope.adherents[key]=value;
            };

            
          });

  
        });
 


      

    }

}]);

