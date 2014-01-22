'use strict';

var mainApp = angular.module('mainApp', ['firebase']);

function MainCtrl($scope, $firebase) {
  var todosRef = new Firebase('https://ecoologic-todos.firebaseio.com/todos');
  $scope.todos = $firebase(todosRef);

  $scope.addTodo = function () {
    $scope.todos.$add({
      title: $scope.newTodoTitle,
      points: $scope.newTodoPoints,
      completed: false
    });
    $scope.newTodoTitle = '';
  };
};
