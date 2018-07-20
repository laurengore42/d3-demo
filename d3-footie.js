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

    var scoreGraph;

    function go() {
        // establish array of teams
        var teamDataFromJson = loadTeamData();
        var teams = [];
        teamDataFromJson.forEach(function (t) {
            t.points = 0;
            t.played = 0;
            t.goalsFor = 0;
            t.goalsAgainst = 0;
            t.win = 0;
            t.draw = 0;
            t.lose = 0;
            teams[t.id] = t;
        });

        // run through season and establish points ranking
        var dataFromJson = loadData();
        var firstMatchDate = (new Date(dataFromJson.sort(compareDate)[0].utcDate)).toISOString().split("T")[0];
        scoreGraph = [];
        scoreGraph[firstMatchDate] = [];
        teams.forEach(function(t) {
            scoreGraph[firstMatchDate][t.id] = 0;
        })
        var prevMatchDate = firstMatchDate;
        dataFromJson.forEach(function (match) {
            var homeTeam = teams[match.homeTeam.id];
            var awayTeam = teams[match.awayTeam.id];
            var matchDate = (new Date(match.utcDate)).toISOString().split("T")[0];
            if (scoreGraph[matchDate] == undefined) {
                scoreGraph[matchDate] = [];
                teams.forEach(function(t) {
                    scoreGraph[matchDate][t.id] = scoreGraph[prevMatchDate][t.id];
                })
                scoreGraph[matchDate] = scoreGraph[prevMatchDate].concat();
                prevMatchDate = matchDate;
            }
            homeTeam.played++;
            homeTeam.goalsFor += match.score.fullTime.homeTeam;
            homeTeam.goalsAgainst += match.score.fullTime.awayTeam;
            awayTeam.played++;
            awayTeam.goalsFor += match.score.fullTime.awayTeam;
            awayTeam.goalsAgainst += match.score.fullTime.homeTeam;
            if (match.score.winner === "HOME_TEAM") {
                homeTeam.points += 3;
                homeTeam.win++;
                scoreGraph[matchDate][homeTeam.id] += 3;
                awayTeam.lose++;
            }
            else if (match.score.winner === "AWAY_TEAM") {
                awayTeam.points += 3;
                awayTeam.win++;
                scoreGraph[matchDate][awayTeam.id] += 3;
                homeTeam.lose++;
            }
            else {
                homeTeam.points += 1;
                homeTeam.draw++;
                scoreGraph[matchDate][homeTeam.id] += 1;
                awayTeam.points += 1;
                awayTeam.draw++;
                scoreGraph[matchDate][awayTeam.id] += 1;
            }
        });


        var height = 600;
        var width = 960;
        d3.select("#example-footie")
            .append("svg:svg")
            .attr("height", height)
            .attr("width", width)
            .attr("id", "mySvgFootie");

        var margin = {top: 20, right: 80, bottom: 30, left: 50};
        width = width - margin.left - margin.right;
        height = height - margin.top - margin.bottom;

        g = d3.select("#mySvgFootie")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);
        var z = d3.scaleOrdinal(d3.schemeCategory20);
        
        var line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.points); });
        
        var parseTime = d3.timeParse("%Y-%m-%d");

        teams.forEach(function (t) {
            t.scoreDates = [];
            for (var key in scoreGraph) {
                t.scoreDates.push({
                    date: parseTime(key),
                    points: scoreGraph[key][t.id]
                });
            }
        });
        var teamsWithScores = [];
        teams.forEach(function(t) {
            teamsWithScores.push({
                id: t.shortName,
                values: t.scoreDates
            });
        });
        
        var xAxis = [];
        for (var key in scoreGraph) {
            xAxis.push(parseTime(key));
        }
        
        x.domain(d3.extent(xAxis));
        
        y.domain([
            d3.min(teamsWithScores, function(c) { return d3.min(c.values, function(d) { return d.points; }); }),
            d3.max(teamsWithScores, function(c) { return d3.max(c.values, function(d) { return d.points; }); })
        ]);
        
        z.domain(teamsWithScores.map(function(c) { return c.id; }));
        
        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        
        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("Points");
        
        var teamScore = g.selectAll(".teamScore")
            .data(teamsWithScores)
            .enter().append("g")
            .attr("class", "teamScore");
        
            teamScore.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d) { return z(d.id); });
        
            teamScore.append("text")
            .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.points) + ")"; })
            .attr("x", 3)
            .attr("dy", "0.35em")
            .style("font", "6px sans-serif")
            .text(function(d) { return d.id; });
    }
    
    function compareDate(a, b) {
        return a.utcDate > b.utcDate ? 1 : a.utcDate < b.utcDate ? -1 : 0;
    }

    document.addEventListener("DOMContentLoaded", function (event) {
        go();
    });
}());