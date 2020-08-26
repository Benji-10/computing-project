const express = require("express");
const app = express();
const datastore = require("nedb");
const fs = require("fs");
app.use(express.json());
app.listen(9853, () => { console.log("listening at port 9853") });
app.use(express.static("C:\\Users\\benja\\OneDrive\\Documents\\Node Projects\\Computing game\\public"));

var users = fs.readFileSync("users.json");
users = JSON.parse(users);
let index;

const leaderboard = new datastore("leaderboard.db");
leaderboard.loadDatabase();

app.post("/authenticate", (request, response) => {
    for (let i = 0; i < users.users.length; i++) {
        if (users.users[i].name == request.body.usernamevalue && users.users[i].password == request.body.passwordvalue) {
            response.json(true);
            return;
        }
    }
    response.json(false);
    return
});

app.post("/winner", (request, response) => {
    const score = request.body.score;
    const winner = request.body.winner;
    leaderboard.find({}, (err, docs) => {
        index = docs.length + 1;
        const player = {
            "player": winner,
            "score": score,
            "_id": index
        };
        docs.push(player);
        docs.sort((a, b) => b.score - a.score);
        index = 0;
        for (const item of docs) {
            index++;
            if (item._id == player._id) {
                place = index;
            }
        }

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

        console.log(place + " place");

        leaderboard.remove({}, { multi: true });

        for (const player of docs) {
            leaderboard.insert(player);
        }

        leaderboard.find({}, (err, docs) => {
            docs.sort((a, b) => b.score - a.score);
            console.table(docs);
        });

        response.json({
            "leaderboard": docs,
            "place": place
        });
    });
});


app.get("/leaderboard", (request, response) => {
    leaderboard.find({}, (err, docs) => {
        docs.sort((a, b) => b.score - a.score);
        response.json({
            "leaderboard": docs
        });
    });
});