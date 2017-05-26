'use strict';

angular.module('mytennisfr2App')

  .controller('accueilAdherentCtrl',["$scope", "$firebaseAuth",'$location',"$firebaseObject",'$rootScope',"$firebaseArray","$cookies", "$mdDialog",
   	function ($scope, $firebaseAuth, $location, $firebaseObject,$rootScope,$firebaseArray, $cookies,$mdDialog) {

   		// Récupération de l'identifiant de l'utilisateur connecté
   		var uid=$cookies.get('userId');
   		var nomClub=$cookies.get('nomClub');
      $scope.nomClub=nomClub;
   		  
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

		       	var ref_terrains=firebase.database().ref('/clubs/'+$scope.club_id+'/terrains');
	     		$scope.terrains = $firebaseArray(ref_terrains.orderByChild("nom"));

            var ref_adherents=firebase.database().ref('/clubs/'+$scope.club_id+'/adherents');
          $scope.adherents = $firebaseArray(ref_adherents.orderByChild("nom"));

	     		var ref_adherent=firebase.database().ref('clubs/'+$scope.club_id+'/adherents/'+uid);
	     		var obj_adherent=$firebaseObject(ref_adherent);

		     	obj_adherent.$loaded().then(function(){
		     		angular.forEach(obj_adherent, function(value, key){
		     			if(key=='prenom'){
		     				$scope.prenom=value;
		     			}
              if(key=='nom'){
                $scope.nom=value;
              }
		     			
		     			
		     		});
		     	})
		     	});


			
   		}
   		$scope.reserver = function(ev){
   			// Recherche id terrain selectionné
   			var ref_terrain=firebase.database().ref('/clubs/'+$scope.club_id+'/terrains');
   			var obj_terrain=$firebaseObject(ref_terrain);
        
   			obj_terrain.$loaded().then(function(){
   				angular.forEach(obj_terrain, function(value, key){
   					
   					if(value.nom==$scope.creneau.terrain){

   						$scope.terrain_id=key;
      
              var ref_creneau = firebase.database().ref('/clubs/'+$scope.club_id+'/creneaux/');
        

              // Fin ajout vérification
              var nom_intitule=$scope.nom+' '+ $scope.prenom+' vs '+$scope.creneau.partenaire;
              var startpicker=$scope.ctrl.datepicker;           
              var reg_date=new RegExp("[ /;]+", "g");
              var reg_heure=new RegExp("[ :;]+", "g");
              var reg_espace=new RegExp("[  ;]+", "g");
              var start_total=startpicker.split(reg_espace);
              var start_date=start_total[0].split(reg_date);
              var start_heure=start_total[1].split(reg_heure);
             
              var start=start_date[2]+","+start_date[0]+","+start_date[1]+","+start_heure[0]+","+start_heure[1];
       
              var reg=new RegExp("[ ,;]+", "g");
              var start_tableau=start.split(reg);
             start_tableau[3]=parseInt(start_tableau[3])+1;
             var end = start_tableau.join(',');
            

                   // Vérification créneau déjà pris ou non 
              var obj_creneau= $firebaseObject(ref_creneau);
              obj_creneau.$loaded().then(function(){
              	var creneau_pris=false;
              	angular.forEach(obj_creneau, function(value, key){
              	
              		if(value.start==start && value.terrain_nom==$scope.creneau.terrain){
              			creneau_pris=true;
              		}

              		
              	});

              	console.log("creneau pris : ",creneau_pris);
              	if(creneau_pris){
              		 $scope.message="Erreur: Créneau déjà pris";


              	}
              	else{

              		 ref_creneau.push({
                      intitule:nom_intitule,
                      start:start,
                      end:end,
                      terrain_id:$scope.terrain_id,
                      terrain_nom:$scope.creneau.terrain,
                      id_user:uid
                  });

                  $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Réservation')
                    .textContent('Réservation effectuée avec succés')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Parfait')
                    .targetEvent(ev)
                );

             
              	}
              })
            
             

   					}
   					
   				});
      
			
        });
        

   		}
  	 	recuperer_infos();
      	
   	  
		
		
		$scope.deconnecterAdherent = function() {
			var auth = $firebaseAuth();
			auth.$signOut();
			 $location.path("/");
    
		}
		         
    }]);
