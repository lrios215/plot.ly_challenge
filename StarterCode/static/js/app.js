//Step 1: Plotly

//1. Use the D3 library to read in `samples.json`.
d3.json('samples.json').then(function (data) {
        var info = data.names;
        console.log(data.metadata);
        var select_data = d3.selectAll('#selDataset');
        Object.entries(info).forEach(function ([i, v]) {
                select_data.append('option').text(v);
            });
    })
//2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
function makePlot(testId){
    d3.json('samples.json').then(function (data) {
        var samples = data.samples;
        var bact_test = samples.map(function (row) {
            return row.id;
            }).indexOf(testId);
    
        var otu_top_ten = samples.map(function (row) {
            //* Use `sample_values` as the values for the bar chart, data amounts in JSON
            return row.sample_values; 
            });
        var otu_top_ten = otu_top_ten[bact_test].slice(0, 10).reverse();
        var otu_ID_ten = samples.map(function (row) {
            //* Use `otu_ids` as the labels for the bar chart, numerical IDs in JSON
            return row.otu_ids;
            });
        var otu_ID_ten = otu_ID_ten[bact_test].slice(0, 10);
        var otu_labels = samples.map(function (row) {
            //* Use `otu_labels` as the hovertext for the chart, bacteria labels in JSON
            return row.otu_labels;
            });
        var otu_labels = otu_labels[bact_test].slice(0, 10);
        var trace = {
            x: otu_top_ten,
            y: otu_ID_ten.map(function (r) {
                return `OTU ${r}`;
                }),
            text: otu_labels,
            type: 'bar',
            orientation: 'h'
            };
        var layout = {
            title: `Top 10 OTUs for ${id}`
        };

Plotly.newPlot('bar', layout, [trace]);

//3. Create a bubble chart that displays each sample.
        var otu_amt = samples.map(function (row) {
            // * Use `sample_values` for the y values.
            // * Use `sample_values` for the marker size.
            return row.sample_values;
            });
        var otu_amt = otu_amt[bact_test];
        var otu_id = samples.map(function (row) {
            // * Use `otu_ids` for the x values.    
            return row.otu_ids;
            });
        var otu_id = otu_id[bact_test];
        var otu_name = samples.map(function (row) {
            // * Use `otu_labels` for the text values.
            return row.otu_labels;
            });
        var otu_name = otu_name[bact_test];
        var minIds = d3.min(otu_id);
        var maxIds = d3.max(otu_id);
        var mapNr = d3.scaleLinear().domain([minIds, maxIds]).range([0, 1]);
        // * Use `otu_ids` for the marker colors.
        var bubbleColors = otu_id.map(function (val) {
            return d3.interpolateRgbBasis(["green", "orange", "blue"])(mapNr(val));
            });
        var trace1 = {
            x: otu_id,
            y: otu_amt,
            text: otu_name,
            mode: 'markers',
            marker: {
                color: bubbleColors,
                size: otu_amt.map(function (x) {
                    return x * 10;
                    }),
                sizemode: 'area'
                }
            };
        var data1 = [trace1];
        var bubbleLayout = {
            xaxis: {
                autochange: true,
                height: 600,
                width: 1000,
                title: {text: 'OTU ID'}
                },
            };
    Plotly.newPlot('bubble', data1, bubbleLayout);

// 4. Display the sample metadata, i.e., an individual's demographic information.
// 5. Display each key-value pair from the metadata JSON object somewhere on the page.
//6. Update all of the plots any time that a new sample is selected.
// append ids to the dropdown

//BONUS: make gauge chart
        var meta = data.metadata;
        var data2 = [
            {domain: { x: [0, 1], y: [0, 1] },
            value: meta[bact_test].wfreq,
            title: { text: "Belly Button Washing Frequency: Scrubs Per Week" },
            type: "indicator",
            mode: "gauge+number",
                gauge: {
                axis: { range: [null, 9] },
                bar: { color: "darkblue" },
                steps: [
                        { range: [0, 2], color: "rgb(165,0,38)" },
                        { range: [2, 3], color: "rgba(110, 154, 22, .5)" },
                        { range: [3, 4], color: "rgba(170, 202, 42, .5)" },
                        { range: [4, 5], color: "rgba(202, 209, 95, .5)" },
                        { range: [5, 6], color: "rgba(210, 206, 145, .5)" },
                        { range: [6, 8], color: "rgba(232, 226, 202, .5)" },
                        { range: [8, 9], color: "rgba(255, 255, 255, 0)" }
                        ],
                threshold: {
                    line: {color: "red", width: 4},
                    thickness: 0.75,
                    value: 8.75
                }
                }
                }
            ];

        var layout = {width: 800, height: 500};
        
        Plotly.newPlot('gauge', data2, layout);
        
// display metadata info
var metadata = d3.select('#sample-metadata');

metadata.html('');

Object.entries(meta[bact_test]).forEach(function ([k, v]) {
    metadata.append('p').text(`${k.toUpperCase()}:\n${v}`);
            });
        })
}

// Submit Button handler and Select the input value from the form
function optionChanged(newId) {
    makePlot(newId)
};