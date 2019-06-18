// from the datastructure obtained with crawler,
// we'll process it here and visualize in a neat manner

function process_data(data, radar, iteration, ratio_boundary) {
  // first plot histogram for similarity ratios distribution (plot_figures.js)
  plot_histogram(data, "myChart" + iteration);

  var matches = [];
  // get highly likely invaders
  matches.push(data.filter(item => item.similarity_ratio >= ratio_boundary));
  // TODO: try with top 5 frames instead of arbitrary 70% similarity

  // change these values in the radar
  // get array with only the indexes
  var indexes = [];

  matches[0].forEach(item =>
    indexes.push([
      math.range(Math.max(item.row, 0), Math.max(item.row, 0) + item.dims[0]),
      math.range(
        Math.max(item.column, 0),
        Math.max(item.column, 0) + item.dims[1]
      )
    ])
  );

  // create two empty matrices
  // map with highlighted invaders
  var heatmap = math.zeros(radar.size()[0], radar.size()[1]);
  // map with highlighted invaders including noise
  var invader_map = math.zeros(radar.size()[0], radar.size()[1]);
  var highest = 0;

  // loop through invaders
  for (var i = 0; i < indexes.length; i++) {
    let item = indexes[i];

    // create ones matrix the size of relevant subset
    let ones = math.ones(item[0]._data.length, item[1]._data.length);

    // for heatmap, get current subset, and add ones to it
    let current_subset = heatmap.subset(math.index(item[0], item[1]));
    current_subset = math.add(current_subset, ones);

    // add subset to heatmap
    heatmap.subset(math.index(item[0], item[1]), current_subset);

    // for identifier map, add ones to it
    invader_map.subset(math.index(item[0], item[1]), ones);
  }

  // get heatmap maximum
  let maximum = math.max(heatmap);
  // normalize heatmap
  heatmap = math.divide(heatmap, maximum);
  // replace 1 with 0.5
  invader_map = math.multiply(invader_map, 10); // later will sort on > 10

  // add invaders to radar
  var scanned_radar = math.add(invader_map, radar);

  return {
    scanned_radar: scanned_radar,
    heatmap: heatmap,
    invader_map: invader_map
  };
}
