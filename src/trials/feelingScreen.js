import { drawFeelingScale } from '../lib/draw'
import $ from 'jquery'
import { settings } from '../config/main'

const canvasHTML = `<canvas width="${settings.canvasSize}" height="${settings.canvasSize}" id="jspsych-canvas">
    Your browser does not support HTML5 canvas
  </canvas>`

const feelingScreen = () => {
    let stimulus = `<div class="task-container">` + canvasHTML + `</div>`

    return {
        type: 'call_function',
        async: true,
        func: (done) => {

        document.getElementById('jspsych-content').innerHTML = stimulus
        let canvas = document.querySelector('#jspsych-canvas');
        let ctx = canvas.getContext('2d');
        $('html').css('cursor', 'auto')

        ctx.clearRect(0, 0, canvas.width, canvas.height); // transparent background
        let button_coords = drawFeelingScale(ctx, {x: 100, y: 100, dx: 400, dy: 400}, null).button_coords
        console.log("button coords", button_coords)
        const handleClickListener = (e) => {
            var rect = canvas.getBoundingClientRect();
            const x =  e.clientX - rect.left
            const y =  e.clientY - rect.top
            const within = (x, y, coords) => {
              const dist = Math.sqrt(Math.pow(coords.x - x, 2) + Math.pow(coords.y - y, 2))
              return (dist <= coords.r)
            }
            for (let i = 1; i <= 7; i++) {
              if (within(x, y, button_coords[i])) { 
                console.log("CLICK", x, y, i, button_coords[i])
                $(document).unbind('click');
                done({choice: i}) }
            }
          }

        $(document).bind('click', handleClickListener)
        }
    }
}

export default feelingScreen