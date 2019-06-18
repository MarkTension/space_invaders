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
      /////////////////// main script starts here ///////////////////////////////////

      // give each invader a separate array
      invaders = separate(invaders);
      radar = radar.filter(item => item.length > 0); // filter out empty arrays

      // check if two invaders
      if (invaders.length != 2) {
        alert("please provide invaders file that includes two invaders");
        throw "";
      }
      // check if invaders and radar are matrixable
      try {
        math.matrix(radar);
        invaders.forEach(inv => math.matrix(inv));
      } catch (err) {
        alert("input is not rectangular --> not matrixable ");
        throw "";
      }

      // put radar in matrix format
      radar = math.matrix(radar);

      // check if input radar is not too large --> might prevent maximum call stack size
      if (radar.size()[0] > 150 || radar.size()[1] > 100) {
        alert("maximum radar size is [150,100]");
        throw "";
      }

      // display results html
      document.getElementById("results").style.display = "block";

      // array for the results
      let results = []; // array for crawling results
      let data = [];
      const ratio_boundary = 0.7; // similarity ratio classification boundary

      let crawlers = [];
      for (var i = 0; i < invaders.length; i++) {
        // matrixify invader
        invader = math.matrix(invaders[i]);
        // make crawler instance for each invader
        let crawl = new Crawler(invader, radar);
        results = crawl.step();

        // after getting similarity scores, start processing them
        data.push(process_data(results, radar, i, ratio_boundary));
      }

      document.getElementById("summary").innerHTML =
        "Two invaders are compared to radar of size [" +
        radar.size() +
        "]. Invaders are recognized when matrix comparison yields a similarity ratio >" +
        ratio_boundary +
        " . See README for more details on the classification.  </br>Histograms below show distribution of similarity ratios. Pink bars are positively classified. <br>This is useful to adjust classification threshold for different invader examples. </br></br>  The three images below visualize invaders classified on the radar, with a navy color for one type, and pink for the other type. Purple color is applied when both classifiers recognize the same invader. A higher alpha of a color means it is classified with a higher confidence";

      // add two maps together, so both invaders are incorporated
      let scanned_radar = math.add(
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
    let separated = [[]];
    let idx = 0;

    // cycle through array
    for (let i = 0; i < invaders.length; i++) {
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
