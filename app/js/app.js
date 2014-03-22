'use strict';

///////////////////////////////////////////////////////////////////////////////
// Config
var config = {};

config.firebaseBaseUrl = 'https://ecoologic-todos.firebaseio.com/';
config.firebaseUrls = { todos: config.firebaseBaseUrl + 'todos' };

///////////////////////////////////////////////////////////////////////////////
// Controllers
var controllers = {};

controllers.TodosCtrl = function($scope, $firebase) {
  var initialize = function () {
    $scope.todos   = $firebase(new Firebase(config.firebaseUrls.todos));
    $scope.newTodo = { points: 0 };
  };
  initialize();

  $scope.remove = function (id) {
    $scope.todos.$remove(id);
  };

  $scope.update = function (id) {
    $scope.todos[id].points = parseInt($scope.todos[id].points);
    $scope.todos.$save(id);
  };

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

  $scope.validateRange = function (newValue, from, to) {
    var n = parseInt(newValue);
    if (n < from || n > to) {
      return "Value should be between " + from + " and " + to;
    };
  };
};

///////////////////////////////////////////////////////////////////////////////
// Filters
var filters = {};

filters.sortListBy = function () {
  return function (list, sortAttribute) {
    console.log(list, sortAttribute);
    return list;
  };
};

///////////////////////////////////////////////////////////////////////////////
// Run
var run = function (editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
};

///////////////////////////////////////////////////////////////////////////////
// Dependencies
var dependencies = [
  'firebase',        // https://www.firebase.com/quickstart/angularjs.html
  'xeditable'        // http://vitalets.github.io/angular-xeditable/
];

///////////////////////////////////////////////////////////////////////////////
// App
var app = angular.module('app', dependencies)
                 .constant(config)
                 .controller(controllers)
                 .filter(filters)
                 .run(run);
