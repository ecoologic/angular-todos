'use strict';

// config
var config = {};
config.firebaseBaseUrl = 'https://ecoologic-todos.firebaseio.com/';
config.firebaseUrls = { todos: config.firebaseBaseUrl + 'todos' };

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
    console.log(list, sortAttribute);
    return list;
  };
};

// run
var run = function (editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
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
                 // .run(run)

// Conventions
// list:      itereteable object
// entry:     a firebase row of data (without the firebase id)
// item:      any iteration of a list (in particular a firebase pair id: entry)
// attribute: a key of an entry

// https://github.com/firebase

// // http://stackoverflow.com/questions/20109656/how-do-you-sort-an-angularfire-collection
// if (!angular.isObject(list)) return list;

// var array = [];
// for(var objectKey in list) {
//   array.push(list[objectKey]);
// }

// function compare(a,b) {
//   if (a[sortAttribute] < b[sortAttribute])
//     return -1;
//   if (a[sortAttribute] > b[sortAttribute])
//     return 1;
//   return 0;
// }

// array.sort(compare);
// return array;


//     var clonedList = _.cloneDeep(list),
//         unsortedItems = {},
//         ids = clonedList.$getIndex();

//     _.each(ids, function (id) {
//       if (clonedList[id] !== undefined) {
//         unsortedItems[id] = _.cloneDeep(clonedList[id]);
//       }
//       delete clonedList[id];
//     });
// console.log('1111', clonedList, unsortedItems);

//     var sortedEntries = _.sortBy(unsortedItems, function (item) {
// console.log('>>>>', item)
//       return item[sortAttribute];
//     });

//     _.each(sortedEntries, function (entity) {

//       clonedList[_.findKey(unsortedItems, entity)] = entity;
//     });
// console.log('2222', clonedList);


// filters.sortListBy = function () {
//   return function (list, sortAttribute) {
//     var result = {}, entries = {}, nonObjects = {};

//     _.each(list, function (entry, id) {
//       if (angular.isObject(entry)) {
//         result[id] = entry;
//       } else {
//         nonObjects.push(entry);
//       };
//     });
//     result = _.sortBy(result, function (item) {
//       return item[sortAttribute];
//     });
//     return result;
//   };
// };
