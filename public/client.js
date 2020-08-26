const button = document.querySelector(".submit");
const content = document.querySelector(".content");
const board = document.querySelector(".board");
let info;
let text;
let username, password, username2, password2;
let tries = 1;
let authenticated = false;
let roll, roll2, roll3;
let turn = false;
let winner;
let finished = false;
let player1, player2;
let progress = "roll";
let goes = 1;
let justRolledDouble = false;

button.addEventListener("click", async () => {
    await authenticate();

    if (authenticated) {
        content.style.display = "flex";
        if (!player1) {
            player1 = {
                "username": username.value,
                "score": 0
            };
            console.log("cool, you're in 😎!");
            content.textContent = `Welcome, ${player1.username} !😊`;
        } else if (player1 && !player2) {
            player2 = {
                "username": username.value,
                "score": 0
            };
            console.log("cool, you're in 😎!");
            content.textContent = `Welcome, ${player1.username} and ${player2.username} !😊`
        }
        content.style.padding = "0px";
    }
});

document.getElementById("passwordInput").addEventListener("keyup", async () => {
    if (event.keyCode == 13) {
        event.preventDefault();
        await authenticate();
        if (authenticated) {
            content.style.display = "flex";
            if (!player1) {
                player1 = {
                    "username": username.value,
                    "score": 0
                };
                console.log("cool, you're in 😎!");
                content.textContent = `Welcome, ${player1.username} !😊`;
            } else if (player1 && !player2) {
                player2 = {
                    "username": username.value,
                    "score": 0
                };
                console.log("cool, you're in 😎!");
                content.textContent = `Welcome, ${player1.username} and ${player2.username} !😊`
            }
            content.style.padding = "0px";
        }
    }
});

authenticate = async () => {
    if (player2) {
        player1 = undefined;
        player2 = undefined;
    }
    username = document.getElementById("usernameInput");
    password = document.getElementById("passwordInput");
    usernamevalue = username.value;
    passwordvalue = password.value;
    const data = { usernamevalue, passwordvalue };
    const options = {
        method: `POST`,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    const response = await fetch("/authenticate", options);
    const jsonData = await response.json();

    authenticated = jsonData;
    if (player1 && username.value == player1.username) {
        authenticated = false;
        document.querySelector("#error").textContent = "Already logged in";
        document.querySelector(".error").style.display = "block";
    } else if (username.value != "" && password.value != "") {
        password.value = "";
        if (tries < 5 && !authenticated) {
            tries++;
            document.querySelector(".error").style.display = "block";
            document.querySelector("#error").textContent = "Sorry, please try again";
        } else {
            document.querySelector(".input").style.display = "none";
            document.querySelector(".lock").style.display = "block";
            document.querySelector("img").style.display = "none";
            if (!authenticated) {
                document.querySelector(".lock").textContent = "Sorry, please come back later";
                localStorage.setItem("lock", new Date().getTime());
            } else {
                document.querySelector(".error").style.display = "none";
                document.querySelector(".lock").style.display = "none";
                document.querySelector("body").style.backgroundImage = "url(\"f3a80a4d53adf66770b49583b73b0cac.gif\")";
                heightResize(200);
                tries = 0;
            }
        }
    }
    return;
}

sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

rollDie = async (num) => {
    for (let i = 0; i < 30 + num * 3; i++) {
        var roll = Math.floor(Math.random() * 6) + 1;
        document.querySelector(`.dice${num}`).src = `Dice${roll}.png`;
        await sleep((i / 30) * 250);
    }
    document.querySelector(`.dice${num}`).style.border = "solid gold 4px";
    document.querySelector(`.dice${num}`).style.transform = "translate(0px, -2px)";
    document.querySelector(`.dice${num}`).style.padding = "0px";
    return Promise.resolve(roll);
}

check1 = async (turn) => {
    for (let i = 0; i < ((Math.random() * 5) + 5); i++) {
        switch (i % 3) {
            case 0:
                info.textContent = "Checking score."
                break;

            case 1:
                info.textContent = "Checking score.."
                break;

            case 2:
                info.textContent = "Checking score..."
                break;
        }
        await sleep(500);
    }

    if (justRolledDouble) {
        if (turn) {
            player1.score += roll3;
            text.innerHTML += `<li>${player1.username}:  ${player1.score}</li>`;
        } else {
            player2.score += roll3;
            text.innerHTML += `<li>${player2.username}:  ${player2.score}</li>`;
        }
        progress = "roll";
        justRolledDouble = false;
        if (goes >= 10) {
            finished = true;
        }
        return;
    } else if (turn) {
        player2.score += roll + roll2;
    } else {
        player1.score += roll + roll2;
    }

    progress = "check2";
}

check2 = async (turn) => {

    if (turn) {
        if ((roll + roll2) % 2 == 0) {
            player2.score += 10;
            if (roll == roll2 && !justRolledDouble) {
                progress = "double";
                return;
            }
            info.textContent = "+10!👌";
        } else {
            player2.score - 5 >= 0 ? player2.score -= 5 : player2.score = 0;
            if (roll == roll2 && !justRolledDouble) {
                progress = "double";
                return;
            }
            info.textContent = "-5😢";
        }
        text.innerHTML += `<li>${player2.username}:  ${player2.score}</li>`;
    } else {
        if ((roll + roll2) % 2 == 0) {
            player1.score += 10;
            if (roll == roll2 && !justRolledDouble) {
                progress = "double";
                return;
            }
            info.textContent = "+10!👌";
        } else {
            player1.score - 5 >= 0 ? player1.score -= 5 : player1.score = 0;
            if (roll == roll2 && !justRolledDouble) {
                progress = "double";
                return;
            }
            info.textContent = "-5😢";
        }
        text.innerHTML += `<li>${player1.username}:  ${player1.score}</li>`;
    }
    progress = "roll";
    if (goes >= 10) {
        finished = true;
    }
}

double = async (turn) => {

    document.querySelector(".dice3").style.display = "block";
    info.textContent = "You rolled a double!";
    roll3 = await rollDie(3);

    justRolledDouble = true;
    progress = "check1";
}

tie = async () => {
    info.innerHTML = "Tie breaker!";
    let tie_die1 = await rollDie(1);
    let tie_die2 = await rollDie(2);
    info.innerHTML = `Tie breaker:      ${player1.username}:  ${tie_die1}       ${player2.username}: ${tie_die2}`;
    if (tie_die1 > tie_die2) {
        finished = true;
        progress = "results";
    } else if (tie_die2 > tie_die1) {
        finished = true;
        progress = "results";
    } else {
        progress = "tie";
    }
}

results = () => {
    info.innerHTML = `Results:      ${player1.username}: ${player1.score}       ${player2.username}: ${player2.score}`;
    progress = "end";
    finished = false;
    player1.score > player2.score ? winner = player1 : winner = player2;
}

end = async (winner, score) => {
    document.querySelector(".player").textContent = `${winner} wins with a score of ${score}!`;
    const data = { winner, score };
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    const response = await fetch("/winner", options);
    const responseJSON = await response.json();
    console.table(responseJSON.leaderboard);
    info.textContent = `${responseJSON.place} place!`;
    document.querySelector(".roll").style.display = "none";
    document.querySelector(".lb").style.display = "inline-block";
}

playGame = async () => {
    content.innerHTML = `<h2>Welcome, ${player1.username} and ${player2.username}!</h2><h3 class=player>Player1: ${player1.username}</h3><div class="display"><p class="info">Hello!</p><img class="dice1" src="Dice1.png"><img class="dice2" src="Dice1.png"><img class="dice3" src="Dice1.png"></div><ul class="text"></ul><button class="roll">Next</button><button class="lb" onclick="displayLeaderboard();">leaderboard</button><br>`;
    content.style.paddingTop = "50px";
    content.style.paddingBottom = "241px";
    text = document.querySelector(".text");
    info = document.querySelector(".info");
    goes = 1;
    document.querySelector(".roll").addEventListener("click", async () => {

        if (document.querySelector(".roll").style.filter != "grayscale(1)") {
            document.querySelector(".dice3").style.display = "none";
            document.querySelector(".dice1").style.border = "none";
            document.querySelector(".dice1").style.transform = "translate(0px, -2px)";
            document.querySelector(".dice1").style.padding = "4px";
            document.querySelector(".dice2").style.border = "none";
            document.querySelector(".dice2").style.transform = "translate(0px, -2px)";
            document.querySelector(".dice2").style.padding = "4px";

            if (finished) {
                progress = "results";
            }

            switch (progress) {
                case "roll":
                    document.querySelector(".roll").style.filter = "grayscale(1)";
                    if (turn == false) document.querySelector(".player").textContent = `Player1: ${player1.username}`;
                    if (turn == true) document.querySelector(".player").textContent = `Player2: ${player2.username}`;
                    info.textContent = "Rolling dice 1...";
                    roll = await rollDie(1);
                    info.textContent = "Rolling dice 2...";
                    roll2 = await rollDie(2);
                    progress = "check1";
                    document.querySelector(".roll").style.filter = "none";
                    break;

                case "check1":
                    document.querySelector(".roll").style.filter = "grayscale(1)";
                    info.textContent = "Adding score..."
                    await check1(turn);
                    document.querySelector(".roll").style.filter = "none";
                    break;

                case "check2":
                    document.querySelector(".roll").style.filter = "grayscale(1)";
                    await check2(turn);
                    if (!justRolledDouble) goes++;
                    turn = !turn;
                    document.querySelector(".roll").style.filter = "none";
                    break;

                case "double":
                    document.querySelector(".roll").style.filter = "grayscale(1)";
                    await double(turn);
                    document.querySelector(".roll").style.filter = "none";
                    break;

                case "tie":
                    document.querySelector(".roll").style.filter = "grayscale(1)";
                    await tie();
                    document.querySelector(".roll").style.filter = "none";
                    break;

                case "results":
                    document.querySelector(".roll").style.filter = "grayscale(1)";
                    results();
                    document.querySelector(".roll").style.filter = "none";
                    break;

                case "end":
                    document.querySelector(".roll").style.filter = "grayscale(1)";
                    end(winner.username, winner.score);
                    document.querySelector(".roll").style.filter = "none";

                default:
                    document.querySelector(".roll").style.filter = "none";
                    break;
            }
            totalHeight = document.body.scrollHeight - window.innerHeight;
        }
    });
}
