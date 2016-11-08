"use strict";

var app = angular.module("kanaApp", []);

app.controller('MainController', ['$scope', '$http', function ($scope, $http) {
    var allKana;
    var inUseKana = [{"kanji":"あ","romaji": "a"}];
    var hashKeys = [];

    function getAllKana() {
        $http.get('src/kana.json').then(function (data) {
            console.log(data);
            allKana = data.data;
            seperateHiraAndKata();
        });
    }

    //separtes hiragana and katakana
    function seperateHiraAndKata() {
        $scope.allHiragana = allKana[0];
        $scope.allKatakana = allKana[1];
    }

    //Sets currently displayed symbol using random number
    function setCurrentKana() {

        var randomNumber = Math.floor(Math.random() * inUseKana.length);
        //checks if random number is the same as the last
        // while (randomNumber == $scope.tempRandomNumber) {
        //     randomNumber = Math.floor(Math.random() * inUseKana.length);
        // }
        $scope.tempRandomNumber = randomNumber;

        $scope.currentKana = inUseKana[randomNumber].kana;
        $scope.currentRomaji = inUseKana[randomNumber].romaji;
    }

    //Checks answer. Change symbol if correct. Alert user if incorrect
    function checkAnswer() {
        if ($scope.userAnswer == $scope.currentRomaji || $scope.userAnswer == $scope.currentKana) {
            setCurrentKana();
            clearAnswerBox();
        }
        else {
            clearAnswerBox();
            //TODO: Alert user
        }

    }

    //Clears user input
    function clearAnswerBox() {
        $scope.userAnswer = "";
    }

    //Handles adding and removing kana
    $scope.addKanaRow = function (kanaRow) {
        if (hashKeys.indexOf(kanaRow[0].$$hashKey) >= 0) {
            hashKeys.pop(kanaRow[0].$$hashKey)
            kanaRow.forEach(function (kana) {
                inUseKana.pop(kana);
            });
            checkInUseKana();
            setCurrentKana();
        }
        else {
            hashKeys.push(kanaRow[0].$$hashKey);
            kanaRow.forEach(function (kana) {
                inUseKana.push(kana);
            });
            setCurrentKana();
        }

    };

    //Handles error caused by removing all inusekana
    function checkInUseKana(){
        if(inUseKana === null){
            inUseKana = [{"kanji":"あ","romaji": "a"}];
        }
    }

    $scope.checkAnswer = checkAnswer;
    getAllKana();
}]);
