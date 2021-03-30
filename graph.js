let graph_width = MAX_WIDTH / 2, graph_height = 575;

let svg_graph = d3.select("#graph")
    .append("svg")
    .attr("width", graph_width)
    .attr("height", graph_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Define forces along X and Y axes with custom center and strength values
const forceX = d3.forceX(graph_width / 2).strength(0.05);
const forceY = d3.forceY((graph_height + margin.top) / 2).strength(0.05);

// Graph title
let graph_title = svg_graph.append("text")
.attr("transform", `translate(${(graph_width / 2)}, ${-20})`)
.style("text-anchor", "middle")
.style("font-size", 15)
.text("Top Director - Actor pairs ");

// Create D3 forceSimulation for graph
let simulation = d3.forceSimulation()
.force('x', forceX)
.force('y',  forceY)
// Use data id field for links
.force("link", d3.forceLink().id(function(d) { return d.id; }))
.force("charge", d3.forceManyBody())
.force("center", d3.forceCenter((graph_width - margin.right) / 2,
    (graph_height - margin.top) / 2));

let color_artists = d3.scaleOrdinal(d3.schemeTableau10);

let graph_data;
d3.csv("data/graph.csv").then(function(d) {
    graph_data = d
    nodes = []
    links = []
    
    startGraph({nodes: nodes, links: links});
});

function startGraph(graph) {
    // Initialize the links
    let link = svg_graph.append("g")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("stroke-width", "2");
    //.attr("id", function(d) {return ''})
  

    // Initialize the nodes
    let node = svg_graph.append("g")
    .selectAll("circle")
    .data(graph.nodes)
    .enter()
    .append("circle")
    .attr("r", 20)
    .style("fill", "#69b3a2");
}



