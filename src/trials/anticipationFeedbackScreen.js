import { drawWatching, drawQuestion, drawRater, drawRatee } from '../lib/taskUtils'
import { settings } from '../config/main'
import $ from 'jquery'

const DURATION = (3 + 6) * 1000  // 9 seconds

const canvasHTML = `<canvas width="${settings.canvasSize}" height="${settings.canvasSize}" id="jspsych-canvas">
    Your browser does not support HTML5 canvas
  </canvas>`

const anticipationFeedbackScreen = (rater, ratee, n, score, isWatchingTrial=false) => {
  let stimulus = `<div class="task-container">` + canvasHTML + `</div>`

  return {
    type: 'call_function',
    async: true,
    trial_duration: DURATION,
    func: (done) => {

      // add stimulus to the DOM
      document.getElementById('jspsych-content').innerHTML = stimulus
      // set up canvas
      let canvas = document.querySelector('#jspsych-canvas');
      let ctx = canvas.getContext('2d');
      // let animation

      $('html').css('cursor', 'none')

      // let w = $('#jspsych-canvas').width()
      // let h = $('#jspsych-canvas').height()

      // let circles = getCircles(ratingSettings.min, ratingSettings.max, CANVAS_SIZE)

      ctx.clearRect(0, 0, canvas.width, canvas.height); // transparent background
      drawWatching(ctx, isWatchingTrial, n)
      drawQuestion(ctx, score)
      drawRater(ctx, rater)
      drawRatee(ctx, ratee, score)

      // ctx.clearRect(0, 0, canvas.width, canvas.height); // transparent background
      // drawQuestion(ctx, CANVAS_SIZE);
      // drawWatching(ctx, CANVAS_SIZE, n);
      // drawNumbers(ctx, circles, CIRCLE_RADIUS, w / 2, h / 2, CURSOR_RADIUS, score);
      // drawFace(ctx, ratee, CANVAS_SIZE);
      // drawFace(ctx, rater, CANVAS_SIZE, true);

      setTimeout(() => {done({n: n, imagePath: ratee.img})}, DURATION)

      // return { n, imagePath }
    }
  }
}

export { feedbackScreen }
