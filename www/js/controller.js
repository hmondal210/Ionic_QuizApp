angular.module('starter.controllers', [])

  .controller('AppCtrl', function($scope, $state) {

    $scope.openQuizPage = function() {
      $state.go("quiz");

    }
    $scope.openHelpPage = function() {
      $state.go("help");

    }
    
});
   