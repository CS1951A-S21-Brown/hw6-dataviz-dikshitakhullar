const NUM_EXAMPLES_2 = 20
let bar2_width = MAX_WIDTH / 2, bar2_height = 575;

let svg_barplot2 = d3.select("#barplot_2")
    .append("svg")
    .attr("width", bar2_width)
    .attr("height", bar2_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let countRef2 = svg_barplot2.append("g");

// Create a linear scale for the x axis (number of occurrences)
let bar2_x = d3.scaleLinear()
    .range([0, bar2_width - margin.left - margin.right]);

// Create a scale band for the y axis (genres)
let bar2_y = d3.scaleBand()
    .range([0,(bar2_height- margin.top- margin.bottom)])
    .padding(0.1);

// Add y-axis label
let y_axis_label = svg_barplot2.append("text")
    .attr("transform",`translate(${-65}, ${-1})` )
    .style("text-anchor", "middle")
    .text("Director-Actor Pairs");

let bar2_label =  svg_barplot2.append("g");
    


let color_2 = d3.scaleOrdinal()
    // .domain(data.map(function(d) { return d["listedin"] }))
    .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), NUM_EXAMPLES_2));


function setBar2Data() {
    d3.csv("data/graph.csv").then(function(d) {
        let bar_data =d;
        actor_director_pair = [];
        for(let i = 0; i < bar_data.length; i++){
            actor_director_pair.push([bar_data[i]['director'], bar_data[i]['actor']]);
        }

        let final_data = [];
        for(let i = 0; i < NUM_EXAMPLES_2; i++) {
            final_data.push({pair: actor_director_pair[i], count: bar_data[i]['count']});
        }
        use2(final_data);
    });
}

function use2(final_data) {
    // Update the x axis domain with the max count of the provided data
    bar2_x.domain([0, d3.max(final_data, function(d) { return parseInt(d.count); })]);
    // Update the y axis domains with the desired attribute
    bar2_y.domain(final_data.map(function(d) { return d.pair }));
    //color_2.domain(final_data.map(function(d) { return d.pair }));

   
    bar2_label.call(d3.axisLeft(bar2_y).tickSize(5).tickPadding(10));

    let bars2 = svg_barplot2.selectAll("rect").data(final_data);
    bars2.enter()
    .append("rect")
    .merge(bars2)
    .transition()
    .duration(1000)
    .attr("fill", function(d) { return color_2(d.pair) }) 
    .attr("x", bar2_x(0))
    .attr("y", function(d) {
        return bar2_y(d.pair); 
    })             
    .attr("width", function(d) { return bar2_x(d.count);})
    .attr("height",  bar2_y.bandwidth());    
    

    let counts2 = countRef2.selectAll("text").data(final_data);
    counts2.enter()
    .append("text")
    .merge(counts2)
    .transition()
    .duration(1000)
    .attr("x", function(d) { return bar2_x(d['count']) + 15; })
    .attr("y", function(d) { return bar2_y(d['pair']) + 15; })
    .style("text-anchor", "middle")
    .style("font-size", 10)
    .text(function(d) { return d['count']});

    //  y_axis_text.text('genreeee');
    // title.text(`Number of Titles per Genre on Netflix `);


    // Remove elements not in use if fewer groups in new dataset
    bars2.exit().remove();
    counts2.exit().remove();
    
}

//Add x-axis label
svg_barplot2.append("text")
    .attr("transform",
        `translate(${(bar2_width - margin.left - margin.right)},
        ${(bar2_height - margin.top - margin.bottom)})`)
    .style("text-anchor", "middle")
    .text("Number of Movies");



// Add chart title
let bar2_title = svg_barplot2.append("text")
    .attr("transform", `translate(${(bar2_width - margin.left - margin.right) / 2}, ${-20})`)
    .style("text-anchor", "middle")
    .style("font-size", 16)
    .attr("font-weight", 500)
    .text("Number of Times a Director and Actor has worked together");



setBar2Data();