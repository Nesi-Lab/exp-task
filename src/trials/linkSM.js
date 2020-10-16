import { drawSM, drawProcessSM, drawFriendsSM, drawCheck } from '../lib/draw'
import { settings } from '../config/main'
import $ from 'jquery'
import { jsPsych } from 'jspsych-react'
import { wrapText, lineHeight } from '../lib/taskUtils'

const canvasHTML = `<canvas width="${settings.canvasSize}" height="${settings.canvasSize}" id="jspsych-canvas">
    Your browser does not support HTML5 canvas
  </canvas>`

const linkSM = () => {
    let stimulus = `<div class="task-container">` + canvasHTML + `</div>`

    return {
        type: 'call_function',
        async: true,
        func: (done) => {

            document.getElementById('jspsych-content').innerHTML = stimulus
            // set up canvas
            let canvas = document.querySelector('#jspsych-canvas');
            let ctx = canvas.getContext('2d');

            const socials = ["facebook", "instagram", "snapchat", "tiktok"]

            const all_coords = drawSM(ctx, socials, 24)
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
                    done({ checked_socials: checked_socials })
                }
            }
            $(document).bind('click', handleClickListener)

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
                done({checked_socials: checked_socials})
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
            const all_box_coords = all_coords.boxes
            const continue_coords = all_coords.continue

            const buffer = 30
            const font_size = 24
            let new_y = wrapText(ctx, "There are a total of 53 users on Connect.", buffer, all_box_coords.length === 0 ? buffer : all_box_coords[0].y + all_box_coords[0].dy + buffer, settings.canvasSize - buffer * 2, font_size)
            new_y = wrapText(ctx, "You have 3 friends on Connect right now!", buffer, new_y + lineHeight(font_size), settings.canvasSize - buffer * 2, font_size)
            wrapText(ctx, "You have 15 friends-of-friends on Connect right now!", buffer, new_y + lineHeight(font_size), settings.canvasSize - buffer * 2, font_size)

            const handleClickListener = (e) => {
                var rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                const within = (x, y, coords) => {
                    return ((y > coords.y) && (y < (coords.y + coords.dy)) && (x > coords.x) && (x < (coords.x + coords.dx)))
                }
                if (within(x, y, continue_coords)) {
                    done({})
                }
            }
            $(document).bind('click', handleClickListener)
        }
    }
}

export { linkSM, processSM, friendsSM }