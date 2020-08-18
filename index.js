// data source
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// 11 colors for heat map index 5 is base color lower index is warmer higher colder, range: +/- 5 degrees
const colors = [
  "#a50026",
  "#d73027",
  "#f46d43",
  "#fdae61",
  "#fee090",
  "#ffffbf",
  "#e0f3f8",
  "#abd9e9",
  "#74add1",
  "#4575b4",
  "#313695",
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
      .style("opacity", 0.8)
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
      })
      .on("mouseover", function (d) {
        const formatMonth = d3.timeFormat("%B");
        const formatTemp = d3.format(".2f");
        tooltip.attr("data-year", d3.select(this).attr("data-year"));
        tooltip.transition().duration(200).style("opacity", 0.8);
        tooltip
          .html(
            d3.select(this).attr("data-year") +
              " - " +
              formatMonth(new Date(d3.select(this).attr("data-month"))) +
              " <br/> temperature: " +
              formatTemp(d3.select(this).attr("data-temp")) +
              "°C<br/> deviation: " +
              d3.select(this).attr("variance") +
              "°C"
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 75 + "px");
      })
      .on("mouseout", function (d) {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // legend
    const legend = d3.select("body").append("div").attr("id", "legend");

    // define canvas for legend
    const lh = 50;
    const lw = 400;
    const lpadding = 8;

    const svgLegend = d3
      .select("#legend")
      .append("svg")
      .attr("height", lh)
      .attr("width", lw);

    const tempDev = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

    const lxScale = d3
      .scaleLinear()
      .domain([-5, 5])
      .range([lpadding, lw - lpadding]);
    const linearScale = d3
      .scaleLinear()
      .domain(tempDev)
      .range(colors.reverse());

    const lxAxis = d3.axisBottom(lxScale);

    svgLegend
      .append("g")
      .attr("id", "lxAxis")
      .attr("transform", "translate(0, " + (lpadding + 3) + ")")
      .call(lxAxis);

    svgLegend
      .selectAll("circle")
      .data(tempDev)
      .enter()
      .append("circle")
      .attr("r", 6)
      .attr("cy", lpadding)
      .attr("cx", function (d) {
        return lxScale(d);
      })
      .style("fill", function (d) {
        return linearScale(d);
      });

    svgLegend
      .append("text")
      .text("deviation in °C")
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + lw / 2 + ", " + (lh - lpadding) + ")");
  })
  .catch(function (error) {
    console.log("Error, unable to fetch data!");
    throw error;
  });
