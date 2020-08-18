// data source
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// 11 colors for heat map index 5 is base color lower index is warmer higher colder, range: +/- 5 degrees
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

// canvas size
const w = 1200;
const h = 600;
const padding = 65;

// fetch data
d3.json(url)
  .then(function (data) {
    // set month value to correct value
    data.monthlyVariance.forEach(function (val) {
      val.month -= 1;
    });

    // transform data to useable array for use d3.min/max
    const baseTemperature = data.baseTemperature;
    const dataSet = data.monthlyVariance;

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
      .text("Monthly Global Land-Surface Deviation from Mean Temperature")
      .style("text-align", "center");
    heading
      .append("p")
      .attr("id", "description")
      .style("background-color", colors[5])
      .text(
        `Mean temperature over the years ${dataSet[0].year} - ${
          dataSet[dataSet.length - 1].year
        } is ${baseTemperature}°C`
      )
      .style("text-align", "center");

    // inject chart-container
    const chartcontainer = main.append("div").attr("class", "chart-container");

    // define div for tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

    // define canvas
    const svg = d3
      .select(".chart-container")
      .append("svg")
      .attr("height", h)
      .attr("width", w);

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
      .scaleBand()
      .domain([
        new Date(0, 0),
        new Date(0, 1),
        new Date(0, 2),
        new Date(0, 3),
        new Date(0, 4),
        new Date(0, 5),
        new Date(0, 6),
        new Date(0, 7),
        new Date(0, 8),
        new Date(0, 9),
        new Date(0, 10),
        new Date(0, 11),
      ])
      .range([h - padding, padding]);

    // define the x and y axis
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

    // draw x and y axis
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

    // draw bars and tooltip
    const barwidth = (w - 2 * padding) / Math.ceil(dataSet.length / 12);

    svg
      .selectAll("rect")
      .data(dataSet)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("data-month", (d) => d.month)
      .attr("data-year", (d) => d.year)
      .attr("data-temp", (d) => baseTemperature + d.variance)
      .attr("variance", (d) => d.variance)
      .attr("x", (d) => xScale(new Date(d.year)))
      .attr("y", (d) => yScale(new Date(0, d.month)))
      .attr("width", barwidth)
      .attr("height", (h - 2 * padding) / 12)
      .style("fill", (d) => {
        if (d.variance < -4.5) {
          return colors[10];
        }
        if (-4.5 <= d.variance && d.variance < -3.5) {
          return colors[9];
        }
        if (-3.5 <= d.variance && d.variance < -2.5) {
          return colors[8];
        }
        if (-2.5 <= d.variance && d.variance < -1.5) {
          return colors[7];
        }
        if (-1.5 <= d.variance && d.variance < -0.5) {
          return colors[6];
        }
        if (-0.5 <= d.variance && d.variance < 0.5) {
          return colors[5]; // base temperature
        }
        if (0.5 <= d.variance && d.variance < 1.5) {
          return colors[4];
        }
        if (1.5 <= d.variance && d.variance < 2.5) {
          // console.log(d.variance);
          return colors[3];
        }
        if (2.5 <= d.variance && d.variance < 3.5) {
          // console.log(d.variance);
          return colors[2];
        }
        if (3.5 <= d.variance && d.variance < 4.5) {
          // console.log(d.variance);
          return colors[1];
        }
        if (4.5 <= d.variance) {
          // console.log(d.variance);
          return colors[0];
        }
      });
  })
  .catch(function (error) {
    console.log("Error, unable to fetch data!");
    throw error;
  });
