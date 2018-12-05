(function() {
  var margin = {top: 20, right: 20, bottom: 130, left: 40}
  var width = 600 - margin.left - margin.right
  var height = 300 - margin.top - margin.bottom

  var xPositionScale = d3.scaleBand().range([0, width]).padding(0.2)
  var yPositionScale = d3.scaleLinear().domain([0, 150]).range([height, 0])
  var colorScale = d3.scaleOrdinal().range(['#C10005','#EF7C23','#F9AE2E','#D4CD7F'])

  var svg = d3.select("#chart-not-grouped-circles")
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
      .attr('opacity', 0.2)

    var columns = 10
    var padding = 0.1
    var boxSize = xPositionScale.bandwidth() / columns

    // Create some 'fake' data
    // 11 % 10 => 1
    // 10 % 10 => 0
    // 15 % 10 => 5
    // 501 % 2 => 1
    var boxes = []

    datapoints.forEach(d => {
      var points = d3.range(d.megawatts).map(i => {
        return {
          index: i,
          category: d.source,
          row: Math.floor(i / columns),
          col: i % columns
        }
      })

      boxes = boxes.concat(points)
    })
    console.log(boxes)

    var radius = boxSize * (1 - padding) / 2
    // We now have 284 rectangles on the page
    // one for each 'fake' data point
    svg.append('g')
      .selectAll('.element')
      .data(boxes)
      .enter().append('circle')
      .attr('class', 'element')
      .attr('fill', d => colorScale(d.category))
      .attr('cx', d => Math.random() * width)
      .attr('cy', d => Math.random() * height)
      .attr('r', 0)
      .transition()
      .duration(d => Math.random() * 3000 + 500)
      .ease(d3.easeElastic)
      .attr('r', radius)
      .attr('cx', d => {
        // if boxSize is 10:
        // d.index 0 -> 0 pixels
        // d.index 1 -> 10 pixels
        // d.index 2 -> 20 pixels
        var offset = xPositionScale(d.category)
        return boxSize * d.col + offset + radius
      })
      .attr('cy', d => {
        return height - boxSize * d.row - radius
      })

    setTimeout(() => {
      svg.selectAll('.element')
        .transition()
        .duration(d => Math.random() * 1000)
        .attr('r', 0)
        .attr('cx', d => Math.random() * width)
        .attr('cy', d => Math.random() * height)
    }, 5000)

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