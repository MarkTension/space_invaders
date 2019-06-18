// this script scans the provided radar.txt for invaders.txt
// 1. wait for click to start
// 2. pre-process invaders & radar
// 3. create class instance for each invader shape
// 3.1. crawl radar with each invader
// 3.2. compare
// 3.3. store in array
// 4. process data
// 5. plot figures

$(document).ready(function() {
  // 1. start script on button press
  document.getElementById("start_button").addEventListener("click", main);

  function main() {
    // load and parse input
    let invaders = JSON.parse(localStorage.getItem("invaders"));
    let radar = JSON.parse(localStorage.getItem("radar"));
    // check if input was present
    if (invaders == null || radar == null) {
      alert("choose files first");
    } else {
      // display results
      document.getElementById("results").style.display = "block";

      // main script starts here
      // put radar in matrix format
      radar = radar.filter(item => item.length > 0); // filter out empty arrays
      radar = math.matrix(radar);
      // give each invader a separate array
      invaders = separate(invaders);
      // array for the results
      var results = [];
      var data = [];
      const ratio_boundary = 0.7;

      var crawlers = [];
      for (var i = 0; i < invaders.length; i++) {
        // matrixify invader
        invader = math.matrix(invaders[i]);
        // make crawler instance for each invader
        var crawl = new Crawler(invader, radar);
        results = crawl.step();

        // after getting similarity scores, start processing them
        data.push(process_data(results, radar, i, ratio_boundary));
      }

      document.getElementById("summary").innerHTML =
        invaders.length +
        " invaders were loaded. These are compared to radar of size [" +
        radar.size() +
        "]. Invaders were positively classified when matrix comparison yielded a similarity ratio >" +
        ratio_boundary +
        ". The current boundary works well, but feel free to play with it in the code. See README for more details on the classification. Pink bars in histograms below show these cases. </br>  The three images visualize invaders classified on the radar, with a different color for invader type";

      // add two maps together, so both invaders are incorporated
      var scanned_radar = math.add(
        data[0].scanned_radar,
        data[1].scanned_radar
      );

      // plot heatmap with p5
      plot_heatmap(data[0].heatmap._data, data[1].heatmap._data);

      // plot radar with noise
      visualize_radar(
        scanned_radar._data,
        data[0].heatmap._data,
        data[1].heatmap._data,
        false
      );

      // plot radar without noise
      visualize_radar(
        scanned_radar._data,
        data[0].heatmap._data,
        data[1].heatmap._data,
        true
      );
    }
  }

  // separate invaders
  function separate(invaders) {
    // array for separated invaders
    var separated = [[]];
    var idx = 0;

    // cycle through array
    for (var i = 0; i < invaders.length; i++) {
      // load in separated-array until empty item
      if (invaders[i].length != 0) {
        separated[idx].push(invaders[i]);
      } else {
        // create new array for new invader
        separated.push([]);
        idx++;
      }
    }
    return separated.filter(item => item.length > 0); // remove empty array at the end
  }
});
