angular.module('QuizApp.Controller', [])
.controller('ControllerCtrl',['$scope', function($scope){

  $scope.scores = {
    red:0,
    blue:0,
    green:0,
    orange:0
  };
  $scope.chosenQuestion = {
    "category":"",
    "value":"",
    "question":{
      "answer":"",
      "question":""
    }
  }

  var socket = io();
  socket.emit("subscribe", { 'room': "GameParts" });
  socket.emit("subscribe", { 'room': "Controller" });
  socket.emit("getScores");


  $scope.firstBuzz = "";
  $scope.buzzed = false;
  socket.on('scoreUpdate', function(data) {
    $scope.updateScores(data)
  });
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
  socket.on('choseQuestion',function(data){
    console.log(data)
    $scope.chosenQuestion = data;
    $scope.$apply();
  })

  socket.on('restart',function(data){
    $scope.scores = {
      red:0,
      blue:0,
      green:0,
      orange:0
    };
    $scope.chosenQuestion = {
      "category":"",
      "value":"",
      "question":{
        "answer":"",
        "question":""
      }
    }
    $scope.$apply();
  })

  $scope.updateScores = function(data){
    $scope.scores = data;
    $scope.$apply()
  }

  $scope.pushScores = function(){
    socket.emit("updateScores",{'scores':$scope.scores})
  }

  $scope.clear = function(){
    socket.emit("clear")
  }

  $scope.giveQuestion = function(team){
    socket.emit("giveQuestion",{'team':team,"question":$scope.chosenQuestion})
  }

  $scope.restart = function(){
    socket.emit("restart")
  }


}])
