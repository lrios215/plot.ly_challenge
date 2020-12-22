//Step 1: Plotly

//1. Use the D3 library to read in `samples.json`.
d3.json('samples.json').then((data)=>{
    var id=data.names;
    console.log(data.metadata);
    var select=d3.selectAll('#selDataset');
    Object.entries(id).forEach(([i,v])=>{
        select.append('option').text(v);
    })
})
//2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
        //* Use `sample_values` as the values for the bar chart.
        //* Use `otu_ids` as the labels for the bar chart.
        //* Use `otu_labels` as the hovertext for the chart.
function makePlot(testId){
    d3.json('samples.json').then((data)=>{
        // This is the array
        var samples=data.samples;
        var testNum=samples.map(row=>row.id).indexOf(testId);
        // Make bar plot
        var otuValueTen=samples.map(row=>row.sample_values);
        var otuValueTen=otuValueTen[testNum].slice(0,10).reverse();
        var otuIdTen=samples.map(row=>row.otu_ids);
        var otuIdTen=otuIdTen[testNum].slice(0,10);
        var otuLabelTen=samples.map(row=>row.otu_labels); 
        var otuLabelTen=otuLabelTen[testNum].slice(0,10); 
        var trace={
            x: otuValueTen,
            y: otuIdTen.map(r=>`UTO ${r}`),
            text: otuLabelTen,
            type:'bar',
            orientation:'h'
        }
        Plotly.newPlot('bar',[trace]);

//3. Create a bubble chart that displays each sample.
        // * Use `otu_ids` for the x values.
        // * Use `sample_values` for the y values.
        // * Use `sample_values` for the marker size.
        // * Use `otu_ids` for the marker colors.
        // * Use `otu_labels` for the text values.
        var otuValue=samples.map(row=>row.sample_values);
        var otuValue=otuValue[testNum];
        var otuId=samples.map(row=>row.otu_ids);
        var otuId=otuId[testNum];
        var otuLabel=samples.map(row=>row.otu_labels); 
        var otuLabel=otuLabel[testNum];
        var minIds=d3.min(otuId);
        var maxIds=d3.max(otuId);
        var mapNr = d3.scaleLinear().domain([minIds, maxIds]).range([0, 1]);
        var bubbleColors = otuId.map( val => d3.interpolateRgbBasis(["royalblue", "greenyellow", "goldenrod"])(mapNr(val)));
        var trace1={
            x: otuId,
            y: otuValue,
            text: otuLabel,
            mode: 'markers',
            marker: {
                color: bubbleColors,
                size: otuValue.map(x=>x*10),
                sizemode: 'area'
            }
        };
        var data1=[trace1];
        var bubbleLayout={
            xaxis:{
                autochange: true,
                height: 600,
                width: 1000,
                title: {
                    text: 'OTU ID'
                }
            },
        };
        Plotly.newPlot('bubble',data1,bubbleLayout); 

// 4. Display the sample metadata, i.e., an individual's demographic information.
// 5. Display each key-value pair from the metadata JSON object somewhere on the page.
//6. Update all of the plots any time that a new sample is selected.
// append ids to the dropdown
  //BONUS: make gauge chart
        var meta=data.metadata;
        var data2 = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: meta[testNum].wfreq,
                title: { text: "Washing frequency" },
                type: "indicator",
                mode: "gauge+number",
                gauge: { axis: { range: [null, 9] },
                bar:{color: 'orange'},
                   steps: [
                    { range: [0, 2], color: "rgba(14, 127, 0, .5)" },
                    { range: [2, 3], color: "rgba(110, 154, 22, .5)" },
                    { range: [3, 4], color: "rgba(170, 202, 42, .5)" },
                    { range: [4, 5], color: "rgba(202, 209, 95, .5)" },
                    { range: [5, 6], color: "rgba(210, 206, 145, .5)" },
                    { range: [6, 8], color: "rgba(232, 226, 202, .5)" },
                    { range: [8, 9], color: "rgba(255, 255, 255, 0)" }
                  ]}
            }
        ];
        
        var gaugeLayout = { width: 600, height: 500};
        Plotly.newPlot('gauge', data2, gaugeLayout);
        // display meta info
        var metadata=d3.select('#sample-metadata');
        metadata.html('');
        Object.entries(meta[testNum]).forEach(([k,v])=>{
            metadata.append('p').text(`${k.toUpperCase()}:\n${v}`);
        })
    })
}

// Submit Button handler
function optionChanged(newId) {
    // Select the input value from the form
    makePlot(newId);
}