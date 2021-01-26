import React from 'react'
import { Experiment, jsPsych } from 'jspsych-react'
import { tl } from './timelines/main'
// import { MTURK, breathingAudio } from './config/main'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.css'
// import 'numeric'
// import { getTurkUniqueId } from './lib/utils'

// conditionally load electron and psiturk based on MTURK config variable
// const isElectron = !MTURK

const isElectron = false
let ipcRenderer = false;
let psiturk = false
if (isElectron) {
  const electron = window.require('electron');
  ipcRenderer = electron.ipcRenderer;
}

// else {
//   // React errors on build if the eslint is not disabled here
//   /* eslint-disable */
//   window.lodash = _.noConflict()
//   psiturk = new PsiTurk(getTurkUniqueId(), '/complete')
//   /* eslint-enable */
// }

function saveData(name, data) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'write_data.php'); // 'write_data.php' is the path to the php file described above.
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      console.log("it worked")
    } else {
      console.log(this.readyState, XMLHttpRequest.DONE, this.status, this.responseText)
    }
  }
  xhr.send(JSON.stringify({ filename: name, filedata: data }));
  // xhr.send(JSON.stringify("yay"))
}

class App extends React.Component {
  render() {
    console.log("TIMELINE", tl)
    return (
      <div className="App">
        <Experiment settings={{
          timeline: tl,
          preload_audio: [],
          on_data_update: (data) => {
            if (ipcRenderer) {
              ipcRenderer.send('data', data)
            }
            else if (psiturk) {
              psiturk.recordTrialData(data)
            }
          },
          on_finish: (data) => {
            // const fs = require('fs');
            // fs.writeFile("participant_output.txt", JSON.stringify(jsPsych.data.get()), function(err) {
            //     if(err) {
            //         return console.log(err);
            //     }

            //     console.log("The file was saved!");
            // }); 
            if (ipcRenderer) {
              ipcRenderer.send('end', 'true')
            }
            else if (psiturk) {
              psiturk.saveData()
            } else {
              // saveData("experiment_data", jsPsych.data.get().csv());
              // var encodedUri = encodeURI(jsPsych.data.get().csv());
              // var link = document.createElement("a");
              // link.setAttribute("href", encodedUri);
              // link.setAttribute("download", "my_data.csv");
              // document.body.appendChild(link); // Required for FF

              // link.click(); // This will download the data file named "my_data.csv".

              // var saveData = (function () {
              //   var a = document.createElement("a");
              //   document.body.appendChild(a);
              //   a.style = "display: none";
              //   return function (data, fileName) {
              //     var //json = JSON.stringify(data),
              //       blob = new Blob([data], { type: "octet/stream" }),
              //       url = window.URL.createObjectURL(blob);
              //     a.href = url;
              //     a.download = fileName;
              //     a.click();
              //     window.URL.revokeObjectURL(url);
              //   };
              // }());

              // saveData(jsPsych.data.get().csv(), "here.csv");

              var saveData = (function () {
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                return function (data, fileName) {
                  var //json = JSON.stringify(data),
                    blob = new Blob([data], { type: "octet/stream" }),
                    url = window.URL.createObjectURL(blob);
                  a.href = url;
                  a.download = fileName;
                  a.click();
                  window.URL.revokeObjectURL(url);
                };
              }());

              saveData(jsPsych.data.get().json(), "here.json");

              console.log("data written")
              // var fs = require('browserify-fs');
              // fs.mkdir('/logs', function() {
              //   fs.writeFile('/logs/participant_output.txt', 'Hello world!\n', function() {
              //       fs.readFile('/logs/participant_output.txt', 'utf-8', function(err, data) {
              //           console.log(data);
              //       })
              //     })
              //   })
              // }
            }
          }
        }}
        />
      </div>
    );
  }
}

export default App
