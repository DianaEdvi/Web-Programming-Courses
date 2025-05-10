
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function changeDiceImg(randomNumber, whichDie){
    document.querySelector(".img" + whichDie).setAttribute("src", "images/dice" + randomNumber + ".png");
}

function calculateWinner(randomNum1, randomNum2){
    let winner;
    if (randomNum1 > randomNum2){
        winner = 1;
    }
    else if (randomNum2 > randomNum1) {
        winner = 2;
    }
    else {
        return "Draw!"
    }
    return "Player " + winner + " wins!";
}

let randomNumber1 = getRandomInt(1,7);
let randomNumber2 = getRandomInt(1,7);

changeDiceImg(randomNumber1, 1);
changeDiceImg(randomNumber2, 2);

document.querySelector("h1").innerText = calculateWinner(randomNumber1, randomNumber2);
