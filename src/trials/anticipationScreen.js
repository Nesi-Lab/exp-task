// import { eventCodes, ratingSettings, imageSettings } from '../config/main'
// import { getCircles, getCircle, drawNumbers, drawPrompt, drawFixation, drawCursor, drawQuestion, drawFace, drawWatching, drawImg} from '../lib/taskUtils'
import { drawWatching, drawQuestion, drawRater, drawRatee } from '../lib/draw'
import $ from 'jquery'
import { settings } from '../config/main'
// import { jitter50 } from '../lib/utils'

const DURATION = 3 * 1000  // three seconds

// make sure cursor radius is such that it can only touch one circle at a time
// const CANVAS_SIZE = ratingSettings.canvasSize
// const CIRCLE_RADIUS = ratingSettings.circleRadius
// const CURSOR_RADIUS = ratingSettings.cursorRadius

const canvasHTML = `<canvas width="${settings.canvasSize}" height="${settings.canvasSize}" id="jspsych-canvas">
    Your browser does not support HTML5 canvas
  </canvas>`

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
      drawWatching(ctx, n, settings.watchingFontSize, false)
      const thumb_coords = drawQuestion(ctx, null, settings.questionFontSize).thumb_coords
      drawRater(ctx, rater, settings.bioFontSize, false)
      drawRatee(ctx, ratee, null, settings.bioFontSize)

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

        // send trigger events
    //     const showCode = eventCodes.show_ratings
    //     const rateCode = eventCodes.rate

    //     const n = Math.floor(Math.random() * (MAX_N - MIN_N)) + MIN_N

    //     const start = Date.now()

    //     // add stimulus to the DOM
    //     document.getElementById('jspsych-content').innerHTML = stimulus
    //     // $('#jspsych-content').addClass('task-container')

    //     // set up canvas
    //     let canvas = document.querySelector('#jspsych-canvas');
    //     let ctx = canvas.getContext('2d');
    //     let animation

    //     // hide the mouse
    //     $('html').css('cursor', 'none')

    //     let w = $('#jspsych-canvas').width()
    //     let x = w / 2
    //     let dx = 0 // start at rest

    //     let h = $('#jspsych-canvas').height()
    //     let y = h / 2
    //     let dy = 0 // start at rest

    //     let path = []
    //     const rt = () => Date.now() - start
    //     const addToPath = () => path.push({x: x, y: y, elapsed: rt()})
    //     addToPath()

    //     let circles = getCircles(ratingSettings.min, ratingSettings.max, CANVAS_SIZE)

    //     // const baseImage = new Image();
    //     // baseImage.src = imagePath;
        
    //     const canvasDraw = () => {
    //       // transparent background
    //       ctx.clearRect(0, 0, canvas.width, canvas.height);

    //       drawPrompt(ctx, rt(), CANVAS_SIZE)

    //       drawQuestion(ctx, CANVAS_SIZE)

    //       drawWatching(ctx, CANVAS_SIZE, n)

    //     //   drawImg(ctx, imagePath, CANVAS_SIZE, CANVAS_SIZE * 0.5, CANVAS_SIZE * 0.5, 0.3)

    //       drawNumbers(ctx, circles, CIRCLE_RADIUS, x, y, CURSOR_RADIUS, null)

    //       // drawFixation(ctx, CANVAS_SIZE)
    //       drawFace(ctx, imagePath, CANVAS_SIZE)

    //       // draw the cursor
    //       drawCursor(ctx, x, y, CURSOR_RADIUS)

    //     }
    //     // show ratings
    //     canvasDraw();

    //     // make sure canvas re-draws at 10 seconds to get prompt
    //     setTimeout(canvasDraw, 10000)

    //     // request control of the cursor from the dom
    //     canvas.requestPointerLock()

    //     const handleMoveListener = (e) => {
    //       x += e.originalEvent.movementX;
    //       y += e.originalEvent.movementY;

    //       // if direction changes, add to path
    //       let newdx = Math.sign(e.originalEvent.movementX)
    //       let newdy = Math.sign(e.originalEvent.movementY)

    //       let updated = false
    //       if ( newdx !== dx && newdx !== 0 ) {
    //         addToPath()
    //         dx = newdx
    //         updated = true
    //       }

    //       if ( newdy !== dy && newdy !== 0 ) {
    //         if (!updated) addToPath()
    //         dy = newdy
    //       }

    //       // keep circle in canvas
    //       if (x > canvas.width - CURSOR_RADIUS) {
    //         x = canvas.width - CURSOR_RADIUS;
    //       }
    //       if (y > canvas.height - CURSOR_RADIUS) {
    //         y = canvas.height - CURSOR_RADIUS;
    //       }
    //       if (x < CURSOR_RADIUS) {
    //         x = CURSOR_RADIUS;
    //       }
    //       if (y < CURSOR_RADIUS) {
    //         y = CURSOR_RADIUS;
    //       }

    //       // re-draw with updates
    //       if (!animation) {
    //         animation = requestAnimationFrame( () => {
    //           animation = null;
    //           canvasDraw();
    //         });
    //       }
    //     }

    //     const handleClickListener = (e) => {
    //         // find circle that was clicked (or null if none)
    //         let circle = getCircle(x, y, CURSOR_RADIUS, circles, CIRCLE_RADIUS)

    //         if (circle) { // rating complete
    //           const end_rt = rt()

    //           // add final click spot to path
    //           addToPath()

    //           // free event listeners
    //           $(document).unbind('mousemove', handleMoveListener)
    //           $(document).unbind('click', handleClickListener)

    //           setTimeout(
    //               () => {
    //                 // re-show the mouse
    //                 $('html').css('cursor', 'auto')

    //                 done({circle: circle, click: {x: x, y: y}, code: [showCode, rateCode], rt: end_rt, path: path})
    //               },
    //               500)
    //         }
    //     }

    //     // Bind event listener to document
    //     $(document).bind('mousemove', handleMoveListener)
    //     $(document).bind('click', handleClickListener)
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
      // let animation

      $('html').css('cursor', 'none')

      // let w = $('#jspsych-canvas').width()
      // let h = $('#jspsych-canvas').height()

      // let circles = getCircles(ratingSettings.min, ratingSettings.max, CANVAS_SIZE)

      ctx.clearRect(0, 0, canvas.width, canvas.height); // transparent background
      drawWatching(ctx, n, settings.watchingFontSize, isWatchingTrial)
      drawQuestion(ctx, null, settings.questionFontSize)
      drawRater(ctx, rater, settings.bioFontSize, false)
      drawRatee(ctx, ratee, null, settings.bioFontSize)

      // ctx.lineWidth = 2
      // ctx.strokeStyle = "#ffffff" 
      // ctx.beginPath()
      // ctx.moveTo(0, 0)
      // ctx.lineTo(0, settings.canvasSize)
      // ctx.lineTo(settings.canvasSize, settings.canvasSize)
      // ctx.lineTo(settings.canvasSize, 0)
      // ctx.lineTo(0, 0)
      // ctx.closePath()
      // ctx.stroke()

      // drawQuestion(ctx, CANVAS_SIZE);
      // drawWatching(ctx, CANVAS_SIZE, n);
      // drawNumbers(ctx, circles, CIRCLE_RADIUS, w / 2, h / 2, CURSOR_RADIUS, null);
      // drawFace(ctx, ratee, CANVAS_SIZE);
      // drawFace(ctx, rater, CANVAS_SIZE, true);

      setTimeout(() => {
        $('html').css('cursor', 'auto')
        done({n: n, imagePath: ratee.img})
      }, DURATION)

      // return { n, imagePath }
    }
  }
}

export { anticipationScreenInteractive, anticipationScreenAutomatic }
