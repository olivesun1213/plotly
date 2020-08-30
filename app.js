// data plotting (bar & bubble)
function createPlot(id) {
  // getting data from the json file
  d3.json("data/samples.json").then((data)=> {
    
    //console.log(data)

      // filter sample values by id 
      var samples = data.samples.filter(samples => samples.id.toString() === id)[0];
      
      //console.log(samples); 
      
      // find top 10 samples
      var samplevalues = samples.sample_values.slice(0, 10).reverse();

      // extract OTU id from top 10 samples
      var OTU_top10 = (samples.otu_ids.slice(0, 10)).reverse();
      
      // add "OTU: to the id number
      var OTU_id = OTU_top10.map(id => "OTU " + id)

    //   console.log(`OTU IDS: ${OTU_id}`)

      // get the top 10 labels for the plot
      var labels = samples.otu_labels.slice(0, 10);

      // create trace variable for the plot
      var trace1 = {
          x: samplevalues,
          y: OTU_id,
          text: labels,
          type:"bar",
          orientation: "h",
      };

      // create data variable
      var data = [trace1];

      // create layout variable to set plots layout
      var layout = {
          title: "Top 10 OTUs",
          };

      // create the bar plot
      Plotly.newPlot("bar", data, layout);

      // The bubble chart
      //create trace variable for the plot
      var trace2 = {
          x: samples.otu_ids,
          y: samples.sample_values,
          mode: "markers",
          marker: {
              size: samples.sample_values,
              color: samples.otu_ids
          },
          text: samples.otu_labels

      };  
      // creating data variable 
      var data2 = [trace2];
      // set the layout for the bubble plot
      var layoutBubble = {
          xaxis:{title: "OTU ID"},
      };

    
      // create the bubble plot
      Plotly.newPlot("bubble", data2, layoutBubble); 
      
    });
  }   
// demographic info
function createInfo(id) {
  // getting data from json file
  d3.json("data/samples.json").then((data)=> {
      
      // get the metadata 
      var metadata = data.metadata;

      // filter metadata by id
      var filteredData = metadata.filter(meta => meta.id.toString() === id)[0];

      // select demographic panel from html
      var demographicInfo = d3.select("#sample-metadata");
      
      // empty the demographic info panel each time a new id is slected
      demographicInfo.html("");

      // grab demographic info when id is selected and append to demographic panel
      Object.entries(filteredData).forEach((key) => {   
              demographicInfo.append("h5").text(key[0] + ": " + key[1] + "\n");    
      });
  });
}



//  initial data rendering
function init() {
  // dropdown menu 
  var dropdown = d3.select("#selDataset");

  //getting data from the json file
  d3.json("data/samples.json").then((data)=> {
      //console.log(data)

      // get the id data to the dropdwown menu
      data.names.forEach(function(name) {
          dropdown.append("option").text(name).property("value");
      });

      // call the functions to display the data and the plots to the page
      createPlot(data.names[0]);
      createInfo(data.names[0]);
  });
}

init();

// update graphes when id is changed
function optionChanged(id) {
  createPlot(id);
  createInfo(id);
}