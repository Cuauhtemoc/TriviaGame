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
    console.log(xhr.status); 
    var data;   
    data = JSON.parse(this.responseText);
    captureData(data); 
    }
    xhr.send();
}
function displayGame (){
        startTimer = true;
        startTimer = true;
        currentTime = 20;
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
        var q = $("<h1>");
        var choice = []
        q.html(TriviaQuestions.results[currenQuestion].question);
        $("#question").append(q)
        for (i = 0; i < TriviaQuestions.results[currenQuestion].incorrect_answers.length; i++)
        {
            choice.push(TriviaQuestions.results[currenQuestion].incorrect_answers[i]);            
        }
        choice.push(TriviaQuestions.results[currenQuestion].correct_answer);
        shuffle(choice);
        console.log(choice);
        for (i = 0; i < choice.length; i++)
        {
            $("#choices").append(("<button id = 'answer'>" + choice[i] + "</button>"));
        }
        timer = setTimeout(timesUp, currentTime * 1000);
        timerOnscreen = setInterval(displayTime, 1000);
    }
} ;
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
    console.log("endGame");
}
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
function displayTime(){
    currentTime--;
    if (currentTime >= 0)
    {
    $("#timer").html("<h1> Time Remaining: " + currentTime + "</h1>");
    console.log(currentTime);
    }
}
$("#gameStart").on("click", displayGame);
$("#choices").on("click", "#answer", function (e){
    console.log(this.textContent);
    console.log(correctAnswer);
    if(correctAnswer === this.textContent)
    {
         win()
    }
    else 
        lose();
})




