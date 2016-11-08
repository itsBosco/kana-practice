"use strict";

var app = angular.module("kanaApp", []);

app.controller('MainController', ['$scope', '$http', function ($scope, $http) {
    var allKana;
    var inUseKana = [];
    var hashKeys = [];

    function getAllKana() {
        $http.get('src/kana.json').then(function (data) {
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
        //if there is no selected kana
        if (inUseKana.length !== 0) {
            var randomNumber = Math.floor(Math.random() * inUseKana.length);
            $scope.currentKana = inUseKana[randomNumber].kana;
            $scope.currentRomaji = inUseKana[randomNumber].romaji;
        }
        else{
            //TODO: Alert user that there is no kana selected
            $scope.currentKana = "";
            $scope.currentRomaji = "";
        }
    }

    //Checks answer. Change symbol if correct. Alert user if incorrect
    function checkAnswer() {
        if ($scope.userAnswer == $scope.currentRomaji || $scope.userAnswer == $scope.currentKana) {
            setCurrentKana();
            clearAnswerBox();
        }
        else {
            clearAnswerBox();
            //TODO: Alert user that they answered wrong
        }

    }

    //Clears user input
    function clearAnswerBox() {
        $scope.userAnswer = "";
    }

    //Handles adding and removing of kana
    $scope.toggleKanaRow = function (kanaRow) {
        if (hashKeys.indexOf(kanaRow[0].$$hashKey) >= 0) {
            hashKeys.pop(kanaRow[0].$$hashKey);
            removeInUseKana(kanaRow);
            setCurrentKana();
        }
        else {
            hashKeys.push(kanaRow[0].$$hashKey);
            addInUseKana(kanaRow);
            setCurrentKana();
        }

    };

    function removeInUseKana(kanaRow) {
        kanaRow.forEach(function (kana) {
                inUseKana.pop(kana);
            });
    }

    function addInUseKana(kanaRow){
        kanaRow.forEach(function (kana) {
                inUseKana.push(kana);
            });
    }

    //////////
    $scope.checkAnswer = checkAnswer;
    getAllKana();
}]);
