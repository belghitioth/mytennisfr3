'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testApp
 */
angular.module('mytennisfr2App')
  .controller('MainCtrl', function ($scope,$location) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
      $scope.commencer = function() {     
      $location.path("/connexionAdherent");    
    }
     $scope.acceuil = function() {     
      $location.path("/");    
    }
     $scope.club = function() {      
      $location.path("/connexionClub");    
    }
    $scope.adherent= function() {      
      $location.path("/connexionAdherent");    
    }
  });
