'use strict';

/**
 * @ngdoc overview
 * @name testApp
 * @description
 * # testApp
 *
 * Main module of the application.
 */
angular
  .module('mytennisfr2App', [
    'ngCookies',
    'ngMaterial',
    'ngRoute',
    'firebase',
   
   
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'vues/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'vues/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/inscriptionClub', {
        templateUrl: 'vues/inscription_club.html',
        controller: 'inscriptionClubCtrl'
    })
      .when('/connexionClub', {
        templateUrl: 'vues/connexion_club.html',
        controller: 'connexionClubCtrl'
    })
      .when('/connexionAdherent', {
        templateUrl: 'vues/connexion_adherent.html',
        controller: 'connexionAdherentCtrl'
    })
      .when('/gestionClub', {
        templateUrl: 'vues/gestion_club.html',
        controller: 'gestionClubCtrl'
    })
    .when('/accueilAdherent', {
        templateUrl: 'vues/accueil_adherent.html',
        controller: 'accueilAdherentCtrl'
    })
    .when('/attente', {
        templateUrl: 'vues/attente.html',
        controller: 'attenteCtrl'
    })
    .when('/gestionAdherents', {
        templateUrl: 'vues/gestion_adherents.html',
        controller: 'gestionAdherentsCtrl'
    })
    .when('/gestionAdmin', {
        templateUrl: 'vues/gestion_admin.html',
        controller: 'gestionAdminCtrl'
    })
    .when('/gestionClub', {
        templateUrl: 'vues/gestion_club.html',
        controller: 'gestionClubCtrl'
    })
    .when('/mesInformations', {
        templateUrl: 'vues/informations_adherent.html',
        controller: 'informationsAdherentCtrl'
    })
    .when('/mesReservations', {
        templateUrl: 'vues/reservations_adherent.html',
        controller: 'reservationsAdherentCtrl'
    })
    .when('/planningClub', {
        templateUrl: 'vues/calendar.html',
        controller: 'gestionPlanningClubCtrl'
    })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(['$rootScope','$firebase',
    function ($rootScope,$firebase) {
        $rootScope.userid = "None";
        console.log($rootScope.userid);
          // Initialize the Firebase SDK
    var config = {
              apiKey: "AIzaSyAMe7_0wQXe-T1Myc6YyR1cdxGI2UkgzHA",
              authDomain: "mytennis-2c7eb.firebaseapp.com",
              databaseURL: "https://mytennis-2c7eb.firebaseio.com",
              storageBucket: "mytennis-2c7eb.appspot.com",
              messagingSenderId: "393530943914"
            };
      firebase.initializeApp(config);

   }]);

