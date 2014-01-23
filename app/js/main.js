'use strict';

var mainApp = angular.module('mainApp', ['firebase']);

function TodosCtrl($scope, $firebase) {
  var fireRef = new Firebase('https://ecoologic-todos.firebaseio.com/');
  $scope.todos = $firebase(fireRef);

  $scope.create = function () {
    $scope.todos.$add({
      title: $scope.newTodoTitle,
      points: $scope.newTodoPoints,
      completed: false
    });
    $scope.newTodoTitle = '';
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
    $scope.points = points;
    $scope.completed = completed;
    $scope.total = $scope.todos.$getIndex().length;
  });
};
