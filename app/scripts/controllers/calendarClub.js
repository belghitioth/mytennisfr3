/**
 * mytennisfr2 - 0.9.0
 */
var mytennisfr2 = angular.module('mytennisfr2App');



mytennisfr2.controller('gestionPlanningClubCtrl',
   function($scope, $compile, $timeout, uiCalendarConfig, $firebaseAuth,$location,  $firebaseObject,$rootScope,$firebaseArray,$cookies) {

    var uid=$cookies.get('userId'); 
    var terrainId=$cookies.get('terrain_id');

     var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

      $scope.retour= function() {      
      $location.path("/gestionClub");    
    }
 

    var recuperer_nom_club = function(uid){
      var ref_club = firebase.database().ref('/clubs/'+uid);
      var obj_club = $firebaseObject(ref_club);

      obj_club.$loaded().then(function() {
          angular.forEach(obj_club, function(value, key) {
                if(key=='nom'){             
                $scope.nom_club = value;
              }               
              
              
            })
      });

    };
    var recuperer_nom_terrain=function(uid,terrainId){
      var ref_terrain = firebase.database().ref('/clubs/'+uid+'/terrains/'+terrainId);
      var obj_terrain = $firebaseObject(ref_terrain);

      obj_terrain.$loaded().then(function() {
          angular.forEach(obj_terrain, function(value, key) {
                if(key=='nom'){             
                $scope.nom_terrain = value;
              }               
              
              
            })
      });

    


    };




    var recuperer_creneaux = function(club_id,terrain_id){
        var ref_creneaux = firebase.database().ref('/clubs/'+club_id+'/creneaux');
        $scope.creneaux={};

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        //event source that contains custom events on the scope 
      $scope.events = [
        {id: 999,title: 'Martin Favreau vs Othmane ELBELGHITI',start: new Date(y, m, d - 3, 16, 0),allDay: false},
        {id: 999,title: 'Martin Favreau vs Antoine Jean',start: new Date(y, m, d + 4, 16, 0),allDay: false},
        {title: 'Martin Favreau vs Benjamin ALMEIDA',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
       ]; 
        ref_creneaux.once("value")
          .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              
                if(childSnapshot.val()['terrain_id']==terrain_id)
                {
                // Conversion en tableau les valeurs de start et end pour chaque créneaux

                var start_string=childSnapshot.val()['start'];
                var end_string=childSnapshot.val()['end'];
                var reg=new RegExp("[ ,;]+", "g");
                var start_tableau=start_string.split(reg);
                var end_tableau=end_string.split(reg);
               
                for (var i=0; i<start_tableau.length; i++) {
                  start_tableau[i]=parseInt(start_tableau[i]);
                  end_tableau[i]=parseInt(end_tableau[i]);
                }
                // Fin conversion
                
                console.log("ok");
                $scope.events.push({title :childSnapshot.val()['intitule'],
                  start: new Date(start_tableau[0], start_tableau[1]-1, start_tableau[2],start_tableau[3], start_tableau[4]),
                   end: new Date(end_tableau[0], end_tableau[1]-1, end_tableau[2], end_tableau[3],end_tableau[4]),
                  allDay: false });
                }
            });
          


          });


       
    
      };





    recuperer_nom_club(uid);
    recuperer_creneaux(uid,terrainId);
    recuperer_nom_terrain(uid,terrainId);





        

      
    
    $scope.deconnecterClub = function() {
      var auth = $firebaseAuth();
      auth.$signOut();
      $location.path("/");
    
    }


   
  

    $scope.changeTo = 'Hungarian';
    /* event source that pulls from google.com */
    $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'Europe/Paris' // an option!
    };

    
    
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };

    $scope.calEventsExt = {
       color: '#f00',
       textColor: 'yellow',
       events: [
          {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ]
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Dropped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function() {
  
      var start_string=$scope.start;
      var end_string=$scope.end;
      var reg=new RegExp("[ ,;]+", "g");
      var start_tableau=start_string.split(reg);
      var end_tableau=end_string.split(reg);
     
      for (var i=0; i<start_tableau.length; i++) {
        start_tableau[i]=parseInt(start_tableau[i]);
        end_tableau[i]=parseInt(end_tableau[i]);
      }
      
      $scope.events.push({
        title: 'Nouveau créneau',
        start: new Date(start_tableau[0], start_tableau[1], start_tableau[2],start_tableau[3], start_tableau[4]),
        end: new Date(end_tableau[0], end_tableau[1], end_tableau[2], end_tableau[3],end_tableau[4]),
        className: ['openSesame']
      });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalendar = function(calendar) {
      $timeout(function() {
        if(uiCalendarConfig.calendars[calendar]){
          uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
      });
    };
     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) {
        element.attr({'tooltip': event.title,
                      'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };

    $scope.changeLang = function() {
      if($scope.changeTo === 'Hungarian'){
        $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
        $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
        $scope.changeTo= 'English';
      } else {
        $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $scope.uiConfig.calendar.dayNamesShort = ["Dim", "Lun", "Mar", "Wed", "Thu", "Fri", "Sat"];
        $scope.changeTo = 'Hungarian';
      }
    };
  
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
$scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
});
/* EOF */
