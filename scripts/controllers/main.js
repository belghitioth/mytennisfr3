'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testApp
 */
angular.module('mytennisfr2App')
  .controller('MainCtrl', function ($scope,$location,$cookies) {
 
      $scope.commencer = function() {   
       $cookies.put('uEmail', $scope.user.email);    
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
