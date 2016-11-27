
angular.module('TriviaQuiz', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

  .config(function($stateProvider, $urlRouterProvider){
    $stateProvider.state('index', {
      url: '/',
      templateUrl: "templates/home.html",
      controller: 'AppCtrl'
    })

      .state('quiz', {
        url: "/quiz",
        templateUrl: "templates/quiz.html",
        controller: 'QuizCtrl'
      })

    .state('help', {
      url: "/help",
      templateUrl: "templates/help.html",
      controller: 'AppCtrl'
    })

    .state('success', {
      url: "/success",
      templateUrl: "templates/success.html",
      controller: 'AppCtrl'
    });

    $urlRouterProvider.otherwise("/");
  })


.controller('QuizCtrl', function($scope, $state, $http, $rootScope, $ionicPopup) {
    var max_count = null;
    var json_file = 'data/data.json';
    var score = 0;
    var count = window.localStorage.getItem("count");
    $scope.score = 0;
    $scope.submitBtn = 'Next';
    $http.get(json_file).success(function(data) {
        max_count = data.length;
    });
    if(!count) {
        window.localStorage.setItem("count",1); 
    }
    $scope.submitAnswer = function() {
    var count = window.localStorage.getItem("count");
    if(count == max_count) {
        $scope.submitBtn = 'Finish';
    } else if(count > max_count ) {
        var score = window.localStorage.getItem("score");
        $scope.score = '0'+(score?score:0);
        var myPopup = $ionicPopup.show({
          title: 'Your Total Score is: ',
          template: '0'+(score?score:0),
          cssClass: 'normal_popup',
          buttons: [
            {
              text: '<b>OK</b>',
              type: 'button-positive',
              onTap: function (e) {
                $state.go('index');
              }
            }
          ]
        });
    }   
      var selected_ans = window.localStorage.getItem("selected_ans"); 
      $http.get(json_file).success(function(data) {
        angular.forEach(data, function(value, key) {
        if(value.id == count) {    
          if(value.correct_answer == selected_ans) {
//                console.log(selected_ans);
                var score = window.localStorage.getItem("score"); 
                if(score) {
                    window.localStorage.setItem("score",parseInt(score) + 1);
                } else {
                    window.localStorage.setItem("score",1);
                }
          }
            window.localStorage.setItem("count",parseInt(count) + 1); 
            $state.reload();
        }
        });
      });    
    }
    
    $scope.selectAnswer = function(ans) {
        $scope.isSelect = true;
        window.localStorage.setItem("selected_ans",ans); 
    }
    
    $scope.$on('$ionicView.enter', function(event) {
    var count = window.localStorage.getItem("count");
    var score = window.localStorage.getItem("score"); 
      $http.get(json_file).success(function(data) {
        angular.forEach(data, function(value, key){
          if(value.id == count) {
                $scope.question = value.question;
                $scope.answers = value.answers;
                $scope.isSelect = false;
                $scope.score = (!score?'0':'0'+score);
          }
        });
      });
    });
    
    $scope.$on('$ionicView.leave', function(event) {
       window.localStorage.clear();
    });
    
  })

