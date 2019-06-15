// plot histogram with charts.js
function plot_histogram(data) {
  var bins = [];
  var labels = [];
  var similarities = [];

  // extract similarity_ratio from data
  data.forEach(item => similarities.push(item.similarity_ratio));

  // bin similarity_ratio's for histogram plot
  for (var i = 0.5; i < 1; i += 0.01) {
    var number = similarities.filter(item => item < i && item > i - 0.01);
    bins.push(number.length);
    labels.push(Math.round(i * 100) / 100);
  }

  // get canvas
  var ctx = document.getElementById("myChart");

  // plot histogram
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "similarity distribution",
          data: bins,
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
}

// visualizing radar input image with p5.js
function visualize_radar(radar) {
  startSketch();

  function startSketch() {
    var sketch = function(p) {
      p.setup = function() {
        var canvas = p.createCanvas(800, 400);
        canvas.parent("sketch-div");
      };

      p.draw = function() {
        p.background("PapayaWhip");

        const n_rows = radar.length;
        const n_cols = radar[0].length;
        const width = p.width / n_cols; // width of each rectange
        const height = p.height / n_rows; // height of each rectangle

        for (let i = 0; i < n_rows; i++) {
          for (let j = 0; j < n_cols; j++) {
            var rows = i * height;
            var cols = j * width;

            p.stroke("white");

            // now find out the exact size o each pixel
            // we have the width of the canvas: p.width
            // we have the number of rectangles

            if (radar[i][j] == 0) {
              p.fill("PapayaWhip");
            } else if (radar[i][j] == 0.5) {
              p.fill("Bisque");
            } else if (radar[i][j] == 1.5) {
              p.fill("DarkMagenta ");
            } else {
              p.fill("palevioletred");
            }
            // draw rectangle with  (x position, y position, width, height)
            p.rect(cols, rows, width, height);
          }
        }
      };
    };
    var myp5 = new p5(sketch);
  }
}
