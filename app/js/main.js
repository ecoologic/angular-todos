'use strict';

// controllers
var controllers = {};

controllers.TodosCtrl = function($scope, $firebase) {
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
    var points = 0, completed = 0;

    $scope.todos.$getIndex().forEach(function (index) {
      var todo = $scope.todos[index];
      if(todo.completed) {
        points += todo.points;
        completed++;
      };
    });

    $scope.points    = points;
    $scope.completed = completed;
    $scope.total     = $scope.todos.$getIndex().length;
  });
};

// app
var dependencies = [
  'firebase',        // https://www.firebase.com/quickstart/angularjs.html
  'xeditable'        // http://vitalets.github.io/angular-xeditable/
];
var app = angular.module('app', dependencies)
                 .controller(controllers);

app.run(function (editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
