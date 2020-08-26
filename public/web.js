// scroll bar
let scrolled = document.querySelector(".scrollbar");
let scrollpath = document.querySelector(".scrollpath");
let scroll = document.querySelector(".scroll");
let shine = document.querySelector(".shine");
let totalHeight = document.body.scrollHeight - window.innerHeight;
let isScrolling;

window.onscroll = () => {
    let scrolledHeight = (window.pageYOffset / totalHeight) * 98.5;
    scrolled.style.height = `${scrolledHeight}%`;
    shine.style.height = `${Math.max(scrolled.clientHeight - 20, 0)}px`;
    scrollpath.style.opacity = 1;
    scrolled.style.opacity = 1;
    shine.style.opacity = 1;
}

window.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        scrollpath.style.opacity = 0;
        scrolled.style.opacity = 0;
        shine.style.opacity = 0;
    }, 3000);
});

scroll.addEventListener("mouseover", () => {
    window.clearTimeout(isScrolling);
    scrollpath.style.opacity = 1;
    scrolled.style.opacity = 1;
    shine.style.opacity = 1;
});

scroll.addEventListener("mouseleave", () => {
    setTimeout(() => {
        scrollpath.style.opacity = 0;
        scrolled.style.opacity = 0;
        shine.style.opacity = 0;
    }, 3000);
});

scroll.addEventListener("click", () => {
    window.scrollTo(0, ((event.screenY - 75) / innerHeight) * totalHeight);
});

//log in
document.querySelector(".log-in").addEventListener("click", () => {
    if (player1) player1.score = 0;
    if (player2) player2.score = 0;
    if (info) info.textContent = "Hello!";
    if (text) text.innerHTML = "";
    goes = 1;
    progress = "roll";
    turn = false;
    finished = false;
    heightResize(100);
    totalHeight = 119;
    content.style.display = "none";
    document.querySelector(".parent").style.display = "none";
    document.querySelector(".field").style.opacity = 1;
    document.querySelector(".input").style.display = "block";
    document.querySelector(".lock").style.display = "none";
    document.querySelector("img").style.display = "block";
    document.querySelector(".image").style.height = innerHeight + "px";
    document.querySelector("body").style.backgroundImage = "none";
    if (localStorage.getItem("lock") && new Date().getTime() - localStorage.getItem("lock") < 300000) {
        document.querySelector(".field").style.opacity = 1;
        document.querySelector(".input").style.display = "none";
        document.querySelector("img").style.display = "none";
        document.querySelector(".lock").style.display = "block";
        document.querySelector(".lock").textContent = "Sorry, please come back later";
    }
});

//play
document.querySelector(".play").addEventListener("click", () => {
    heightResize(100);
    totalHeight = 119;
    content.style.display = "flex";
    document.querySelector(".parent").style.display = "none";
    document.querySelector(".field").style.opacity = 0;
    document.querySelector(".input").style.display = "none";
    document.querySelector(".lock").style.display = "none";
    document.querySelector("img").style.display = "none";
    document.querySelector("body").style.backgroundImage = "url(\"f3a80a4d53adf66770b49583b73b0cac.gif\")";
    if (player2) {
        playGame();
        totalHeight = 119;
    } else {
        heightResize(200);
        content.textContent = "Please log in";
        content.style.padding = "0px";
    }
});

//leaderboard
document.querySelector(".leaderboard").addEventListener("click", async () => {
    if (player1) player1.score = 0;
    if (player2) player2.score = 0;
    if (info) info.textContent = "Hello!";
    if (text) text.innerHTML = "";
    goes = 1;
    progress = "roll";
    turn = false;
    finished = false;
    document.querySelector("table").innerHTML = "";
    heightResize(100);
    totalHeight = 119;
    content.style.display = "none";
    document.querySelector(".input").style.display = "none";
    document.querySelector(".lock").style.display = "none";
    document.querySelector("img").style.display = "none";
    document.querySelector("body").style.backgroundImage = "url(\"f3a80a4d53adf66770b49583b73b0cac.gif\")";
    document.querySelector(".parent").style.display = "flex";
    board.style.display = "flex";
    const response = await fetch("/leaderboard");
    const responseJSON = await response.json();
    for (let player = 1; player < responseJSON.leaderboard.length + 1; player++) {
        place = player;
        if (place == 11 || place == 12 || place == 13) {
            place += "th";
        } else if (place % 10 == 1) {
            place += "st";
        } else if (place % 10 == 2) {
            place += "nd";
        } else if (place % 10 == 3) {
            place += "rd";
        } else {
            place += "th"
        }
        document.querySelector("table").innerHTML += `<tr><td>${place}</td><td>${responseJSON.leaderboard[player - 1].player}</td><td>${responseJSON.leaderboard[player - 1].score}</td></tr>`
    }
});

//how to play
document.querySelector(".rules").addEventListener("click", () => {
    heightResize(200);
    content.style.display = "flex";
    document.querySelector(".parent").style.display = "none";
    document.querySelector(".field").style.opacity = 0;
    document.querySelector(".input").style.display = "none";
    document.querySelector(".lock").style.display = "none";
    document.querySelector("img").style.display = "none";
    document.querySelector("body").style.backgroundImage = "url(\"f3a80a4d53adf66770b49583b73b0cac.gif\")";
    content.innerHTML = "<h3>How to play</h3><p>Welcome to the dice game!<br><br>To play, simply press log in and press play!<br><br>This is a dice game where a player rolls two dice by pressing next.<br><br>The numbers you roll are then added to your score.<br><br>If the numbers you roll add to be even, an additional 10 points are added to the score. But, if you roll one odd number, 5 points are deducted from your score (without going under 0).<br><br>Rolling a double will result in the player adding the result of a third dice to their score.<br><br>The highest score of the two players wins.<br><br>In case of a draw, the tie breaker is rolling one die until someone gets a bigger number!<br><br>You can then look at the leaderboard to see where you placed, or you could play again by clicking play!</p>";
    content.style.padding = "0px";
    content.style.paddingLeft = "100px";
});

heightResize = height => {
    window.scrollTo(0, 0);
    document.querySelector("body").style.height = height + "vh";
    document.querySelector("html").style.height = height + "vh";
    totalHeight = document.body.scrollHeight - window.innerHeight;
    if (totalHeight == 0) scroll.style.display = "none";
    else scroll.style.display = "block";
}