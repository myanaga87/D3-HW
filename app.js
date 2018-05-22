d3.select(window).on("resize", handleResize);

loadChart();

function handleResize() {
  var svgArea = d3.select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
    loadChart();
  }
}

function loadChart() {
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var svg = d3.select(".chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // import csv data
    d3.csv("./data/data.csv", function (error, drinkData) {
        if(error) console.warn(error);

        drinkData.forEach(function (data) {
            data.medianIncome = +data.medianIncome;
            data.bingePercentage = +data.bingePercentage;
            // console.log(data.medianIncome);
            // console.log(data.bingePercentage);
            console.log(data.abbr);
        });

        var xScale = d3.scaleLinear()
            .domain(d3.extent(drinkData, d => d.medianIncome))
            .range([0, width]);

        var yScale = d3.scaleLinear()
            .domain(d3.extent(drinkData, d => d.bingePercentage))
            .range([height, 0]);
        
        var bottomAxis = d3.axisBottom(xScale);
        var leftAxis = d3.axisLeft(yScale);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

        var circlesGroup = chartGroup.selectAll("circle")
            .data(drinkData)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.medianIncome))
            .attr("cy", d => yScale(d.bingePercentage))
            .attr("r", "15")
            .attr("fill", "mediumspringgreen")
            .attr("opacity", ".75");

        var text = chartGroup.selectAll("p")
            .data(drinkData)
            .enter()
            .append("text")
            .attr("x", d => xScale(d.medianIncome))
            .attr("y", d => yScale(d.bingePercentage))
            .attr("dx", "-.5em")
            .attr("dy", ".5em")
            .attr("fill", "black")
            .attr("font-size", "10px")
            .text(function(d) {return d.abbr});
        console.log(text);
        
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 1.5))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Percent of Binge Drinkers");

        chartGroup.append("text")
            .attr("transform", `translate(${width/2.4}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Median Income (in 2014)");
    });
};