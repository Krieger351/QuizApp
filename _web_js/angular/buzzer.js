angular.module('QuizApp.Buzzer', [])
.controller('BuzzerCtrl',['$scope', function($scope){
  $scope.team = '';

  var socket = io();

  socket.emit("subscribe", { 'room': "Buzzer" });

  $scope.joinTeam = function(team){
    $scope.team = team;
    socket.emit("subscribe", { 'room': team });
  }
  $scope.buzzIn = function(team){
    socket.emit("buzzIn", { 'team': team });
  }
  $scope.back = function(team){
    socket.emit("unsubscribe", { 'room': team });
    $scope.team = '';
  }

  socket.on('restart',function(data){
    $scope.team = '';
    $scope.$apply();
  })
}])
