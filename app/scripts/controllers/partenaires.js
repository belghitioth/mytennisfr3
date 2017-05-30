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
      $scope.demande={};
			
			obj_clubs.$loaded().then(function() {
		     	angular.forEach(obj_clubs, function(value, key) {
		           	if(value.nom==nomClub){		       			
			       		club_id=key;
			       	}	 		       		   			        
		       	});
		      });


   		

      $scope.trouverPartenaire = function(){
      		$scope.partenaires={};
      		var classement=$scope.demande.classement;
      		var sexe=$scope.demande.sexe;
      		var birthday=$scope.demande.birthday;

          console.log(club_id);


        var ref_adherents=firebase.database().ref('/clubs/'+club_id+'/adherents');
        //    ref_adherents.once("value")
        //   .then(function(snapshot) {
        //     snapshot.forEach(function(childSnapshot) {
              
              
        //         if(childSnapshot.val()['classement']==classement)
        //         {
      
        //           $scope.partenaires[childSnapshot.val()['cid']]=childSnapshot.val();
        //         }
        //       })
        //     console.log($scope.partenaires);
        //   });

      		console.log("sexe",sexe);
            console.log("birthday",typeof(birthday));
              console.log(classement);
            console.log("type :",typeof(classement))
	      var obj_adherents=$firebaseObject(ref_adherents);
			 obj_adherents.$loaded().then(function(){
          angular.forEach(obj_adherents,function(value,key){
            if ((value.classement==classement || classement===undefined) && (value.sexe==sexe || sexe===undefined) && (value.birthday==birthday || classement===undefined)){
                $scope.partenaires[key]=value;
            }
          

            
            // if ((value.classement==classement || classement===undefined) && (value.sexe==sexe || sexe===undefined) && (value.birthday==birthday || classement===undefined)){
            //   $scope.partenaires[key]=value;
            //   console.log($scope.partenaires);
            // };

            
          });

  
        });
 


      

    }

}]);

