
// fetch('airports.json')
//   .then(response => response.json())
Promise.all([ // load multiple files
	d3.json('airports.json'),
	d3.json('world-110m.json')
])
  .then(data => {
      console.log(data)
      

      let margin = { top: 40, right: 20, bottom: 40, left: 90 },
      width =
        600 -
        margin.left -
        margin.right,
      height = 500 - margin.top - margin.bottom;
      
            width = width > 600 ? 600 : width;

  

let svg = d3.select(".chart").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
const features = topojson.feature(data[1], data[1].objects.countries).features;
const projection = d3.geoMercator()
    .fitExtent([[0,0], [width,height]], topojson.feature(data[1], data[1].objects.countries));

const path = d3.geoPath()
    .projection(projection);

svg.selectAll("path")
    .data(features)
    .join("path")
    .attr("d", path)
    .attr("fill", "black");
    
svg.append("path")
      .datum(topojson.mesh(data[1], data[1].objects.countries))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path);
var passengersList = []
      for (i = 0; i < data[0].nodes.length; i++) {
        passengersList.push(data[0].nodes[i].passengers);
      }

console.log(passengersList)

let circleScale = 
  d3
  .scaleLinear()
  .domain(d3.extent(passengersList))
  .range([4,9])

  let force = d3.forceSimulation(data[0].nodes)
  .force("charge", d3.forceManyBody().strength(-25))
  .force("link", d3.forceLink(data[0].links).distance(50))
  .force("center",d3.forceCenter()
      .x(width / 2)
      .y(height / 2)
  )

  drag = force => {

    function dragstarted(event) {
      if (!event.active) force.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event) {
      if (!event.active) force.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
  }

let links = svg.selectAll('.chart')
        .data(data[0].links)
        .enter()
        .append('line')
        .attr('x1', (d)=> (d.source.x))
        .attr('y1',(d) => (d.source.y))
        .attr('x2', (d) => (d.target.x))
        .attr('y2',(d) => (d.target.y))
        .attr('stroke', 'black')

let nodes = svg.selectAll('.chart')
        .data(data[0].nodes)
        .enter()
        .append('circle')
        .attr('cx', (d,i)=>(d.x))
        .attr('cy', (d,i)=>(d.y))
        .attr('fill', 'orange') 
        .attr('r',d=>circleScale(d.passengers))
        .call(drag(force));

force.on("tick", () => {
  links
      .attr("x1", d => (d.source.x))
      .attr("y1", d => (d.source.y))
      .attr("x2", d => (d.target.x))
      .attr("y2", d => (d.target.y));

  nodes
      .attr("cx", d => (d.x))
      .attr("cy", d => (d.y))
});



nodes.append("title")
    .text(d=>d.name);
    



        
    
      // for (var i = 0, n = nodes.length, node, k = alpha * 0.1; i < n; ++i) {
      //     node = nodes[i];
      //     node.vx -= node.x * k;
      //     node.vy -= node.y * k;
      //   }

  })