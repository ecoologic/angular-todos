'use strict';

// app
var mainApp = angular.module('mainApp', ['firebase']);

// controllers
mainApp.controller('TodosCtrl', function($scope, $firebase) {
  var fireRef    = new Firebase('https://ecoologic-todos.firebaseio.com/');
  $scope.todos   = $firebase(fireRef);
  $scope.newTodo = { points: 0 };

  $scope.create = function () {
    $scope.todos.$add({
      title:     $scope.newTodo.title,
      points:    $scope.newTodo.points,
      completed: false
    });
    $scope.newTodo.title = '';
    $scope.newTodoForm.$setPristine(true);
  };

  $scope.todos.$on('change', function () {
    var points = 0;
    var completed = 0;

    $scope.todos.$getIndex().forEach(function (index) {
      var todo = $scope.todos[index];
      if(todo.completed) {
        points += todo.points;
        completed += 1;
      };
    });

    $scope.points    = points;
    $scope.completed = completed;
    $scope.total     = $scope.todos.$getIndex().length;
  });
});
