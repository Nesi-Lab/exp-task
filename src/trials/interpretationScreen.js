// import { eventCodes, ratingSettings, imageSettings } from '../config/main'
// import { getCircles, getCircle, drawNumbers, drawPrompt, drawFixation, drawCursor, drawQuestion, drawFace, drawWatching} from '../lib/taskUtils'
import { drawRater, drawInterpQuestion, drawInterpScale } from '../lib/draw'
import { settings } from '../config/main'
import $ from 'jquery'

const canvasHTML = `<canvas width="${settings.canvasSize}" height="${settings.canvasSize}" id="jspsych-canvas">
    Your browser does not support HTML5 canvas
  </canvas>`

const interpretationScreen = (rater) => {
  let stimulus = `<div class="task-container">` + canvasHTML + `</div>`

  return {
    type: 'call_function',
    async: true,
    func: (done) => {
      document.getElementById('jspsych-content').innerHTML = stimulus
      // set up canvas
      let canvas = document.querySelector('#jspsych-canvas');
      let ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, canvas.width, canvas.height); // transparent background
      const img_coords = drawRater(ctx, rater, settings.bioFontSize, true)
      drawInterpQuestion(ctx, img_coords, settings.questionFontSize * 1.5)
      let button_coords = drawInterpScale(ctx, img_coords, null, 28).button_coords

      // const handleMoveListener = (e) => {
      //   var rect = canvas.getBoundingClientRect();
      //   const x =  e.clientX - rect.left
      //   const y =  e.clientY - rect.top
      //   const within = (x, y, coords) => {
      //     const dist = Math.sqrt(Math.pow(coords.x - x, 2) + Math.pow(coords.y - y, 2))
      //     return (dist <= coords.r)
      //   }
      //   let on = null
      //   for (let i = 1; i <= 7; i++) {
      //     if (within(x, y, button_coords[i])) { 
      //       on = i
      //       console.log(i) 
      //     }
      //   }
      //   button_coords = drawInterpScale(ctx, img_coords, on, 28).button_coords
      // }

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
            console.log(i)

            done({choice: i}) }
        }
      }
      // $(document).bind('mousemove', handleMoveListener)
      $(document).bind('click', handleClickListener)
      // ctx.font = 24 + settings.fontFace;
      // ctx.textBaseline = 'top';
      // ctx.fillStyle = "#ffffff"
      // ctx.textAlign = "left";
      // ctx.fillText("Does this person want to be friends with you?", 0, 0)

      // const baseImage = new Image();
      // baseImage.src = rater.img;
      // baseImage.onload = function () {
      //   ctx.drawImage(baseImage, 0, 100, 100, 100);
      // }
      // drawRater(ctx, rater.img, true)
      // setTimeout(() => { done() }, DURATION)
    }
  }
}

// const interpretationSliderScreen = {
//     type: 'html-slider-response',
//     stimulus: '<h1>Does this person want to be friends with you?</h1>',
//     labels: ['Not at all', 'A lot'],
//     min: 1,
//     max: 7,
//     start: 3.5,
//     step: 0.5,
//     prompt: '<p></p>'
// }

export { interpretationScreen }
