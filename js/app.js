// color declarations
let GREEN_COLOR = "#00a693";
let GREY_1 = "#eee";

//adding some delay to the animation
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
// google charts
google.charts.load("current", {
  packages: ["geochart"],
  mapsApiKey: "AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY",
});
let geoData = {};
let geoKeys = [];
let totalCases2 = {};
let lineChartKeys = [];
let currentDate;
function loadMapFunc(geoData, geoKeys, delayTime) {
  google.charts.setOnLoadCallback(drawRegionsMap);
  async function drawRegionsMap() {
    var options = {
      colorAxis: {
        values: [0, 10000, 50000, 150000, 250000],
        colors: ["#e2eaef", "#678aa3", "#28506c", "#003152", "#022338"],
      },
      region: "US",
      resolution: "provinces",
    };

    var chart = new google.visualization.GeoChart(
      document.getElementById("regions_div")
    );
    for (let i = 0; i < geoKeys.length; i++) {
      chart.draw(
        google.visualization.arrayToDataTable(geoData[geoKeys[i]]),
        options
      );
      await delay(delayTime);
    }
  }
}

function loadChartFunc(pageLoad, rawData, lineChartKeys, delayTime) {
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);

  async function drawChart() {
    let data = new google.visualization.DataTable();
    data.addColumn("date", "Time");
    data.addColumn("number", "Active Cases");
    data.addColumn("number", "Deaths");
    data.addColumn("number", "Recoveries");
    let options = {
      pointSize: 0,
      colors: ["#19b5fe", "#f64747", "#00b894"],
      // title: "Progression with 2 weeks prediction (2020)",
      legend: { position: "top", alignment: "end" },
      titleTextStyle: {
        color: "#444",
        fontSize: 20,
      },
      chartArea: { left: 70, top: 50, width: "85%", height: "70%" },
      width: 900,
      height: 500,
      hAxis: {
        title: "Timeline",
        format: "MMM dd, YYYY",
        maxTextLines: 1,
        showTextEvery: 4,
        gridlines: { color: "#fff", count: 10, minSpacing: 20 },
      },

      vAxis: {
        title: "Cases",
        minValue: 0,
        gridlines: { count: 10 },
        viewWindowMode: "explicit",
        viewWindow: { min: 0 },
      },
      lineWidth: 3,
      curveType: "function",
      width: "95%",
    };

    let chart = new google.visualization.LineChart(
      document.getElementById("chart_div")
    );
    if (pageLoad) {
      data.addRows(rawData);
      chart.draw(data, options);
    } else {
      document.getElementsByClassName("total-cases-wrapper")[0].style.display =
        "inline-block";
      document.getElementsByClassName("active-cases-wrapper")[0].style.display =
        "inline-block";
      for (let i = 0; i < lineChartKeys.length; i++) {
        let activeCaseHTML = document.getElementById("active-cases");
        activeCaseHTML.innerHTML = totalCases2[lineChartKeys[i]][1];
        let deathsHTML = document.getElementById("deaths");
        deathsHTML.innerHTML = totalCases2[lineChartKeys[i]][2];
        let recoveriesHTML = document.getElementById("recoveries");
        recoveriesHTML.innerHTML = totalCases2[lineChartKeys[i]][3];
        if (lineChartKeys[i] <= currentDate) {
          document.getElementById("prediction-span").style.display = "none";
          let total =
            totalCases2[lineChartKeys[i]][1] +
            totalCases2[lineChartKeys[i]][2] +
            totalCases2[lineChartKeys[i]][3];
          let caseHTML = document.getElementById("total-cases");
          let dateHTML = document.getElementById("date");
          caseHTML.innerHTML = total;
          dateHTML.innerHTML =
            totalCases2[lineChartKeys[i]][0].getMonth() +
            1 +
            "/" +
            totalCases2[lineChartKeys[i]][0].getDate() +
            "/" +
            totalCases2[lineChartKeys[i]][0].getFullYear();
          if (total <= 10000) {
            caseHTML.style.color = "#00b894";
          } else if (total > 10000 && total <= 320000) {
            caseHTML.style.color = "#FF9800";
            caseHTML.innerHTML =
              total + " <i class = 'fa fa-exclamation-triangle '></i>";
          } else if (total > 320000) {
            caseHTML.style.color = "#F44336";
            caseHTML.innerHTML =
              total + " <i class = 'fa fa-exclamation-triangle '></i>";
          }
        } else {
          document.getElementById("prediction-span").style.display =
            "inline-block";
        }

        data.addRow(totalCases2[lineChartKeys[i]]);
        await delay(delayTime);
        chart.draw(data, options);
      }
    }
  }
}

function startSimulation() {
  let delayTime = 400;
  loadMapFunc(geoData, geoKeys, delayTime);
  loadChartFunc(false, totalCases2, lineChartKeys, delayTime);
}
async function preprocessData(data, data2) {
  let dataObj = {};
  currentDate = new Date(data[data.length - 1].date).getTime();
  data.forEach((elem) => {
    let date = new Date(elem.date);
    date = date.getTime();
    let cases = [elem.state, +elem.cases];
    if (date in dataObj) {
      dataObj[date].push(cases);
    } else {
      let arr = [];
      let heading = ["State", "Cases"];
      arr.push(heading);
      arr.push(cases);
      dataObj[date] = arr;
    }
  });
  geoKeys = Object.keys(dataObj).sort();
  geoData = dataObj;
  loadMapFunc(geoData, [geoKeys[geoKeys.length - 1]], 0);

  data2.forEach((elem) => {
    let date = new Date(elem.date);
    date = date.getTime();
    let deaths = +elem.deaths;
    let recovery = +elem.recovery;
    let activeCases = +elem.cases - deaths - recovery;
    totalCases2[date] = [new Date(+date), activeCases, deaths, recovery];
  });
  lineChartKeys = Object.keys(totalCases2).sort();
  loadChartFunc(true, Object.values(totalCases2), lineChartKeys, 0);
  await delay(2000);

  let fadeTarget = document.getElementById("overlay");
  fadeTarget.style.display = "none";
}

// loading raw data from CSV file
async function loadData() {
  let data1, data2;
  d3.csv("./data/covid_cases.csv", function (data) {
    data1 = data;
    d3.csv("./data/us2.csv", function (data) {
      data2 = data;
      preprocessData(data1, data2);
    });
  });
  // let data = await d3.csv("./data/covid_cases.csv");
  // let data2 = await d3.csv("./data/us2.csv");
  // console.log(data);
}

// calling the load data function
loadData();
simulationBtn = document.getElementsByClassName("simulation-btn")[0];
simulationBtn.addEventListener("click", startSimulation);
