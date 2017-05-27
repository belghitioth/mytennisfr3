'use strict';

angular.module('mytennisfr2App')

  .controller('accueilAdherentCtrl',["$scope", "$firebaseAuth",'$location',"$firebaseObject",'$rootScope',"$firebaseArray","$cookies", "$mdDialog",
   	function ($scope, $firebaseAuth, $location, $firebaseObject,$rootScope,$firebaseArray, $cookies,$mdDialog) {

   		// Récupération de l'identifiant de l'utilisateur connecté
   		var uid=$cookies.get('userId');
   		var nomClub=$cookies.get('nomClub');
      $scope.nomClub=nomClub;
      $scope.infos=[];

      
     

     
   		
    
      // Récupération des informations liées à l'utilisateur connecté
   		var recuperer_infos_adherent = function(uid,nomClub,callback){

  	   	var club_id="";
        var infos=[];

        var ref_clubs = firebase.database().ref('/clubs/');
        var obj_clubs = $firebaseObject(ref_clubs);
      
        obj_clubs.$loaded().then(function() {
            angular.forEach(obj_clubs, function(value, key) {
                  if(value.nom==nomClub){               
                  club_id=key;
                }                               
              });

          callback(club_id);
          var ref_adherent=firebase.database().ref('clubs/'+club_id+'/adherents/'+uid);
          var obj_adherent=$firebaseObject(ref_adherent);

           ref_adherent.once("value")
              .then(function(snapshot) {
                $scope.infos=snapshot.val();
                $scope.club_id=club_id;

              });    

          });
			
   		}


     
      // Récupération des données pour remplir le formulaire
      var recuperer_donnees_formulaire=function(club_id){

        var ref_terrains=firebase.database().ref('/clubs/'+club_id+'/terrains');
        $scope.terrains = $firebaseArray(ref_terrains.orderByChild("nom"));

        var ref_adherents=firebase.database().ref('/clubs/'+club_id+'/adherents');
        $scope.adherents = $firebaseArray(ref_adherents.orderByChild("nom"));
      }

      recuperer_infos_adherent(uid,nomClub,recuperer_donnees_formulaire)

     
      


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
              var date_string=start_total[0];
              var heure_string=start_total[1];
              console.log(date_string,heure_string);
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
              		 $scope.status="Erreur: Créneau déjà pris";


              	}
              	else{

              	
                 var confirm = $mdDialog.confirm()
                          .title('Voulez vous confirmer la réservation ?')
                          .textContent('Réservation d\'un créneau')
                          .ariaLabel('Lucky day')
                          .targetEvent(ev)
                          .ok('Oui')
                          .cancel('Annuler');

                    $mdDialog.show(confirm).then(function() {
                      $scope.status = 'Réservation effectué avec succés';
                         ref_creneau.push({
                      intitule:nom_intitule,
                      start:start,
                      end:end,
                      date:date_string,
                      heure:heure_string,
                      terrain_id:$scope.terrain_id,
                      terrain_nom:$scope.creneau.terrain,
                      id_user:uid
                  });
                         $location.path("/accueilAdherent");
                    }, function() {
                      $scope.status = 'Réservation annulée';
                    });


             
              	}
              })
            
             

   					}
   					
   				});
      
			
        });
          

   		}

    $scope.modifierMdp = function() {
      $location.path("/modificationMdp");
    }
     	 	
		
		$scope.deconnecterAdherent = function() {
			var auth = $firebaseAuth();
			auth.$signOut();
			 $location.path("/");
    
		}
		         
    }]);
