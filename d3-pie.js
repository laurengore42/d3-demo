var drawPie = (function () {

    function loadData() {
        var d = {};
        d =
            [
                { "age": "<5", "population": "2704659" },
                { "age": "5-13", "population": "4499890" },
                { "age": "14-17", "population": "2159981" },
                { "age": "18-24", "population": "3853788" },
                { "age": "25-44", "population": "14106543" },
                { "age": "45-64", "population": "8819342" },
                { "age": ">=65", "population": "612463" }
            ];
        d.forEach(function (element) {
            element.population = +element.population;
        });
        return d;
    }

    function go() {
        d3.select("#example-pie")
            .append("svg:svg")
            .attr("id", "mySvgPie");

        var svg = d3.select("#mySvgPie");
        var width = 800;
        var height = 400;
        d3.select("#mySvgPie")
            .attr("height", height)
            .attr("width", width);

        var radius = Math.min(width, height) / 2;
        var g = svg.append("g").attr("transform", "translate(" + width / 4 + "," + height / 2 + ")");

        var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]), textcolor = "#fff";
        var color = d3.scaleOrdinal(d3.schemePastel1), textcolor = "#000";
        var color = d3.scaleOrdinal(d3.schemeBlues[7]), textcolor = "red";
        var color = d3.scaleOrdinal(d3.schemeSpectral[7]), textcolor = "#000";

        var pie = d3.pie()
            .sort(null)
            .value(function (d) { return d.population; });

        var segment = d3.arc()
            .outerRadius(radius)
            .innerRadius(0);

        var label = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

        var dataFromCsv = loadData();

        var arc = g.selectAll(".arc")
            .data(pie(dataFromCsv))
            .enter()
            .append("g")
            .attr("class", "pieChartSegment");

        arc.append("path")
            .attr("d", segment)
            .attr("fill", function (d) { return color(d.data.age); });

        arc.append("text")
            .attr("transform", function (d) { return "translate(" + label.centroid(d) + ")"; })
            .attr("fill", textcolor)
            .text(function (d) { return d.data.age; });







        svg = d3.select("#mySvgPie");
        g = svg.append("g").attr("transform", "translate(" + (width / 2 + 80) + "," + 40 + ")");

        width = 400;
        height = 400;

        var x = d3.scaleBand().rangeRound([0, width*0.8]).padding(0.1);
        var y = d3.scaleLinear().rangeRound([height*0.8, 0]);

        x.domain(dataFromCsv.map(function (d) { return d.age; }));
        y.domain([0, d3.max(dataFromCsv, function (d) { return d.population; })]);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + (height - 80) + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -74)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .attr("fill", "#000")
            .text("Population");

        g.selectAll(".bar")
            .data(dataFromCsv)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return x(d.age); })
            .attr("y", function (d) { return y(d.population); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height*0.8 - y(d.population); })
            .attr("fill", function (d) { return color(d.age); });
    }

    document.addEventListener("DOMContentLoaded", function (event) {
        go();
    });

}());