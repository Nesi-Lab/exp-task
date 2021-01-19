import { drawImg, drawWatching, drawQuestion, drawRater, drawRatee } from '../lib/draw'
import $ from 'jquery'
import { settings } from '../config/main'

// const webgazer = require('webgazer');
//import webgazer from 'webgazer'

const DURATION = 1 * 1000  // three seconds

const canvasHTML = `<canvas width="${settings.canvasSize}" height="${settings.canvasSize}" id="jspsych-canvas">
    Your browser does not support HTML5 canvas
  </canvas>`

const drawThumb = (ctx, thumb_coords, i, score) => {
  const coords = thumb_coords[i]
  const padding = 7
  const padded_coords = {
    x: coords.x - padding,
    y: coords.y - padding, 
    dx: coords.dx + 2 * padding, 
    dy: coords.dy + 2 * padding
  }
  ctx.beginPath();
  ctx.fillRect(padded_coords.x, padded_coords.y, padded_coords.dx, padded_coords.dy);
  ctx.fillStyle = 'black'
  ctx.fill();
  const img = (i === 1 || i === 2) ? settings.downThumb : settings.upThumb
  drawImg(ctx, img, score, i, coords, false)
  if (score === i) {
    ctx.strokeStyle = settings.colors[settings.thumb.selectedBorderColor]
    ctx.lineWidth = settings.thumb.selectedBorderThickness
    ctx.strokeRect(padded_coords.x, padded_coords.y, padded_coords.dx, padded_coords.dy)
}
}

const anticipationScreenInteractive = (rater, ratee, n) => {
    let stimulus = `<div class="task-container">` + canvasHTML + `</div>`

    return {
      type: 'call_function',
      async: true,
      func: (done) => {

      document.getElementById('jspsych-content').innerHTML = stimulus
      // set up canvas
      let canvas = document.querySelector('#jspsych-canvas');
      let ctx = canvas.getContext('2d');
      // let animation

      $('html').css('cursor', 'auto')

      ctx.clearRect(0, 0, canvas.width, canvas.height); // transparent background
      drawWatching(ctx, n, false)
      const thumb_coords = drawQuestion(ctx, null).thumb_coords
      drawRater(ctx, rater, false)
      drawRatee(ctx, ratee, null)

      // const handleMoveListener = (e) => {
      //   var rect = canvas.getBoundingClientRect();
      //   const x =  e.clientX - rect.left
      //   const y =  e.clientY - rect.top
      //   const within = (x, y, coords) => {
      //     return ((y > coords.y) && (y < (coords.y + coords.dy)) && (x > coords.x) && (x < (coords.x + coords.dx)))
      //   }
      //   var score = null
      //   for (let i = 1; i <= 4; i++) {
      //     if (within(x, y, thumb_coords[i])) { score = i }
      //   }
      //   for (let i = 1; i <= 4; i++) {
      //     drawThumb(ctx, thumb_coords, i, score)
      //   }
      // }

      const handleClickListener = (e) => {
        var rect = canvas.getBoundingClientRect();
        const x =  e.clientX - rect.left
        const y =  e.clientY - rect.top
        const within = (x, y, coords) => {
          return ((y > coords.y) && (y < (coords.y + coords.dy)) && (x > coords.x) && (x < (coords.x + coords.dx)))
        }
        for (let i = 1; i <= 4; i++) {
          if (within(x, y, thumb_coords[i])) { done({choice: i}) }
        }
      }

      $(document).bind('click', handleClickListener)
      // $(document).bind('mousemove', handleMoveListener)
      }
    }
}

const anticipationScreenAutomatic = (rater, ratee, n, isWatchingTrial=false) => {
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

      ctx.clearRect(0, 0, canvas.width, canvas.height); // transparent background
      drawWatching(ctx, n, isWatchingTrial)
      drawQuestion(ctx, null)
      drawRater(ctx, rater, false)
      drawRatee(ctx, ratee, null)
      // webgazer.begin()
      // console.log("PREDICTION", webgazer.getCurrentPrediction())

      setTimeout(() => {
        // $('html').css('cursor', 'auto')
        done({n: n, imagePath: ratee.img})
      }, DURATION)

      // return { n, imagePath }
    }
  }
}

export { anticipationScreenInteractive, anticipationScreenAutomatic }
