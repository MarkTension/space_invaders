//
// this script scans the provided radar.txt for invaders.txt
// 1. wait for click to start
// 2. pre-process invaders & radar
// 3. create class instance for each invader shape
// 4. crawl radar with each invader

$(document).ready(function() {
  // 1. start script on button press
  document
    .getElementById("start_button")
    .addEventListener("click", start_script);

  function start_script() {
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
      invaders = separate(invaders); // unpack into array with parse
      // put each invader into a separate matrix
      invaders = math.matrix(invaders[0]); // TODO: implement for other invader as well
      // put radar in matrix format
      radar = radar.filter(item => item.length > 0); // filter out empty arrays
      radar = math.matrix(radar);

      // make crawler instance for first invader
      var one = new Crawler(invaders, radar);
      // crawl over radar
      one.crawl();
    }
  }

  // 2. separate invaders
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

  // 2. class decleration for crawlers
  class Crawler {
    constructor(invader, radar) {
      this.inv = invader;
      this.inv_rows = invader.size()[0];
      this.inv_columns = invader.size()[1];
      this.radar = radar;
      this.radar_rows = radar.size()[0];
      this.radar_cols = radar.size()[1];
      this.column = 0;
      this.row = 0;
      this.similarities = [];
    }

    crawl() {
      // get relevant arrays from radar
      // make relevant subset of radar
      var inv_subset = math.subset(
        this.radar,
        math.index(
          math.range(this.row, this.row + this.inv_rows),
          math.range(this.column, this.column + this.inv_columns)
        )
      );

      // compare with original
      this.compare(inv_subset);
      // check how to step
      this.step();
    }

    step() {
      // check if new column, row or finished      TODO: make work for edge cases
      // column
      if (this.column + this.inv_columns < this.radar_cols) {
        //
        this.column++;
        this.crawl();
      } else if (this.row + this.inv_rows < this.radar_rows) {
        this.column = 0;
        this.row++;
        this.crawl();
      } else {
        //end
        console.log("ended");
        // if no more steps, plot histogram
        console.log(this.similarities);
        this.plot_histogram(this.similarities);
      }
    }

    plot_histogram(data) {
      var data2 = [];
      var labels = [];

      // bin data for histogram plot
      for (var i = 0.5; i < 1; i += 0.01) {
        var number = data.filter(item => item < i && item > i - 0.01);
        data2.push(number.length);
        labels.push(Math.round(i * 100) / 100);
      }
      // get the data
      var ctx = document.getElementById("myChart");

      var myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "similarity distribution",
              data: data2,
              borderWidth: 2,
              backgroundColor: "rgba(255,239,213 ,1 )"
            }
          ]
        },
        options: {
          responsive: false,
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "frequency"
                }
              }
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "similarity ratio (matching pixels/n_pixels)"
                }
              }
            ]
          }
        }
      });

      console.log("done");
    }

    compare(inv_subset) {
      var difference = math.subtract(inv_subset, this.inv);
      //flatten and take array
      difference = math.flatten(difference)["_data"];
      // reduce to sum
      difference = math.abs(difference.reduce((a, b) => a + b, 0));

      var similarity_ratio =
        1 - difference / (inv_subset.size()[0] * inv_subset.size()[1]);
      // save indices and similarity value as reference

      this.similarities.push(similarity_ratio); //TODO: figure out statistical test
    }
  }
});
