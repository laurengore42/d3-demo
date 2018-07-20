var drawGithub = (function () {


    function loadData() {
        var d = {};
        d =
            [
                { "repo": "Repo1", "login": "Login1", "contributions": "10" },
                { "repo": "Repo1", "login": "Login2", "contributions": "50" }
            ];
            
        d.forEach(function (element) {
            element.contributions = +element.contributions;
        });
        return d;
    }
    
    var simulation;
    var link;
    var node;

    function go() {
        var dataFromCsv = loadData();

        var graph = {};
        graph.nodes = [];
        graph.links = [];
        dataFromCsv.forEach(function(contributorLink) {
            var addLogin = true;
            var addRepo = true;
            for(i = 0; i < graph.nodes.length; i++) {
                if (graph.nodes[i].id == contributorLink.login) {
                    addLogin = false;
                }
                if (graph.nodes[i].id == contributorLink.repo) {
                    addRepo = false;
                }
                if (!addLogin && !addRepo) {
                    break;
                }
            }
            if (addRepo) {
                graph.nodes.push({
                    id: contributorLink.repo,
                    group: 1
                });
            }
            if (addLogin) {
                graph.nodes.push({
                    id: contributorLink.login,
                    group: 2
                });
            }
            graph.links.push({
                source: contributorLink.repo,
                target: contributorLink.login,
                value: contributorLink.contributions
            });
        });

        d3.select("#example-github")
            .append("svg:svg")
            .attr("id", "mySvgGithub");

        var width = 1000;
        var height = 1300;
        var svg = d3.select("#mySvgGithub")
            .attr("width", width)
            .attr("height", height);
        
        var color = d3.scaleOrdinal(d3.schemeCategory20);
        var colorGrey = d3.scaleLinear().domain([0,50]).range(['snow', 'black']);
        
        simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke", function (d) { return colorGrey(Math.floor(Math.sqrt(d.value))); })
            .attr("stroke-width", 2);

        node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("r", 5)
            .attr("fill", function (d) { return color(d.group); })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(function (d) { return d.id; });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

    }

    document.addEventListener("DOMContentLoaded", function (event) {
        go();
    });

    
    function ticked() {
        link
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });

    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
}());