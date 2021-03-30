let barplot_width = (MAX_WIDTH / 2) - 10, barplot_height = 250;

let svg_barplot = d3.select("#barplot")
    .append("svg")
    .attr("width", barplot_width)
    .attr("height", barplot_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let countRef = svg_barplot.append("g");

// Create a linear scale for the x axis (number of occurrences)
let x = d3.scaleLinear()
    .range([0, barplot_width - margin.left - margin.right]);

// Create a scale band for the y axis (genres)
let y = d3.scaleBand()
    .range([0,(barplot_height- margin.top- margin.bottom)])
    .padding(0.1);

// Add y-axis label
let y_axis_text = svg_barplot.append("text")
    .attr("transform",`translate(${-30}, ${-5})` )
    .style("text-anchor", "middle")
    .text("Genres");

let label =  svg_barplot.append("g");
    


let color = d3.scaleOrdinal()
    //.domain(data.map(function(d) { return d["listedin"] }))
    .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), NUM_EXAMPLES));


function setBarData(index, attr) {
    let type = "Movie";
    let cleaned_data;

    if(index==1) {
        //console.log(type)
        type = "TV Show";
        bar_title.text("Number of Titles of TV Shows per Genre");
    } else {
        bar_title.text("Number of Titles of Movies per Genre");
    }


    
    d3.csv("../data/netflix.csv").then(function(d) {
        data = [...d];
        let genre_map = {};
        let updated_data = filterDataByType(data, type)
        updated_data.forEach(function(a){
            cleaned_genre = a[attr].toUpperCase().split(',');
            cleaned_genre.forEach(function(g) {
                let genre = g.trim()
                if(genre_map[genre]) {
                    genre_map[genre] += 1;
                } else {
                    genre_map[genre] = 1;
                }
            });
        });  
        let attr_data = [];
        for (let i=0; i < Object.keys(genre_map).length; i++) {
            let k = Object.keys(genre_map)[i];
            attr_data.push({attr: k, count: genre_map[k]});
        }

        cleaned_data = cleanData(attr_data, function(a, b) {
            return parseInt(b.count) - parseInt(a.count)
        });
        use(attr, cleaned_data);
    });
}

function use(attr,cleaned_data) {
    // Update the x axis domain with the max count of the provided data
    x.domain([0, d3.max(cleaned_data, function(d) { return parseInt(d.count); })]);
    // Update the y axis domains with the desired attribute
    y.domain(cleaned_data.map(function(d) { return d.attr }));
    color.domain(cleaned_data.map(function(d) { return d.attr }));

   
    label.call(d3.axisLeft(y).tickSize(5).tickPadding(10));

    let bars = svg_barplot.selectAll("rect").data(cleaned_data);
    bars.enter()
    .append("rect")
    .merge(bars)
    .transition()
    .duration(1000)
    .attr("fill", function(d) { return color(d.attr) }) 
    .attr("x", x(0))
    .attr("y", function(d) { return y(d.attr); })             
    .attr("width", function(d) { return x(d.count);})
    .attr("height",  y.bandwidth());    
    

    let counts = countRef.selectAll("text").data(cleaned_data);
    counts.enter()
    .append("text")
    .merge(counts)
    .transition()
    .duration(1000)
    .attr("x", function(d) { return x(d['count']) + 15; })
    .attr("y", function(d) { return y(d['attr']) + 15; })
    .style("text-anchor", "middle")
    .style("font-size", 10)
    .text(function(d) { return d['count']});

    //  y_axis_text.text('genreeee');
    // title.text(`Number of Titles per Genre on Netflix `);


    // Remove elements not in use if fewer groups in new dataset
    bars.exit().remove();
    counts.exit().remove();
    
}

//Add x-axis label
svg_barplot.append("text")
    .attr("transform",
        `translate(${(barplot_width - margin.left - margin.right)},
        ${(barplot_height - margin.top - margin.bottom)})`)
    .style("text-anchor", "middle")
    .text("Number of Movies per Genre");




// Add chart title
let bar_title = svg_barplot.append("text")
    .attr("transform", `translate(${(barplot_width - margin.left - margin.right) / 2}, ${-20})`)
    .style("text-anchor", "middle")
    .style("font-size", 16)
    .attr("font-weight", 500);
    //.text("Number of Titles per Genre on Netflix");

/**
 * Cleans the provided data using the given comparator then strips to first numExamples
 * instances
 */
function cleanData(data, comparator) {
    // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
    data = data.sort(comparator);
    return data.slice(0,NUM_EXAMPLES);
}

/**
 * Filters the given data to only include entries of a given song and released
 * after the given year
 */
function filterDataByType(data, type) {
    return data.filter(function(a) {
        return a.type === type;
    });
}

setBarData(0, 'listed_in');