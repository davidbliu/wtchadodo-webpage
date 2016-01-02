var app = angular.module('copilotApp', []);
app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
