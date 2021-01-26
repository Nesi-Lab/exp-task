import { getUserBio, findData, findData2 } from '../lib/utils'
import { settings } from '../config/main'
import $ from 'jquery'
import { drawPhotoUpload } from '../lib/draw'
import { jsPsych } from 'jspsych-react'
import { baseStimulus } from '../lib/markup/stimuli'



const canvasHTML = `<canvas width="${settings.canvasSize}" height="${settings.canvasSize}" id="jspsych-canvas">
    Your browser does not support HTML5 canvas
  </canvas>`

let startingLeft = null, startingTop = null

const fixLocs = () => {
    let canvas = document.querySelector('#jspsych-canvas');
    let curr = document.getElementById('participant-img')
    if (!startingLeft) { startingLeft = parseInt(curr.style.left.replace("px", "")) }
    if (!startingTop) { startingTop = parseInt(curr.style.top.replace("px", "")) }
    curr.style.left = startingLeft + canvas.offsetLeft + "px"
    curr.style.top = startingTop + canvas.offsetTop + "px"
}

const uploadPhoto = () => {
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
                    img.style.left = box_coords.x + (box_coords.dx - 200) / 2 + "px"
                    img.style.top = box_coords.y + buffer + "px"
                    img.style.display = "inline"
                    fixLocs()
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
                    $(document).unbind('change', handleLoadListener)
                    window.onresize = null
                    done({ participant_img: document.getElementById('participant-img').src })
                }
            }

            $(document).bind('click', handleClickListener)
            $(document).bind('change', handleLoadListener)
            window.onresize = fixLocs

            //   function imageIsLoaded() { 
            //     alert(this.src);  // blob url
            //     // update width and height ...
            //   }

        }
    }
}

const makeImg = () => {
    const img = findData('participant_img')
    return '<img src="' + img + '" height=250 width=250 style="border-radius:50%;margin-bottom:20px;">'
}

const ratePhoto = () => {
    return {
        type: 'html_slider_response',
        on_start: trial => {
            trial.stimulus = makeImg() + '<p>' + settings.photoUpload.prompt + '</p>'
        },
        slider_width: parseInt(document.body.clientWidth * 0.7),
        stimulus: "",
        // stimulus: jsPsych.data.get().values()[0].participant_img,
        labels: ['not at all', 'a lot'],
    }
}

const writtenBio = () => {
    const set = settings.bio
    const desc = '<br><h1>' + set.title + '<br></h1><p>' + set.text1 + '</p><p>' + set.text2 + '</p>'
    // const lab_inp = (val) => '<div style="display:inline-block;margin-right:30px;"><label style="font-size:30px;display:block" for="' + val + '">' + val + '</label><input style="display:block;margin:auto" id="' + val + '"type="radio" value="' + val + '" name=emoji"></div>'
    // const emoji = '<p>' + set.emoji + '</p><input type=radio id="whale" value="🐳"><label for="whale">🐳</label><br><input type=radio id="sparkle" value="✨"><label for="sparkle">✨</label>'
    // const emojis = ["🙃","🐳","✨","🎉","🌸","🏆","😻","🌎"]
    // const emoji = '<p>' + set.emoji + '</p><div id="emojis" style="margin:auto;">' + emojis.map(lab_inp).join("") + '<span style="clear:left;display:block"></span></div>'
    return {
        type: 'survey_text',
        preamble: desc,// + emoji,
        questions: [
            { prompt: set.town, rows: 1, columns: 40, name: "town", required: true },
            { prompt: set.activity, rows: 1, columns: 40, name: "activity", required: true },
        ],
        on_finish: (data) => {
            getUserBio(data)
        },
    }
}

const emojiBio = () => {
    const set = settings.bio
    const desc = '<br><h1>' + set.title + '<br></h1><p>' + set.text1 + '</p><p>' + set.text2 + '</p>'
    return {
        type: 'survey_multi_choice',
        preamble: desc,// + emoji,
        questions: [
            { prompt: set.emoji, name: "emoji", options: ["🙃", "🐳", "✨", "🎉", "🌸", "🏆", "😻", "🌎"].map(em => '<h1>' + em + '</h1>'), required: true, horizontal: true },
        ],
        on_finish: (data) => {
            const em = JSON.parse(data.responses)['Q0'].replace('<h1>', "").replace('</h1>', "")
            jsPsych.data.addProperties({ participant_emoji: em, timestamp: Date.now() })
            console.log("em", em)
            const bio = "I\'m from " + findData2('participant_town') + " " + em + " I love to " + findData2('participant_activity')
            jsPsych.data.addProperties({ participant_bio: bio, timestamp: Date.now() })
            console.log("bio", bio)
        },
    }
}

const rateBio = () => {
    return {
        type: 'html_slider_response',
        slider_width: parseInt(document.body.clientWidth * 0.7),
        on_start: trial => {
            trial.stimulus = '<p>' + settings.bio.prompt + '</p><br><p>' + findData2('participant_bio') + '</p>'
        },
        stimulus: "",
        labels: ['not at all', 'a lot'],
    }
}

const displayBio = () => {
    return {
        type: 'instructions',
        show_clickable_nav: true,
        pages: [],
        on_start: trial => trial.pages = ['<div class="instructions"><h1 style="text-align:left;margin:50px">You\'re all set!</h1>' +
        '<div style="border-style:solid;border-color:white;width:280px;margin:auto;margin-bottom:50px">' + makeImg() + '<br><p style="width:250px;display:inline-block">' + findData2('participant_bio') + '</p></div></div>']
      }
}

const bio = () => {
    return {
        type: 'html_keyboard_response',
        timeline: [
            uploadPhoto(),
            ratePhoto(),
            writtenBio(),
            emojiBio(),
            rateBio(),
            displayBio()
        ]
    }
}

export { bio }