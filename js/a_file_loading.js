// file_loading.js
// loads txt files
// converts txt files into matrices
// stores matrices to filestore
//

// start script on load
$(document).ready(function() {
  // File APIs supported?
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
  } else {
    alert("The File APIs are not fully supported in this browser.");
  }

  // await file select
  document
    .getElementById("files")
    .addEventListener("change", handleFileSelect, false);

  // function saves the two inputs to local storage
  function handleFileSelect(evt) {
    // FileList object. Only one file though
    let files = evt.target.files;

    // loop files
    for (let i = 0; i < files.length; i++) {
      // create file reader for each file
      let reader = new FileReader();
      // get file name
      let name = files[i].name.substr(0, files[i].name.length - 4);
      // check if txt file
      if (files[i].type.match("text/plain")) {
        reader.readAsBinaryString(files[i]);
        reader.onload = function(event) {
          // split result on every newline(\n)

          // convert to numbers
          let splitted = event.target.result.split("\n");

          // for matrix usage
          for (let j = 0; j < splitted.length; j++) {
            // replace chars for numbers
            splitted[j] = splitted[j].replace(/o/gi, "1").replace(/-/gi, "0");
            // make array from string characters
            splitted[j] = splitted[j].split("");
            // cast strings-numbers to int
            splitted[j] = splitted[j].map(Number);
          }

          // save files in local storage
          if (name == "radar" || name == "invaders") {
            // stringify to unpack as array later;
            localStorage.setItem(name, JSON.stringify(splitted));
          } else {
            alert("Select radar.txt and invaders.txt");
          }
        };
      } else {
        alert(name + " is not a txt file");
      }
    }
  }
});
