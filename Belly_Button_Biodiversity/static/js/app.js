function buildMetadata(sample) {
  var selector = d3.select('#sample-metadata');

  d3.json(`/metadata/${sample}`).then( data =>{
    selector.html("");
    console.log(Object.entries(data));
    Object.entries(data).forEach(([key,value]) =>{
      selector
        .append('p').text(`${key} : ${value}`)
        .append('hr')
    });
    })
}

function Charts(data) {
  console.log(data);
  var labels = data['otu_ids'].slice(0,10);
  var values = data['sample_values'].slice(0,10);

  var trace = [{
    values : values,
    labels : labels,
    type : "pie",
  }];

  var layout = {
      title: 'Belly Button Pie Chart',
  };

  Plotly.newPlot('pie', trace , layout);
  var x = data['otu_ids'];
  var y = data['sample_values'];
  var markersize = data['sample_values'];
  var markercolors = data['otu_ids'];
  
  var trace =[{
    x: x,
    y: y,
    mode: 'markers',
    marker: {
      size: markersize,
      color: markercolors,
    },
    
  }];
  
  var layout ={
    title:"Belly Button Bubble Chart",
    xaxis: {
      title: 'OTU ID',
    },
    yaxis: {
      title: 'Sample Value'
    },

  };
  
  Plotly.newPlot('bubble', trace, layout);
  }

function buildCharts(sample) {

  d3.json(`/samples/${sample}`).then( data =>{
    Charts(data);
  });
 
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
