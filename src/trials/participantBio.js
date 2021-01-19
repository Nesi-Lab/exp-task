import { getUserBio } from '../lib/utils'
import { settings } from '../config/main'
import $ from 'jquery'
import { drawPhotoUpload } from '../lib/draw'

const canvasHTML = `<canvas width="${settings.canvasSize}" height="${settings.canvasSize}" id="jspsych-canvas">
    Your browser does not support HTML5 canvas
  </canvas>`

const bio = () => {
    return {
        type: 'survey_text',
        preamble: settings.bio.text1,
        //   show_clickable_nav: true,
        questions: [
            { prompt: settings.bio.name, rows: 1, columns: 40 },
            { prompt: settings.bio.town, rows: 1, columns: 40 },
            { prompt: "Please create your bio...", rows: 3, columns: 40 }
        ],
        on_finish: (data) => {
            getUserBio(data)
        }
    }
}

const photo = () => {
    return {
        type: 'call_function',
        async: true,
        func: (done) => {

            const imgUpload = `<input type='file' id='selectedFile' accept="image/png, image/jpeg, image/jpg" id="selectedFile" style="display: none;"/>
            <br><img id="participant-img" src="#" height=200 width=200 style="border-radius:50%;position:absolute;display:none;">`

            let stimulus = `<div class="task-container">` + canvasHTML + imgUpload + `</div>`
            document.getElementById('jspsych-content').innerHTML = stimulus

            let canvas = document.querySelector('#jspsych-canvas');
            let ctx = canvas.getContext('2d');

            const all_coords = drawPhotoUpload(ctx)
            const buffer = 20

            const handleLoadListener = (e) => {
                let v = document.querySelector('input[type="file"]')
                // document.querySelector('input[type="file"]').addEventListener('change', function() {
                if (v.files && v.files[0]) {
                    var img = document.getElementById('participant-img');  // $('img')[0]
                    img.src = URL.createObjectURL(v.files[0]); // set src to blob url
                    const box_coords = all_coords.box
                    img.style.left = box_coords.x + (box_coords.dx - 200) / 2 + canvas.offsetLeft + "px"
                    img.style.top = box_coords.y + buffer + canvas.offsetTop + "px"
                    img.style.display = "inline"
                    // img.onload = imageIsLoaded;
                }
                // });
            }

            const handleClickListener = (e) => {
                var rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                const within = (x, y, coords) => {
                    return ((y > coords.y) && (y < (coords.y + coords.dy)) && (x > coords.x) && (x < (coords.x + coords.dx)))
                }
                if (within(x, y, all_coords.upload)) {
                    document.getElementById('selectedFile').click();
                }
                if (within(x, y, all_coords.continue)) {
                    $(document).unbind('click', handleClickListener)
                    done({})
                }
            }

            $(document).bind('click', handleClickListener)
            $(document).bind('change', handleLoadListener)

            //   function imageIsLoaded() { 
            //     alert(this.src);  // blob url
            //     // update width and height ...
            //   }

        }
    }
}

export { bio, photo }