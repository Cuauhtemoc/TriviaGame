var TriviaQuestions;
var gifs;
var currenQuestion = 17;
var correctAnswer;
var numberCorrect = 0;
var numberIncorrect = 0;
var timer;

getData("https://opentdb.com/api.php?amount=20&category=11&difficulty=easy&type=multiple", function(d){
    TriviaQuestions = d;
});
getData("http://api.giphy.com/v1/gifs/search?q=cute+dogs&api_key=6eo1uTgLl9IbW6ustLLdSjQ5wh4RH9XM", function(d){
gifs = d;
});

function getData (url, callback) {
    var xhr = new XMLHttpRequest;
    xhr.open("GET", url);

    xhr.onload = function(){
    console.log(xhr.status); 
    var data;   
    data = JSON.parse(this.responseText);
    callback(data); 
    console.log(data);
    }
    xhr.send();
}
function displayGame (){
        console.log(numberCorrect);
        console.log(numberIncorrect);
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
        var q = $("<h1>");
        var c = $("<form>");
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
        timer = setTimeout(timesUp, 20000);
    }
} ;
function timesUp(){ 
    numberIncorrect++;
    $('#choices').empty();
    $("#question").empty();
    $("#choices").append(correctAnswer);
    clearTimeout(timer);
    setTimeout(displayGame, 5000);
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
    winnerGif.attr("src", gifs.data[currenQuestion].images.downsized.url);
    $('#choices').empty();
    $("#question").empty();
    $("#question").append(correctAnswer);
    $("#choices").append(winnerGif);
    numberCorrect++;
    clearTimeout(timer);
    setTimeout(displayGame, 5000);

}
function lose(){
    var winnerGif = $("<img>");
    winnerGif.attr("src", gifs.data[currenQuestion].images.downsized.url);
    $('#choices').empty();
    $("#question").empty();
    $("#question").append(correctAnswer);
    $("#choices").append(winnerGif);
    numberIncorrect++;
    clearTimeout(timer);
    setTimeout(displayGame, 5000);
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




