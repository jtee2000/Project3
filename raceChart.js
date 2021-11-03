var width2 = 200;
var height2 = 200;

const svg2 = d3
.select(".race-chart")
.attr("width", 200)
.attr("height", 200)
.append("svg")
.attr("width", 500)
.attr("height", 500)
.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
.attr("viewBox", [-width2 / 2, -height2 / 2, width2, height2]); //move the coordinate system

var races = ['Asian', 'White', 'Hispanic', 'Black', 'Other']
var raceData = []

d3.csv("drug_deaths.csv", d3.autoType).then(data => {
  
  races.map((race) => {
      let ct = 0
      data.map( item => {
          if (item.Race) { 
            if (item.Race.includes(race)) {
                ct += 1
            }
          }
      })
      raceData.push({'race': race, 'ct': ct})
  })
  console.log(raceData)


  const size = d3
    .scaleLinear()
    .domain(d3.extent(raceData, d => d.ct))
    .range([7, 50]);

  raceData.forEach(d => {
    d.r = size(d.ct);
  });
  console.log(raceData)
  let za = [];
  for (let i = 0; i < raceData.length; i++) {
    if (za.includes(raceData[i].ct)) {
    } else {
      za.push(raceData[i].ct);
    }
  }
  const color = d3
    .scaleOrdinal()
    .domain(za)
    .range(d3.schemeTableau10);
  const sim = d3
    .forceSimulation(raceData)
    .force("charge", d3.forceManyBody().strength(2))
    .force("center", d3.forceCenter())
    .on("tick", ticked)
    .force(
      "collide",
      d3.forceCollide().radius(function(d) {
        return d.r;
      })
    );

  // create drag interaction
  function drag(force) {
    function dragstarted(event) {
      if (!event.active) force.alphaTarget(2).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) force.alphaTarget(3);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  // create nodes
  const nodes = svg2
    .selectAll("circle")
    .data(raceData)
    .join("circle")
    .attr("fill", za => color(za))
    .attr("stroke", "black")
    .attr("r", d => d.r)
    .call(drag(sim));

  nodes.append("title")
    .text(d => `${d.race}: ${d.ct}`)
    .attr("class", "race-label")
    // add labels

  //nodes.call(drag); // apply the drag force

  function ticked() {
    nodes.attr("cx", d => d.x).attr("cy", d => d.y);
  }
});
