// import { eventCodes, ratingSettings, imageSettings } from '../config/main'
// import { getCircles, getCircle, drawNumbers, drawPrompt, drawFixation, drawCursor, drawQuestion, drawFace, drawWatching} from '../lib/taskUtils'
import { drawWatching, drawQuestion, drawRater, drawRatee } from '../lib/draw'
import { settings } from '../config/main'
import $ from 'jquery'
import { jsPsych } from 'jspsych-react'
// import { jitter50 } from '../lib/utils'

const DURATION = 1 * 1000  // six seconds

// make sure cursor radius is such that it can only touch one circle at a time
// const CANVAS_SIZE = ratingSettings.canvasSize
// const CIRCLE_RADIUS = ratingSettings.circleRadius
// const CURSOR_RADIUS = ratingSettings.cursorRadius


const canvasHTML = `<canvas width="${settings.canvasSize}" height="${settings.canvasSize}" id="jspsych-canvas">
    Your browser does not support HTML5 canvas
  </canvas>`

const feedbackScreen = (rater, ratee, n, score, isWatchingTrial=false) => {
  let stimulus = `<div class="task-container">` + canvasHTML + `</div>`

  return {
    type: 'call_function',
    async: true,
    trial_duration: DURATION,
    func: (done) => {
      if (score == null) {  // rating block
        const all_vals = jsPsych.data.get().values()
        score = all_vals[Object.keys(all_vals).length - 1].value.choice
      }

      // add stimulus to the DOM
      document.getElementById('jspsych-content').innerHTML = stimulus
      // set up canvas
      let canvas = document.querySelector('#jspsych-canvas');
      let ctx = canvas.getContext('2d');
      // let animation

      // $('html').css('cursor', 'none')

      // let w = $('#jspsych-canvas').width()
      // let h = $('#jspsych-canvas').height()

      // let circles = getCircles(ratingSettings.min, ratingSettings.max, CANVAS_SIZE)

      ctx.clearRect(0, 0, canvas.width, canvas.height); // transparent background
      drawWatching(ctx, n, isWatchingTrial)
      drawQuestion(ctx, score)
      drawRater(ctx, rater, false)
      drawRatee(ctx, ratee, score)

      // ctx.clearRect(0, 0, canvas.width, canvas.height); // transparent background
      // drawQuestion(ctx, CANVAS_SIZE);
      // drawWatching(ctx, CANVAS_SIZE, n);
      // drawNumbers(ctx, circles, CIRCLE_RADIUS, w / 2, h / 2, CURSOR_RADIUS, score);
      // drawFace(ctx, ratee, CANVAS_SIZE);
      // drawFace(ctx, rater, CANVAS_SIZE, true);

      setTimeout(() => {
        // $('html').css('cursor', 'auto')
        done({n: n, imagePath: ratee.img})
      }, DURATION)

      // return { n, imagePath }
    }
  }
}

export { feedbackScreen }
