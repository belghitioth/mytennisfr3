'use strict';

angular.module('mytennisfr2App')

  .controller('informationsClubCtrl',["$scope", "$firebaseAuth",'$location',"$firebaseObject",'$rootScope',"$firebaseArray","$cookies",
   	function ($scope, $firebaseAuth, $location, $firebaseObject,$rootScope,$firebaseArray, $cookies) {
  		  

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
            if(key=='email'){           
              $scope.email=value;
            }     
            
        });  

    });

   	$scope.modifierMdp = function() {
      $location.path("/modificationMdpClub");
    }
		
		
		$scope.deconnecterClub = function() {
			var auth = $firebaseAuth();
			auth.$signOut();
			 $location.path("/");
    
		}
		         
}]);