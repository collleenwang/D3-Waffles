(function() {
  var margin = {top: 20, right: 20, bottom: 130, left: 40}
  var width = 600 - margin.left - margin.right
  var height = 300 - margin.top - margin.bottom

  var xPositionScale = d3.scaleBand().range([0, width]).padding(0.2)
  var yPositionScale = d3.scaleLinear().domain([0, 150]).range([height, 0])
  var colorScale = d3.scaleOrdinal().range(['#C10005','#EF7C23','#F9AE2E','#D4CD7F'])

  var svg = d3.select("#chart-grouped")
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  d3.csv("data.csv")
    .then(ready)

  function ready(datapoints) {

    var categories = datapoints.map(function(d) { return d.source })
    xPositionScale.domain(categories)
    
    svg.append('g')
      .attr('class', 'bars')
      .selectAll(".bar")
      .data(datapoints)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xPositionScale(d.source))
      .attr("y", d => yPositionScale(d.megawatts))
      .attr("width", xPositionScale.bandwidth())
      .attr("height", d => height - yPositionScale(d.megawatts))
      .attr("fill", d => colorScale(d.source))
      .attr('opacity', 0)
    // Create some fake data
    // var groupedData = datapoints.map(d => {
    //   var points = d3.range(d.megawatts).map(i => {
    //     return {
    //       index: i,
    //       category: d.source
    //     }
    //   })
    //   return points
    // })

    // var columns = 10
    // var padding = 0.1




    var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis axis-x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

    var yAxis = d3.axisLeft(yPositionScale)
    svg.append("g")
      .attr("class", "axis axis-y")
      .call(yAxis)
  }

})()