'use strict';
// Controllers ////////////////////////////////////////////////////////////////
var controllers = {};

controllers.TodosCtrl = function($scope, Store) {
  var initialize = function () {
    $scope.todos   = Store.todos;
    $scope.newTodo = { points: 0 };
  };
  initialize();

  $scope.todos.$on('change', function () {
    var ids = $scope.todos.$getIndex(),
        points = 0, completed = 0;
    if(ids.length) $scope.activeTodoId = $scope.activeTodoId || ids[0];

    ids.forEach(function (id) {
      var todo = $scope.todos[id];
      if(todo.completed) {
        points += todo.points;
        completed++;
      };
    });

    $scope.points    = points;
    $scope.completed = completed;
    $scope.total     = $scope.todos.$getIndex().length;
  });

  $scope.setActiveTodo = function (id) { $scope.activeTodoId = id; };

  $scope.activeTodo = function () {
    return Store.todos.$resource($scope.activeTodoId);
  };

  $scope.delete = function (id) { $scope.todos.$remove(id); };

  $scope.update = function (id) { $scope.todos.$save(id); };

  $scope.create = function () {
    $scope.activeTodo().$child(
      encodeURIComponent($scope.newTodo.title)
    ).$set({
      title:     $scope.newTodo.title,
      points:    $scope.newTodo.points,
      completed: false
    });
    $scope.newTodo.title = '';
    $scope.newTodoForm.$setPristine(true);
  };
};
// Services ///////////////////////////////////////////////////////////////////
var services = {};

services.Store = function ($firebase) {
  var firebaseUrl = 'https://ecoologic-todos.firebaseio.com/test/',
      resourceNames = ['todos'],
      result = {};

  result.resource = function (resourceName) {
    return $firebase(new Firebase(firebaseUrl + resourceName));
  };

  _.each(resourceNames, function (resourceName) {
    // firebase resource
    var resource = result.resource(resourceName);
    resource.$resource = function (nesting) {
      console.log(result.resource(resourceName + '/' + nesting));
      return result.resource(resourceName + '/' + nesting);
    };

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
// Run ////////////////////////////////////////////////////////////////////////
var run = function (editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
};
// Dependencies ///////////////////////////////////////////////////////////////
var dependencies = [
  'firebase',         // https://www.firebase.com/docs/angular/reference.html
                      // https://www.firebase.com/docs/queries.html
                      // https://www.firebase.com/docs/data-structure.html
  'xeditable'         // http://vitalets.github.io/angular-xeditable/
];
// App ////////////////////////////////////////////////////////////////////////
var app = angular.module('app', dependencies)
                 .controller(controllers)
                 .service(services)
                 .run(run);
