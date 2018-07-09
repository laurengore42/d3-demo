var drawCircles = (function () {
    var numberOfCircles = 50;
    const widthOfSvg = 800;

    var circleData;

    function buildSvg() {
        circleData = [];
        for (i = 0; i < numberOfCircles; i++) {
            circleData.push(randomColour());
        }

        var exampleDiv = d3.select("#example-circles");

        exampleDiv.append("svg:svg")
            .attr("id", "mySvgCircles")
            .attr("width", widthOfSvg)
            .append("svg:rect")
            .attr("width", widthOfSvg)
            .attr("id", "svgBorder")
            .attr("fill", "none")
            .attr("stroke", "black");

        setInterval(tick, 250);
    }

    function tick() {
        circleData.shift();
        circleData.push(randomColour());
        updateVisualisation();
    }

    function updateDataToMatchInput() {        
        var newNumber = numberOfCircles;
        var numberInput = d3.select("#numberOfCircles").property("value");
        if (parseInt(numberInput) > 0) {
            newNumber = numberInput;
        }
        while (newNumber > numberOfCircles) {
            circleData.push(randomColour());
            numberOfCircles++;
        }
        while (newNumber < numberOfCircles) {
            circleData.shift();
            numberOfCircles--;
        }
    }

    function updateHeightOfSvg() {        
        var heightOfSvg = 2 * widthOfSvg / numberOfCircles;
        d3.select("#mySvgCircles").attr("height", heightOfSvg);
        d3.select("#svgBorder").attr("height", heightOfSvg);
        return heightOfSvg;
    }

    function updateVisualisation() {
        updateDataToMatchInput();

        var heightOfSvg = updateHeightOfSvg();

        var circleRadius = 0.5 * widthOfSvg / (numberOfCircles - 1);

        var circles = d3.select("#mySvgCircles")
            .selectAll("circle")
            .data(circleData)
            .style("fill", function (d) { return d })
            .attr("cx", function (d, i) { return i * 2 * circleRadius })
            .attr("cy", heightOfSvg / 2)
            .attr("r", circleRadius);

        circles.exit()
            .remove();

        circles.enter()
            .append("circle")
            .attr("cx", function (d, i) { return i * 2 * circleRadius })
            .attr("cy", heightOfSvg / 2)
            .attr("r", circleRadius)
            .style("fill", function (d) { return d });
    }

    document.addEventListener("DOMContentLoaded", function (event) {
        buildSvg();
        updateVisualisation();
    });


    function randomColour() {
        return "rgb(" + randomRgb() + ", " + randomRgb() + ", " + randomRgb() + ")";
    }

    function randomRgb() {
        return Math.floor(Math.random() * 256);
    }
}());