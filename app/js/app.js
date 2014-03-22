'use strict';

///////////////////////////////////////////////////////////////////////////////
// Controllers
var controllers = {};

controllers.TodosCtrl = function($scope, Store) {
  var initialize = function () {
    $scope.todos   = Store.todos;
    $scope.newTodo = { points: 0 };
  };
  initialize();

  $scope.delete = function (id) { $scope.todos.$remove(id); };

  $scope.update = function (id) { $scope.todos.$save(id); };

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

///////////////////////////////////////////////////////////////////////////////
// Services
var services = {};

services.Store = function ($firebase) {
  var firebaseUrl = 'https://ecoologic-todos.firebaseio.com/',
      resourceNames = ['todos', 'tasks'],
      result = {};

  _.each(resourceNames, function (resourceName) {
    // firebase resource
    var resource = $firebase(new Firebase(firebaseUrl + resourceName));

    // get only entries (no ids or other methods)
    resource.$entries = function () {
      return _.map(resource.$getIndex(), function (id) {
        return resource[id];
      });
    };

    result[resourceName] = resource;
  });

  return result;
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
// Config
var config = {};

///////////////////////////////////////////////////////////////////////////////
// Run
var run = function (editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
};

///////////////////////////////////////////////////////////////////////////////
// Dependencies
var dependencies = [
  'firebase',        // https://www.firebase.com/docs/angular/reference.html
  'xeditable'        // http://vitalets.github.io/angular-xeditable/
];

///////////////////////////////////////////////////////////////////////////////
// App
var app = angular.module('app', dependencies)
                 .controller(controllers)
                 .service(services)
                 .filter(filters)
                 .constant(config)
                 .run(run);
