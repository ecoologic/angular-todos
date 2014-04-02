'use strict';
var controllers = {}; /////////////////////////////////////////////////////////
controllers.TodosCtrl = function($scope, Store) {
  var initialize = function () {
    $scope.todos = Store.todos;
    $scope.newTodo = { points: 0 };
    $scope.activeTodo = $scope.todos;
  };
  initialize();

  $scope.todos.$on('change', function () {
    var ids = $scope.todos.$getIndex(),
        points = 0, completed = 0;

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

  $scope.setActiveTodo = function (id) {
    $scope.activeTodo = $scope.todos.$child(id);
  };

  $scope.delete = function (id) { $scope.todos.$remove(id); };

  $scope.update = function (id) { $scope.todos.$save(id); };

  $scope.create = function () {
    console.log('create', $scope.activeTodo);
    $scope.activeTodo.$child(
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
var services = {}; ////////////////////////////////////////////////////////////
services.Store = function ($firebase) {
  var firebaseUrl = 'https://ecoologic-todos.firebaseio.com/development/',
      resourceNames = ['todos'],
      result = {};

  _.each(resourceNames, function (resourceName) {
    var resourceUrl = firebaseUrl + resourceName,
        resource = $firebase(new Firebase(resourceUrl));

    resource.$url = resourceUrl;

    resource.$properties = function () {
      return _.map(resource.$getIndex(), function (id) {
        return resource.$child(id);
      });
    };

    resource.$halfChild = function (id) {
      var result = resource[id];
      result.$id = id;
      return result;
    };

    result[resourceName] = resource;
  });
  return result;
};
var filters = {}; /////////////////////////////////////////////////////////////
filters.sortBy = function () {
  return function (list, sortAttribute) {
    var ids = list.$getIndex(), result;
    if(ids.length) {
      var sortedIds = _.sortBy(ids, function (id) {
        return list[id][sortAttribute];
      });
      result = _.map(sortedIds, function (id) { return list.$halfChild(id); });
    };
    console.log("filter", result || list);
    return result || list;
  };
};
var run = function ($rootScope, $log, editableOptions) { //////////////////////
  $rootScope.$log = $log;
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
};
var dependencies = [ //////////////////////////////////////////////////////////
  'firebase',        // https://www.firebase.com/docs/angular/reference.html
                     // https://www.firebase.com/docs/queries.html
                     // https://www.firebase.com/docs/data-structure.html
  'xeditable'        // http://vitalets.github.io/angular-xeditable/
];
var app = angular.module('app', dependencies) /////////////////////////////////
                 .controller(controllers)
                 .service(services)
                 .filter(filters)
                 .run(run);
