"use strict";

var app = angular.module("kanaApp", []);

app.controller('MainController', ['$http', function ($http) {
    var self = this;
    var allKana;
    var inUseKana = [];
    var hashKeys = [];

    //gets all kana from kana.json
    function getAllKana() {
        $http.get('src/kana.json').then(function (data) {
            allKana = data.data;
            seperateHiraAndKata();
            self.currentIncorrect = 0;
        });
    }

    //separtes hiragana and katakana
    function seperateHiraAndKata() {
        self.allHiragana = allKana[0];
        self.allKatakana = allKana[1];
    }

    //Sets currently displayed kana and romaji using random number
    function setCurrentKana() {
        self.currentIncorrect = 0;
        self.showAnswer = false;
        if (inUseKana.length !== 0) {
            var randomNumber = Math.floor(Math.random() * inUseKana.length);
            self.currentKana = inUseKana[randomNumber].kana;
            self.currentRomaji = inUseKana[randomNumber].romaji;
        }
        //if there is no selected kana
        else{
            self.currentKana = "";
            self.currentRomaji = "";
        }
    }

    //Checks answer. Change symbol if correct. Else do things if incorrect
    function checkAnswer() {
        self.userAnswer = self.userAnswer.toLowerCase();
        if (self.userAnswer == self.currentRomaji || self.userAnswer == self.currentKana) {
            setCurrentKana();
            clearAnswerBox();
            self.incorrectAnswer = false;
        }
        else {
            clearAnswerBox();
            checkIfThreeWrong();
            self.incorrectAnswer = true;
            self.currentIncorrect++;
        }

    }

    //Clears user input
    function clearAnswerBox() {
        self.userAnswer = "";
    }

    //Check if the user has missed three times
    function checkIfThreeWrong() {
        self.currentIncorrect >= 3 ? self.showAnswer = true : self.showAnswer = false;
    }

    //Handles adding and removing of kana rows
    self.toggleKanaRow = function (kanaRow) {
        var hashKeyIndex = hashKeys.indexOf(kanaRow[0].$$hashKey);
        if (hashKeyIndex >= 0) { //checks if the kanarow is in use
            hashKeys.splice(hashKeyIndex, 1);
            removeInUseKana(kanaRow);
            setCurrentKana();
        }
        else { //else add the kanarow
            hashKeys.push(kanaRow[0].$$hashKey);
            addInUseKana(kanaRow);
            setCurrentKana();
        }
    };

    //removes kana that has been unselected
    function removeInUseKana(kanaRow) {
        kanaRow.forEach(function (kana) {
                var kanaIndex = inUseKana.indexOf(kana);
                inUseKana.splice(kanaIndex, 1);
            });
    }

    //adds kana that has been selected
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
