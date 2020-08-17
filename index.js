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
    // console.log(data);

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
  })
  .catch(function (error) {
    console.log("Error, unable to fetch data!");
    throw error;
  });
