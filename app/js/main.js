'use strict';

// config
var config = {};
config.firebaseBaseUrl = 'https://ecoologic-todos.firebaseio.com/';
config.firebaseUrls    = {
  todos:                 config.firebaseBaseUrl + 'todos'
};

// controllers
var controllers = {};

controllers.TodosCtrl = function($scope, $firebase) {
  var initialize = function () {
    $scope.todos   = $firebase(new Firebase(config.firebaseUrls.todos));
    $scope.newTodo = { points: 0 };
  };
  initialize();

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

// filters
var filters = {};

filters.sortListBy = function () {
  return function (list, sortAttribute) {
    var result = {};
    var entries = _.select(list, function (item) {
      return angular.isObject(item);
    });
    _.each(entries, function (entry, id) {
      result[id] = entry;
    });
    result = _.sortBy(result, function (item) {
      return item[sortAttribute];
    });
    return result;
  };
};

// app
var dependencies = [
  'firebase',        // https://www.firebase.com/quickstart/angularjs.html
  'xeditable'        // http://vitalets.github.io/angular-xeditable/
];
var app = angular.module('app', dependencies)
                 .constant(config)
                 .controller(controllers)
                 .filter(filters);

app.run(function (editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

// Conventions
// list:      itereteable object
// entry:     a firebase row of data (without the firebase id)
// item:      any iteration of a list (in particular a firebase pair id: entry)
// attribute: a key of an entry
