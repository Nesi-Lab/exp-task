import { drawSM, drawProcessSM, drawFriendsSM, drawCheck } from '../lib/draw'
import { settings } from '../config/main'
import $ from 'jquery'
import { jsPsych } from 'jspsych-react'
import { wrapText, lineHeight } from '../lib/taskUtils'

const canvasHTML = `<canvas width="${settings.canvasSize}" height="${settings.canvasSize}" id="jspsych-canvas">
    Your browser does not support HTML5 canvas
  </canvas>`

const formField = (placeholder, y) => {
    const left = placeholder == "password" ? 405 : 195
    const top = 120 + y * 70
    return `<input type="${placeholder == "password" ? "password" : "text"}" placeholder=${placeholder} style="position:absolute;left:${left}px;top:${top}px;width:180px;" id="${placeholder.replace("/", "")}${y}"/>`
}

let startingLeft = null;
let startingTops = [null, null, null, null]

const fixLocs = () => {
    let canvas = document.querySelector('#jspsych-canvas');
    for (let i = 0; i <= 3; i++) {
        const user = i == 0 ? "#emailphone" : "#username"
        let curr = document.querySelector(user + i)
        if (!startingLeft) { startingLeft = parseInt(curr.style.left.replace("px", ""))}
        if (!startingTops[i]) { startingTops[i] = parseInt(curr.style.top.replace("px", ""))}
        curr.style.left = startingLeft + canvas.offsetLeft + "px"
        curr.style.top = startingTops[i] + canvas.offsetTop + "px"
    }
}

const linkSM = () => {

    return {
        type: 'call_function',
        async: true,
        func: (done) => {

            const formHTML = formField("email/phone", 0) +
                formField("username", 1) +
                formField("username", 2) +
                formField("username", 3)

            let stimulus = `<div class="task-container">` + canvasHTML + formHTML + `</div>`

            document.getElementById('jspsych-content').innerHTML = stimulus
            // set up canvas
            let canvas = document.querySelector('#jspsych-canvas');
            fixLocs()
            let ctx = canvas.getContext('2d');

            const socials = ["facebook", "instagram", "snapchat", "tiktok"]

            const all_coords = drawSM(ctx, socials)
            const all_box_coords = all_coords.boxes
            const continue_coords = all_coords.continue

            const boxes_checked = []
            for (let i = 1; i <= all_box_coords.length; i++) {
                boxes_checked.push(false)
            }

            const handleClickListener = (e) => {
                var rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                const within = (x, y, coords) => {
                    return ((y > coords.y) && (y < (coords.y + coords.dy)) && (x > coords.x) && (x < (coords.x + coords.dx)))
                }
                for (let i = 0; i < all_box_coords.length; i++) {
                    if (within(x, y, all_box_coords[i])) {
                        boxes_checked[i] = drawCheck(ctx, all_box_coords[i], boxes_checked[i])
                    }
                }
                if (within(x, y, continue_coords)) {
                    const checked_socials = []
                    for (let i = 0; i < socials.length; i++) {
                        if (boxes_checked[i]) {
                            checked_socials.push(socials[i])
                        }
                    }
                    $(document).unbind('click', handleClickListener)
                    window.onresize = null
                    done({ checked_socials: checked_socials })
                }
            }
            $(document).bind('click', handleClickListener)
            window.onresize = fixLocs
        }
    }
}

const processSM = () => {

    let stimulus = `<div class="task-container">` + canvasHTML + `</div>`

    return {
        type: 'call_function',
        async: true,
        func: (done) => {
            document.getElementById('jspsych-content').innerHTML = stimulus
            // set up canvas
            let canvas = document.querySelector('#jspsych-canvas');
            let ctx = canvas.getContext('2d');

            const duration = 1 * 1000

            const all_vals = jsPsych.data.get().values()
            const checked_socials = all_vals[Object.keys(all_vals).length - 1].value.checked_socials

            const all_img_coords = drawProcessSM(ctx, checked_socials, 24)
            for (let i = 0; i < all_img_coords.length; i++) {
                setTimeout(() => {
                    drawCheck(ctx, all_img_coords[i], false)
                }, duration * (i + 1))
            }
            setTimeout(() => {
                done({ checked_socials: checked_socials })
            }, duration * (all_img_coords.length + 1))
        }
    }
}

const friendsSM = () => {
    let stimulus = `<div class="task-container">` + canvasHTML + `</div>`

    return {
        type: 'call_function',
        async: true,
        func: (done) => {
            document.getElementById('jspsych-content').innerHTML = stimulus
            // set up canvas
            let canvas = document.querySelector('#jspsych-canvas');
            let ctx = canvas.getContext('2d');

            const all_vals = jsPsych.data.get().values()
            const checked_socials = all_vals[Object.keys(all_vals).length - 1].value.checked_socials

            const all_coords = drawFriendsSM(ctx, checked_socials, 24)
            for (let i = 0; i < all_coords.boxes.length; i++) {
                setTimeout(() => {
                    drawCheck(ctx, all_coords.boxes[i], false)
                }, 1)
            }
            const all_box_coords = all_coords.boxes
            const continue_coords = all_coords.continue

            const buffer = 30
            const font_size = 24
            let new_y = wrapText(ctx, settings.friendsSM.text1, buffer, all_box_coords.length === 0 ? buffer : all_box_coords[0].y + all_box_coords[0].dy + buffer, settings.canvasSize - buffer * 2, font_size)
            new_y = wrapText(ctx, settings.friendsSM.text2, buffer, new_y + lineHeight(font_size), settings.canvasSize - buffer * 2, font_size)
            wrapText(ctx, settings.friendsSM.text3, buffer, new_y + lineHeight(font_size), settings.canvasSize - buffer * 2, font_size)

            const handleClickListener = (e) => {
                var rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                const within = (x, y, coords) => {
                    return ((y > coords.y) && (y < (coords.y + coords.dy)) && (x > coords.x) && (x < (coords.x + coords.dx)))
                }
                if (within(x, y, continue_coords)) {
                    $(document).unbind('click', handleClickListener)
                    done({})
                }
            }
            $(document).bind('click', handleClickListener)
        }
    }
}

const socialMedia = () => {
    return {
		type: 'html_keyboard_response',
		timeline: [
            linkSM(),
            processSM(),
            friendsSM()
        ]
	}
}

export { socialMedia }