'use strict';

angular.module('mytennisfr2App')


  .controller('attenteCtrl',["$scope", "$firebaseAuth",'$location','$rootScope',"$firebaseObject","$cookies",
   function ($scope, $firebaseAuth, $location,$rootScope,$firebaseObject, $cookies) {
      $scope.log = ' Vous êtes bien inscris ... Cependant il faut attendre que votre inscription soit validé par votre club';
    }]);

