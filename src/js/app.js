"use strict";

var app = angular.module("kanaApp", []);

app.controller('MainController', ['$http', function ($http) {
    var self = this;
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
        self.allHiragana = allKana[0];
        self.allKatakana = allKana[1];
    }

    //Sets currently displayed symbol using random number
    function setCurrentKana() {
        //if there is no selected kana
        if (inUseKana.length !== 0) {
            var randomNumber = Math.floor(Math.random() * inUseKana.length);
            self.currentKana = inUseKana[randomNumber].kana;
            self.currentRomaji = inUseKana[randomNumber].romaji;
        }
        else{
            self.currentKana = "";
        }
    }

    //Checks answer. Change symbol if correct. Alert user if incorrect
    function checkAnswer() {
        self.userAnswer = self.userAnswer.toLowerCase();
        if (self.userAnswer == self.currentRomaji || self.userAnswer == self.currentKana) {
            setCurrentKana();
            clearAnswerBox();
            self.incorrectAnswer = false;
        }
        else {
            clearAnswerBox();
            self.incorrectAnswer = true;
        }

    }

    //Clears user input
    function clearAnswerBox() {
        self.userAnswer = "";
    }

    //Handles adding and removing of kana
    self.toggleKanaRow = function (kanaRow) {
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
    self.sideBarHidden = false;
    self.checkAnswer = checkAnswer;
    getAllKana();
}]);
