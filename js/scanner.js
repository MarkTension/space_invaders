//
// this script scans the provided radar.txt for invaders.txt
// 1. wait for click to start
// 2. pre-process invaders
// 3. create class instance for each invader shape
// 4. crawl radar with each invader

$(document).ready(function() {
  // 1. start script on button press
  document
    .getElementById("start_button")
    .addEventListener("click", start_script);

  function start_script() {
    let invaders = localStorage.getItem("invaders");
    let radar = localStorage.getItem("radar");
    if (invaders == null || radar == null) {
      alert("choose files first");
    } else {
      // main script starts here
      let invaders_ready = separate(JSON.parse(invaders)); // unpack into array with parse
      // start crawlingss

      var one = new Crawler(
        invaders_ready[0],
        JSON.parse(localStorage.getItem("radar"))
      );
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
      if (invaders[i] != "") {
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
      this.inv_h = invader.length;
      this.radar = radar;
      this.x = 0;
      this.y = 0;
    }

    crawl() {
      // get relevant arrays from radar

      this.radar;
      debugger;
      // make slice
      let y_slice = this.radar.slice(this.y, this.inv_h);
      let xy_slice = y_slice.forEach(item => item.slice);

      compare(slice);
      this.x++;

      return 2;
    }

    compare() {
      // quantifies difference between invader prototype and actual value

      return 2;
    }

    // compare invaders
    // statistical test

    // crawl

    // make instance for each invader

    // plot curve
  }
});
