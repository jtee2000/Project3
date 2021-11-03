// SVG setup
let globalData;
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom

var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1)

var y = d3.scaleLinear()
          .range([height, 0])

        
var svg = d3.select(".graph-container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

var svg3 = d3.select(".gender-container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
// Axis 
svg.append('g')
  .attr('class', 'axis x-axis')
  .attr("transform", "translate(0," + height + ")");

svg.append('g')
  .attr('class', 'axis y-axis');

svg3.append('g')
  .attr('class', 'axis x-axis')
  .attr("transform", "translate(0," + height + ")");

svg3.append('g')
  .attr('class', 'axis y-axis');

// Variables
var counties = ['LITCHFIELD', 'HARTFORD', 'TOLLAND', 'WINDHAM', 'FAIRFIELD', 'NEW HAVEN', 'MIDDLESEX', 'NEW LONDON']
var drugs = ['Heroin', 'Cocaine', 'Fentanyl', 'Oxycodone', 'Ethanol', 'Hydrocodone', 'Benzodiazepine', 'Methadone', 'Amphet', 'AnyOpioid']
var gender = ['Male', 'Female']

function updateData(data, selection) {
  var drugData = []
  if (selection == 'All') {
    drugs.map((type, i) => {
      let ct = 0
      data.map( item => {
          if (item[type] === 1) {
            ct += 1
          }
      })
      drugData.push({'drugType': type, 'ct': ct})
    })
  } else {
    drugs.map((type, i) => {
      let ct = 0
      data.filter(item => item.ResidenceCounty === selection).map( item => {
          if (item[type] === 1) {
            ct += 1
          }
      })
      drugData.push({'drugType': type, 'ct': ct})
    })
  }
  
  x.domain(drugData.map(item => item.drugType))
  y.domain([0, d3.max(drugData, (d) => d.ct)])

  const bars = svg.selectAll(".bar")
      .remove()
      .exit()
      .data(drugData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("y", height)
      .attr("x", (d) => x(d.drugType))
      .attr("height", 0)
      .attr("width", x.bandwidth())
      
      bars
      .merge(bars)
      .transition()
      .delay((_,i) => i*100)
      .duration(1000)
      .attr("y", (d) => y(d.ct))
      .attr("x", (d) => x(d.drugType))
      .attr("height", (d) => height - y(d.ct))

      bars.
      on("mouseover", function(_, d) {
      //Get this bar's x/y values, then augment for the tooltip
      let xPosition =
        margin.left -
        width / 10 +
        parseFloat(d3.select(this).attr("x")) +
        x.bandwidth() / 2;
      let yPosition =
        margin.top + parseFloat(d3.select(this).attr("y")) / 10 + height;

      //Update the tooltip position and value
      d3.select("#tooltip")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px")
        .select("#value")
        .text(d.ct);

      //Show the tooltip
      d3.select("#tooltip").classed("hidden", false);
    })
    .on("mouseout", function(d) {
      //Hide the tooltip
      d3.select("#tooltip").classed("hidden", true);
    });

    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y)

    svg.select('.x-axis')
        .transition()
        .duration(1000)
        .call(xAxis)
    svg.select('.y-axis')
        .transition()
        .duration(1000)
        .call(yAxis)
}

function updateDataGender(data, selection) {
  var genderData = []
  if (selection == 'All') {
    gender.map((type) => {
      let ct = 0
      data.map( item => {
          if (item.Sex === type) {
            ct += 1
          }
      })
      genderData.push({'gender': type, 'ct': ct})
    })
  } else {
    gender.map((type, i) => {
      let ct = 0
      data.filter(item => item.ResidenceCounty === selection).map( item => {
          if (item.Sex === type) {
            ct += 1
          }
      })
      genderData.push({'gender': type, 'ct': ct})
    })
  }
  x.domain(genderData.map(item => item.gender))
  y.domain([0, d3.max(genderData, (d) => d.ct)])

  const bars = svg3.selectAll(".bar")
      .remove()
      .exit()
      .data(genderData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("y", height)
      .attr("x", (d) => x(d.gender))
      .attr("height", 0)
      .attr("width", x.bandwidth())
      
      bars
      .merge(bars)
      .transition()
      .delay((_,i) => i*100)
      .duration(1000)
      .attr("y", (d) => y(d.ct))
      .attr("x", (d) => x(d.gender))
      .attr("height", (d) => height - y(d.ct))

      bars.
      on("mouseover", function(_, d) {
      //Get this bar's x/y values, then augment for the tooltip
      let xPosition =
        margin.left +
        width +
        parseFloat(d3.select(this).attr("x")) +
        x.bandwidth() / 2;
      let yPosition =
        margin.top + parseFloat(d3.select(this).attr("y")) / 10 + height;

      //Update the tooltip position and value
      d3.select("#tooltip2")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px")
        .select("#value")
        .text(d.ct);

      //Show the tooltip
      d3.select("#tooltip2").classed("hidden", false);
    })
    .on("mouseout", function(d) {
      //Hide the tooltip
      d3.select("#tooltip2").classed("hidden", true);
    });

    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y)

    svg3.select('.x-axis')
        .transition()
        .duration(1000)
        .call(xAxis)
    svg3.select('.y-axis')
        .transition()
        .duration(1000)
        .call(yAxis)
}
        
d3.csv("drug_deaths.csv", d3.autoType).then(data => {
  globalData = data
  updateData(data, 'All');
  updateDataGender(data, 'All');
});

d3.select('#group-by').on('change', ()=> {
    type = d3.select('#group-by').node().value;
    updateData(globalData, type);
    updateDataGender(globalData, type);
})