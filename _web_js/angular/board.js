angular.module('QuizApp.Board', [])
.controller('BoardCtrl',['$scope','$http', function($scope,$http){
  $scope.team = '';
  $scope.scores = {
    red:0,
    blue:0,
    green:0,
    orange:0
  };
  $scope.board = {};

  $http.get('/data')
  .then(function(response) {
      $scope.board = response.data;
  });

  $scope.updateScores = function(data){
    $scope.scores = data;
    $scope.$apply()
  }

  var socket = io();

  socket.emit("subscribe", { 'room': "GameParts" });
  socket.emit("getScores");

  socket.on('scoreUpdate', function(data) {
    $scope.updateScores(data)
  });

  $scope.firstBuzz = "";
  $scope.buzzed = false;
  socket.on('buzzIn', function(data) {
    if(!$scope.buzzed){
      $scope.firstBuzz = data;
      $scope.buzzed = true;
      $scope.$apply()
      console.log(data)
    }
  })
  socket.on('clear', function() {
      $scope.firstBuzz = '';
      $scope.buzzed = false;
      $scope.$apply();
  })

}])
