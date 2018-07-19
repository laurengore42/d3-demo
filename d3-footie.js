var drawGithub = (function () {

    function loadData() {
        var d = [];
        d =
            [];

        return d;
    }

    function loadTeamData() {
        var d = [];
        d = [];
        return d;
    }

    var standings;

    function go() {
        // establish array of teams
        var teamDataFromJson = loadTeamData();
        var teams = [];
        teamDataFromJson.forEach(function (t) {
            t.points = 0;
            t.played = 0;
            t.goalsFor = 0;
            t.goalsAgainst = 0;
            teams[t.id] = t;
        });

        // run through season and establish points ranking
        var dataFromJson = loadData();
        dataFromJson.forEach(function (match) {
            var homeTeam = teams[match.homeTeam.id];
            var awayTeam = teams[match.awayTeam.id];
            homeTeam.played++;
            homeTeam.goalsFor += match.score.fullTime.homeTeam;
            homeTeam.goalsAgainst += match.score.fullTime.awayTeam;
            awayTeam.played++;
            awayTeam.goalsFor += match.score.fullTime.awayTeam;
            awayTeam.goalsAgainst += match.score.fullTime.homeTeam;
            if (match.score.winner === "HOME_TEAM") {
                homeTeam.points += 3;
            }
            else if (match.score.winner === "AWAY_TEAM") {
                awayTeam.points += 3;
            }
            else {
                homeTeam.points += 1;
                awayTeam.points += 1;
            }
        });
        teams.forEach(function (team) {
            team.goalDiff = team.goalsFor - team.goalsAgainst;
        })

        // that gives us the standings at the end of the season
        // display them in a boring way

        standings = teams.sort(compareTeamStandings);
        console.log(standings);
    }

    function compareTeamStandings(a, b) {
        if (a.points != b.points) {
            return b.points - a.points;
        }
        if (a.goalDiff != b.goalDiff) {
            return b.goalDiff - a.goalDiff;
        }
        if (a.goalsFor != b.goalsFor) {
            return b.goalsFor - a.goalsFor;
        }
        if (a.name < b.name) {
            return 1;
        }
        if (a.name > b.name) {
            return -1;
        }
        return 0;
    }

    document.addEventListener("DOMContentLoaded", function (event) {
        go();
    });
}());