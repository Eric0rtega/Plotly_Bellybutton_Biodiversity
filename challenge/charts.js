function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  console.log(sample)
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data)
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log(samples)
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samples = samples.filter(sampleObj => sampleObj.id == sample);
    console.log(samples)
    //  5. Create a variable that holds the first sample in the array.
    var samples = samples[0];
    console.log(samples)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = samples.otu_ids;
    console.log(otuIds)

    var otuLabels = samples.otu_labels;
    console.log(otuLabels)

    var sampleValues = samples.sample_values;
    console.log(sampleValues)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuIds.slice(0,10).reverse();
    console.log(yticks)

    var xvalues = sampleValues.slice(0,10).reverse();
    console.log(xvalues)

    // var hoverText = otuLabels.slice(0,10).reverse();
    // console.log(hoverText)

    var ystrings = yticks.map(yticks => "OTU " + yticks.toString() + "  ");
    console.log(ystrings)
    // 8. Create the trace for the bar chart. 
    var trace = {
      x: xvalues,
      y: ystrings,
      type: 'bar',
      orientation: 'h'
    };

    var barData = [trace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
     xaxis: { title: "Sample Values" }
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var trace2 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      hovermode: 'closest',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'YlGnBu'
      }
    };

    var bubbleData = [trace2];

  // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "" }
    };

  // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        // 3. Create a variable that holds the samples array. 
        var metadata = data.metadata;
        console.log(metadata);
        // 4. Create a variable that filters the samples for the object with the desired sample number.
        var metadata = metadata.filter(sampleObj => sampleObj.id == sample);
        console.log(metadata);
        //  5. Create a variable that holds the first sample in the array.
        var metadata = metadata[0];
        console.log(metadata);

        var metadataFloat = parseFloat(metadata.wfreq) * 1.0;
        console.log(metadataFloat);
        
        var gaugeData = [
          {
            type: "indicator",
            mode: "gauge+number",
            value: metadataFloat,
            //title: { code: <h3>Belly Button Washing Frequency</h3> },
            gauge: {
              axis: { range: [null, 10], tickwidth: 2, tickcolor: "black" },
              bar: { color: "black" },
              bgcolor: "white",
              borderwidth: 2,
              bordercolor: "black",
              steps: [
                { range: [0, 2], color: 'red' },
                { range: [2, 4], color: 'orange' },
                { range: [4, 6], color: 'yellow' },
                { range: [6, 8], color: 'yellowgreen' },
                { range: [8, 10], color: 'darkgreen' }
              ]
            }
          }
        ];

        //var gaugeData = [trace3];
        
        var gaugeLayout = {
          width: 400,
          height: 400,
          margin: { t: 0, r: 30, l: 30, b: 0 },
          paper_bgcolor: "white"
        };
        
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
};