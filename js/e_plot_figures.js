// plot histogram with charts.js
function plot_histogram(data, canvas) {
  var bins = [];
  var labels = [];
  var similarities = [];
  backgrounds = [];

  // extract similarity_ratio from data
  data.forEach(item => similarities.push(item.similarity_ratio));
  // bin similarity_ratio's for histogram plot
  for (var i = 0.5; i < 1; i += 0.01) {
    // create bins of 0.01 (similarity) width
    var number = similarities.filter(item => item < i && item > i - 0.01);
    bins.push(number.length);
    // round labels
    labels.push(Math.round(i * 100) / 100);
    if (i >= 0.7) {
      backgrounds.push("rgba(219,112,147 ,1 )");
    } else {
      backgrounds.push("rgba(255,239,213 ,1 )");
    }
  }

  // get canvas
  var ctx = document.getElementById(canvas);

  // plot histogram
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "histogram: distribution of similarity ratios",
          data: bins,
          borderWidth: 2,
          backgroundColor: backgrounds
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
function plot_heatmap(data0, data1) {
  startSketch();

  function startSketch() {
    var sketch = function(p) {
      p.setup = function() {
        var canvas = p.createCanvas(800, 400);
        canvas.parent("sketch-div");
      };

      p.draw = function() {
        p.background("PapayaWhip");

        const n_rows = data0.length;
        const n_cols = data0[0].length;
        const width = p.width / n_cols; // width of each rectange
        const height = p.height / n_rows; // height of each rectangle

        for (let i = 0; i < n_rows; i++) {
          for (let j = 0; j < n_cols; j++) {
            var rows = i * height;
            var cols = j * width;

            p.stroke("white");

            if (data0[i][j] != 0 && data1[i][j] == 0) {
              p.fill("rgba(219,112,147, " + data0[i][j] + ")");
            } else if (data1[i][j] != 0 && data0[i][j] == 0) {
              p.fill("rgba(0,0,128, " + data1[i][j] + ")");
            } else {
              p.fill("rgba(100,50,140, " + data1[i][j] + ")");
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

function visualize_radar(radar, heatmap0, heatmap1, isolate) {
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

            // empty pixels: papayawhip
            if (radar[i][j] == 0) {
              p.fill("PapayaWhip");
            }
            // empty pixel in heatmap: papayawhip
            // else if (radar[i][j] > 0 && radar[i][j] < 10) {
            //   p.fill("PapayaWhip");
            // }

            // blank space in identified invader: papayawhip
            else if (radar[i][j] >= 10 && radar[i][j] % 10 == 0) {
              p.fill("papayawhip");
            }
            // identified invaders: color by heatmap
            else if (radar[i][j] >= 10 && radar[i][j] % 10 != 0) {
              // apply heatmap
              if (heatmap0[i][j] != 0 && heatmap1[i][j] == 0) {
                p.fill("rgba(219,112,147, " + heatmap0[i][j] + ")");
              } else if (heatmap1[i][j] != 0 && heatmap0[i][j] == 0) {
                p.fill("rgba(0,0,128, " + heatmap1[i][j] + ")");
              } else {
                p.fill("rgba(100,50,140, " + heatmap1[i][j] + ")");
              }
            }
            // if noise
            else {
              // if isolate, omit noise in radar
              if (isolate) {
                p.fill("papayawhip");
              } else {
                // palevioletred with low alpha
                p.fill("rgba(219,112,147,0.1)");
              }
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
