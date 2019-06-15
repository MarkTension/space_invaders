// from the datastructure obtained with crawler,
// we'll process it here and visualize in a neat manner

function process_data(data, radar) {
  console.log("processing data");

  // first plot histogram with plot_figures.js
  plot_histogram(data);

  var similarities = [];
  // get high likely invaders
  matches = data.filter(item => item.similarity_ratio > 0.8);

  // change these values in the radar

  // get array with only the indexes
  var indexes = [];
  // matches.forEach(item => indexes.push({ row: item.row, column: item.column }));
  matches.forEach(item =>
    indexes.push([
      math.range(item.row, item.row + 5),
      math.range(item.column, item.column + 5)
    ])
  );

  // create empty marked invader matrix
  var radar_inv = math.zeros(radar.size()[0], radar.size()[1]);

  // loop through invaders
  for (var i = 0; i < indexes.length; i++) {
    let item = indexes[i];
    // create mark
    let ones = math.ones(item[0]._data.length, item[1]._data.length);

    // apply mark
    radar_inv.subset(math.index(item[0], item[1]), ones);
  }

  // replace 1 with 0.5
  radar_inv = math.multiply(radar_inv, 0.5);

  // add invaders to radar
  var scanned_radar = math.add(radar_inv, radar);

  // visualize radar with p5 //
  visualize_radar(scanned_radar._data);
}
