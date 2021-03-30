let line_width = (MAX_WIDTH / 2) - 10,  line_height = 275;

let svg_line = d3.select("#linechart")
    .append("svg")
    .attr("width", line_width)
    .attr("height", line_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// var bisectDate = d3.bisector(function(d) { return d.year; }).left;

let x_line= d3.scaleLinear()
    .range([0, line_width - margin.left - margin.right]);

let x_line_label = svg_line.append("g")
    .attr("transform", `translate(0, ${line_height - margin.top - margin.bottom})`);

let y_line = d3.scaleLinear()
    .range([0, line_height - margin.top - margin.bottom]); 

let y_line_label = svg_line.append("g");

let color_line = d3.scaleOrdinal();

// Set up reference to tooltip
let tooltip = d3.select("#linechart") 
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Add x-axis label
svg_line.append("text")
    .attr("transform",
        `translate(${(line_width - margin.left - margin.right) / 2},
        ${(line_height - margin.top - margin.bottom) + 40})`)
    .style("text-anchor", "middle")
    .text("Years");

// Add y-axis label
svg_line.append("text")
    .attr("transform",
        `translate(-60, ${(line_height - margin.top - margin.bottom) / 2})`)
    .style("text-anchor", "middle")
    .text("Avg Duration");

function setLineData() {
    let year_map = {};
    d3.csv("../data/netflix.csv").then(function(d) {

        data = [...d];
        data.forEach(function(a){
            if(a['type'] == "Movie") {
                year = a['release_year'];
                cleaned_duration = parseInt(a['duration'].split(' ')[0]);
                if(year_map[year]) {
                    year_map[year].push(cleaned_duration);
                } else {
                    year_map[year] = [cleaned_duration];
                }
            }
        });

        let cleaned_line_data= [];
        for (let i=0; i < Object.keys(year_map).length; i++) {
            let k = parseInt(Object.keys(year_map)[i]);
            let avg_runtime = 0;
            for (let j =0; j < (year_map[k].length); j++){
                 avg_runtime+= (year_map[k])[j];
            }
            avg_runtime = Math.round(avg_runtime/year_map[k].length);
            cleaned_line_data.push({year: k, avg_duration: avg_runtime});

        }

        
        // parse year function 
        x_line.domain([d3.min(cleaned_line_data, function(d) { return (d.year)}), d3.max(cleaned_line_data, function(d) { return (d.year)})]);
        // Update the y axis domains with the desired attribute
        y_line.domain([d3.max(cleaned_line_data, function(d) { return d.avg_duration}), 0]);
        color_line.domain(cleaned_line_data.map(function(d) { return d.avg_duration }));

        svg_line.append("g")
        .attr("transform", `translate(${(line_width - margin.left - margin.right)/128},
        ${(line_height - margin.top - margin.bottom)})`)
        .call(d3.axisBottom(x_line).tickSize(5).tickPadding(5));

        svg_line.append("g")
        //.attr("transform", `translate((${line_height - margin.top - margin.bottom})`)
        .call(d3.axisLeft(y_line).tickSize(5).tickPadding(10));

        
        // Mouseover function to display the tooltip on hover
        let mouseover = function(d) {
            let year1 = parseInt(x_line.invert(d3.mouse(this)[0]));
            let avg_duration1 = d[(year1-1942)].avg_duration;
            console.log(d[year1-1942].avg_duration);
            //console.log(y_line.invert(parseInt(d3.mouse(this)[0])));
            let color_span = `<span style="color: ${color(year1)};">`;
            let html = `${year1}<br/>
                    Avg Duration: ${color_span}${avg_duration1}</span>`;       // HINT: Display the song here

            // Show the tooltip and set the position relative to the event X and Y location
            tooltip.html(html)
                .style("left", `${(d3.event.pageX) - 100}px`)
                .style("top", `${(d3.event.pageY) -50}px`)
                .style("box-shadow", `2px 2px 5px ${color(d.avg_duration)}`)    // OPTIONAL for students
                .transition()
                .duration(200)
                .style("opacity", 0.99);
        };

        // Mouseout function to hide the tool on exit
        let mouseout = function(d) {
            // Set opacity back to 0 to hide
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        };


        let lines = svg_line.append("path")
        .datum(cleaned_line_data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
        .x(function(d) { return x_line(d.year) })
        .y(function(d) { return y_line(d.avg_duration) }))
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
        // .on("mouseover", function() { focus.style("display", null); })
        // .on("mouseout", function() { focus.style("display", "none"); })
        // .on("mousemove", mousemove);

    }); 
}


// Add chart title
let title_line= svg_line.append("text")
    .attr("transform", `translate(${(line_width - margin.left - margin.right) / 2}, ${-20})`)
    .style("text-anchor", "middle")
    .style("font-size", 16)
    .attr("font-weight", 500)
    .text("Average duration of Movies over the years*");

setLineData();

    


