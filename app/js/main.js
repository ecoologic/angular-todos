'use strict';

var mainApp = angular.module('mainApp', ['firebase']);

function MainCtrl($scope, $firebase) {
  var url = 'https://ecoologic-todos.firebaseio.com/people';
  var peopleRef = new Firebase(url);
  $scope.people = $firebase(peopleRef);

  $scope.addPerson = function () {
    $scope.people.$add($scope.newPerson);
    $scope.newPerson = '';
  };
};
