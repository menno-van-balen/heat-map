// data source
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// 11 colors for heat map index 4 is base color lower index is warmer higher colder, range: +/- 5 degrees
const colors = [
  "#9e0142",
  "#d53e4f",
  "#f46d43",
  "#fdae61",
  "#fee08b",
  "#ffffbf",
  "#e6f598",
  "#abdda4",
  "#66c2a5",
  "#3288bd",
  "#5e4fa2",
];

// fetch data
d3.json(url)
  .then(function (data) {
    // inject main container
    const main = d3
      .select("body")
      .append("main")
      .attr("class", "main-container");

    // inject heading
    const heading = main.append("heading").attr("class", "heading");
    // add content to heading
    heading
      .append("h1")
      .attr("id", "title")
      .text("Monthly Global Land-Surface Temperature");
    heading
      .append("p")
      .attr("id", "description")
      .text(
        `Average temperature over the years ${data.monthlyVariance[0].year} - ${
          data.monthlyVariance[data.monthlyVariance.length - 1].year
        } is ${data.baseTemperature}°C`
      );

    // inject chart-container
    const chartcontainer = main.append("div").attr("class", "chart-container");

    // define div for tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

    // define canvas
    const w = 1000;
    const h = 600;
    const padding = 65;

    const svg = d3
      .select(".chart-container")
      .append("svg")
      .attr("height", h)
      .attr("width", w);

    const dataSet = data.monthlyVariance;

    // define x-scale
    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(dataSet, (d) => new Date(d.year)),
        d3.max(dataSet, (d) => new Date(d.year)),
      ])
      .range([padding, w - padding]);

    // define y-scale
    const yScale = d3
      .scaleTime()
      .domain([
        d3.min(dataSet, (d) => new Date(0, d.month - 1)),
        d3.max(dataSet, (d) => new Date(0, d.month - 1)),
      ])
      .range([h - padding, padding]);

    // define the y and x axis
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

    // draw y and x axis
    svg
      .append("g")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .attr("id", "x-axis")
      .call(xAxis.ticks(25));

    svg
      .append("g")
      .attr("transform", "translate(" + padding + ",0)")
      .attr("id", "y-axis")
      .call(yAxis);
  })
  .catch(function (error) {
    console.log("Error, unable to fetch data!");
    throw error;
  });
