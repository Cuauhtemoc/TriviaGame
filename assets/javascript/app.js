var TriviaQuestions;
var gifs;
var currenQuestion = -1;
var correctAnswer;
var numberCorrect = 0;
var numberIncorrect = 0;
var currentTime = 0;
var timer;
var timerOnscreen;
var startTimer = false;
//Go get some data from Open Trivia DataBase and Giphy
getData("https://opentdb.com/api.php?amount=20&category=11&difficulty=easy&type=multiple", function(d){
    TriviaQuestions = d;
});
getData("http://api.giphy.com/v1/gifs/search?q=cute+dogs&api_key=6eo1uTgLl9IbW6ustLLdSjQ5wh4RH9XM", function(d){
gifs = d;
});
function getData (url, captureData) {
    var xhr = new XMLHttpRequest;
    xhr.open("GET", url);
    xhr.onload = function(){
    var data;   
    data = JSON.parse(this.responseText);
    captureData(data); 
    }
    xhr.send();
}
//Main function that will update the game, display the current question, and start the timer.
function displayGame (){
        startTimer = true;
        startTimer = true;
        currentTime = 20;
        var q = $("<h1>");
        var choice = []
        if (currenQuestion >= TriviaQuestions.results.length -1)
        {
            endGame();
        }
        else {
        currenQuestion ++;
        correctAnswer = TriviaQuestions.results[currenQuestion].correct_answer
        $('#gameStart').hide();
        $('#choices').empty();
        $("#question").empty();
        $("#timer").html("<h1> Time Remaining: " + currentTime + "</h1>");
        
        q.html(TriviaQuestions.results[currenQuestion].question);
        $("#question").append(q)
        for (i = 0; i < TriviaQuestions.results[currenQuestion].incorrect_answers.length; i++)
        {
            choice.push(TriviaQuestions.results[currenQuestion].incorrect_answers[i]);            
        }
        choice.push(TriviaQuestions.results[currenQuestion].correct_answer);
        shuffle(choice);
        for (i = 0; i < choice.length; i++)
        {
            $("#choices").append(("<button id = 'answer'>" + choice[i] + "</button>"));
        }
        timer = setTimeout(timesUp, currentTime * 1000);
        timerOnscreen = setInterval(displayTime, 1000);
    }
} ;
//Update the game if the user fails to answer the question.  Wait for a period of time and display the next question
function timesUp(){ 
    numberIncorrect++;
    currentTime = 5;
    $('#choices').empty();
    $("#question").empty();
    $("#choices").html("<h3> Times Up. The correct answer was: " + correctAnswer + "</h3>");
    clearTimeout(timer);
    clearInterval(timerOnscreen);
    setTimeout(displayGame, currentTime * 1000);
}
//Update the game when all questions have been aswered. Display incorrect and correct answers
function endGame(){
    $('#choices').empty();
    $("#question").empty();
    $("#choices").append("<ul> <li> Correct Answers: " + numberCorrect + "</li>" + "<li> Incorrect Answers: " + numberIncorrect + "</li> </ul>"  )
    $("#gameStart").html("Restart Game");
    currenQuestion = -1;
    getData("https://opentdb.com/api.php?amount=20&category=11&difficulty=easy&type=multiple", function(d){
    TriviaQuestions = d;
    });
    getData("http://api.giphy.com/v1/gifs/search?q=cute+dogs&api_key=6eo1uTgLl9IbW6ustLLdSjQ5wh4RH9XM", function(d){
    gifs = d;
    $("#gameStart").show();
    numberCorrect = 0;
    numberIncorrect = 0;
});
}
//Function to shuffle the choices because trvia database does not give a random order.  Do this
// so when the user plays the answer is not in the same place
function shuffle (array){
    var temp;
    var randomIndex;
    var currentIndex = array.length - 1;
    for (i=0; i <= currentIndex; currentIndex--){
        randomIndex = Math.floor(Math.random() * array.length );
        temp = array[i];
        array[i] = array[randomIndex];
        array[randomIndex] = temp;
    }
};
// Update the game when the answer is correct.  Display a gif.  Wait for a period and then display the next question
function win() {
    var winnerGif = $("<img>");
    currentTime = 5;
    winnerGif.attr("src", gifs.data[currenQuestion].images.fixed_width.url);
    $('#choices').empty();
    $("#question").empty();
    $("#question").html("<h3> Thats correct! Here's a cute dog! </h3>");
    $("#choices").html(winnerGif);
    numberCorrect++;
    clearTimeout(timer);
    clearInterval(timerOnscreen);
    setTimeout(displayGame, currentTime * 1000);
}
//The same as winning but instead increment the incorrect answer variable
function lose(){
    var winnerGif = $("<img>");
    currentTime = 5;
    winnerGif.attr("src", gifs.data[currenQuestion].images.downsized.url);
    $('#choices').empty();
    $("#question").empty();
    $("#question").html("<h3> Sorry that's wrong the correct answer was " + correctAnswer + ", but here's a cute dog anyway. </h3>");
    $("#choices").html(winnerGif);
    numberIncorrect++;
    clearTimeout(timer);
    clearInterval(timerOnscreen);
      setTimeout(displayGame, currentTime * 1000);
}
//Display the current timer 
function displayTime(){
    currentTime--;
    if (currentTime >= 0)
    {
    $("#timer").html("<h1> Time Remaining: " + currentTime + "</h1>");
    }
}
$("#gameStart").on("click", displayGame);
$("#choices").on("click", "#answer", function (e){
    if(correctAnswer === this.textContent)
    {
         win()
    }
    else 
        lose();
})




