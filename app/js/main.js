'use strict';

var mainApp = angular.module('mainApp', ['firebase']);

function MainCtrl($scope, $firebase) {
  var todosRef = new Firebase('https://ecoologic-todos.firebaseio.com/simple-todos');
  $scope.todos = $firebase(todosRef);

  $scope.addTodo = function () {
    $scope.todos.$add($scope.newTodo);
    $scope.newTodo = '';
  };
};
