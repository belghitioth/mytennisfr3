'use strict';

angular.module('mytennisfr2App.modificationMdp', ['ngRoute','firebase'])
// Declared route 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/modificationMdp', {
        templateUrl: 'vues/modification_mdp.html',
        controller: 'modificationMdpCtrl'
    });
}])

  .controller('modificationMdpCtrl',["$scope", "$firebaseAuth",'$location','$rootScope',"$firebaseObject","$cookies","$firebaseArray",
   function ($scope, $firebaseAuth, $location,$rootScope,$firebaseObject,$cookies,$firebaseArray) {

        // Récupération de l'identifiant de l'utilisateur connecté
      var uid=$cookies.get('userId');
      var nomClub=$cookies.get('nomClub');

      // Récupération des informations liées à l'utilisateur connecté
      var recuperer_infos = function(){

      var ref_clubs = firebase.database().ref('/clubs/');
      var obj_clubs = $firebaseObject(ref_clubs);
      
      obj_clubs.$loaded().then(function() {
          angular.forEach(obj_clubs, function(value, key) {
                if(value.nom==nomClub){               
                $scope.club_id=key;
              }                               
            });
          recuperer_infos_user($scope.club_id,uid);
         

          
          });


      
      }
      
      var recuperer_infos_user = function(club_id,user_id){
        var ref_adherent=firebase.database().ref('clubs/'+club_id+'/adherents/'+user_id);
        var obj_adherent=$firebaseObject(ref_adherent);
        $scope.infos={};

          obj_adherent.$loaded().then(function(){
            angular.forEach(obj_adherent, function(value, key){
              $scope.infos[key]=value;
             
                $scope.prenom=$scope.infos['prenom'];
           
              
            });
          })   
    
      }
    }]);

