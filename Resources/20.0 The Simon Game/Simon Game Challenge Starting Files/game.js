
let buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];

let gameStarted = false;
let level = 0;
function nextSequence(){
    let randomNumber = Math.floor(Math.random()*4);
    let randomChosenColor = buttonColors[randomNumber];

    gamePattern.push(randomChosenColor);

    playSound(randomChosenColor);
    animateButton(randomChosenColor);

    $("#level-title").text("Level " + level);
    level++;
}

function detectUserActions(){
    let buttons = $(".btn");

    buttons.on("click", function(){
        let userChosenColor = $(this).attr("id");
        userClickedPattern.push(userChosenColor);
        playSound(userChosenColor);
        animateButton(userChosenColor);
        checkAnswer(userClickedPattern.length - 1);
    });
}

function playSound(name){
    let audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

function animateButton(name){
    $("#" + name).addClass("pressed");

    setTimeout(function(){
        $("#" + name).removeClass("pressed");
    }, 100);
}

function checkAnswer(currentLevel){
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]){
        if (currentLevel === gamePattern.length -1){
            setTimeout(nextSequence, 1000);
            userClickedPattern = [];
        }
    }
    else {
        playSound("wrong");

        $("body").addClass("game-over");

        setTimeout(function(){
            $("body").removeClass("game-over");
        }, 200);

        $("#level-title").text("Game over. Press any key to restart");

        startOver();
    }
}

function startOver(){
    level = 0;
    gameStarted = false;
    gamePattern = [];
    userClickedPattern = [];
}

detectUserActions();
$(document).on("keydown", function(){
    if (!gameStarted){
        nextSequence();
        gameStarted = true;
    }
})



