// 2. class decleration for crawlers
class Crawler {
  constructor(invader, radar) {
    this.inv = invader;
    this.radar = radar;
    this.inv_rows = invader.size()[0]; // invader # columns
    this.inv_columns = invader.size()[1]; // invader # rows
    this.radar_rows = radar.size()[0]; // radar # rows
    this.radar_cols = radar.size()[1]; // radar # columns
    this.edge_min = 4; // defines the number of pixels taken in edge cases
    this.left_edge = 0 - (this.inv_columns - this.edge_min);
    this.right_edge = this.radar_cols - this.edge_min;
    this.top_edge = 0 - (this.inv_rows - this.edge_min);
    this.bottom_edge = this.radar_rows - this.edge_min;
    this.column = this.left_edge; // start column
    this.row = this.top_edge; // starting row
    this.results = []; // final array containing {similarity, size, row, column}
    this.finished = false; // tracks if code has finished
  }

  step() {
    // make relevant subset of radar
    var radar_subset = math.subset(
      this.radar,
      math.index(
        math.range(
          Math.max(0, this.row),
          Math.min(this.row + this.inv_rows, this.radar_rows)
        ),
        math.range(
          Math.max(0, this.column),
          Math.min(this.column + this.inv_columns, this.radar_cols)
        )
      )
    );

    // compare with original, and store in results array
    this.compare(radar_subset);

    // check if new column, row or finished
    if (this.column < this.right_edge - 1) {
      //
      this.column++;
      this.step();
    } else if (this.row < this.bottom_edge - 1) {
      this.column = this.left_edge;
      this.row++;
      this.step();
    } else {
      //end
      console.log("finished crawling");
    }

    // if finished, return results to main
    return this.results;
  }

  // compares subset with invader example
  compare(radar_subset) {
    var invader = this.inv;

    // trim invader if edge case
    invader = this.trim_inv(invader);

    // do mean (squared) error:
    var difference = math.subtract(radar_subset, invader);
    difference = math.square(difference);
    difference = math.flatten(difference)["_data"];
    difference = difference.reduce((a, b) => a + b, 0);

    // TODO: difference = math.square(difference);

    // divide by number of pixels
    var similarity_ratio =
      1 - difference / (radar_subset.size()[0] * radar_subset.size()[1]);

    // save indices and similarity value as reference
    var data_point = {
      similarity_ratio: similarity_ratio,
      size: radar_subset.size()[0] * radar_subset.size()[1],
      dims: radar_subset.size(),
      row: this.row,
      column: this.column
    };
    // add data-point to results
    this.results.push(data_point);
  }

  // trim invader example in edge cases
  // trickiest part of the code. simple concept, but awkward syntax
  trim_inv(invader) {
    var indexer = [];
    var remaining_cols = false;
    var col_correct = 0;

    // if cols is negative, delete left part
    if (this.column < 0) {
      remaining_cols = math.range(math.abs(this.column), this.inv_columns);
      indexer = math.index(
        math.range(0, this.inv_rows), // don't skip rows
        remaining_cols
      ); // skip left columns
      invader = math.subset(invader, indexer);
    }
    // if cols is bigger than radar.cols-invader.cols, delete right part
    if (this.column > this.radar_cols - this.inv_columns) {
      remaining_cols = math.range(0, this.radar_cols - this.column);

      indexer = math.index(
        math.range(0, this.inv_rows), // don't skip rows
        remaining_cols // skip right columns
      );
      invader = math.subset(invader, indexer);
    }
    // if rows is negative, delete top part
    if (this.row < 0) {
      if (remaining_cols) {
        col_correct = remaining_cols._data.length;
      } else {
        col_correct = this.inv_columns;
      }
      // if already made earlier
      // take previous indexer
      indexer = math.index(
        math.range(math.abs(this.row), this.inv_rows), // skip top rows
        math.range(0, col_correct) // don't skip columns
      );

      invader = math.subset(invader, indexer);
    }

    // if rows is bigger than radar.rows-invader.rows, delete bottom part
    if (this.row > this.radar_rows - this.inv_rows) {
      // if earlier index of columns, accounted for it here
      if (remaining_cols) {
        col_correct = remaining_cols._data.length;
      } else {
        col_correct = this.inv_columns;
      }

      indexer = math.index(
        math.range(0, this.radar_rows - this.row), // skip bottom rows
        math.range(0, col_correct) // don't skip columns
      );

      invader = math.subset(invader, indexer);
    }

    return invader;
  }
}
