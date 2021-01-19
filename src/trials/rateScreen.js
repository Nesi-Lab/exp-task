import { drawWatching, drawQuestion, drawRater, drawRatee } from '../lib/taskUtils'
import { settings } from '../config/main'
import $ from 'jquery'

// const DURATION = (3 + 6) * 1000  // 9 seconds

const canvasHTML = `<canvas width="${settings.canvasSize}" height="${settings.canvasSize}" id="jspsych-canvas">
    Your browser does not support HTML5 canvas
  </canvas>`

const drawWatching = (ctx, n, section) => {
  const set = settings.watching
  const eye_size = set.imgSize
  const bgbox_coords = drawBackgroundBox(ctx, 0, 0)
  const eye_coords = {
    x: (bgbox_coords.dx - eye_size) / 2,
    y: 30,
    dx: eye_size,
    dy: eye_size * 0.506956522
  }
  drawImg(ctx, settings.eye, null, null, eye_coords, false)
  // text of who's watching
  const x_start = eye_coords.x - 5
  let x = x_start
  let y = eye_coords.y + eye_coords.dy + 30
  drawWatchingText(ctx, x_start, x, y, n, section == 'watching')
}

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

const drawQuestion = (ctx, score) => {
    const space = 30
    drawBackgroundBox(ctx, settings.canvasSize / 2 + space / 2, settings.canvasSize / 2 + space / 2)
    const set = settings.ratingQuestion
    const font_size = settings.fontSizes[set.fontSize]
    const thumb_size = settings.thumb.imgSize
    const padding = 7
    const radius = set.rounding  // larger is more rounded question box
    const txt = set.text

    const thumb_coords = {}
    for (let i = 1; i <= 4; i++) {
        const y_shift = (i === 1 || i === 2) ? 0 : thumb_size / 3
        thumb_coords[i] = {
            x: settings.canvasSize - ((thumb_size + 2 * padding) * (5 - i)) - 12,
            y: settings.canvasSize - (thumb_size + 2 * padding) - y_shift - 28,
            dx: thumb_size,
            dy: thumb_size
        }
    }
    const all_thumb_coords = {
        x: thumb_coords[1].x,
        y: thumb_coords[4].y,  // 3 and 4 are a little bit higher than 1 and 2
        dx: (thumb_coords[4].x + thumb_coords[4].dx) - thumb_coords[1].x,
        dy: (thumb_coords[1].y + thumb_coords[1].dy) - thumb_coords[4].y
    }

    // draw question
    ctx.fillStyle = settings.colors[set.fillColor]
    ctx.strokeStyle = settings.colors[set.fillColor]
    ctx.lineWidth = settings.thumb.selectedBorderThickness
    const rect_height = textHeight(ctx, txt, all_thumb_coords.dx - 2 * padding, font_size) + padding
    const question_box_coords = {
        x: all_thumb_coords.x + 10,
        y: all_thumb_coords.y - rect_height - padding * 5,
        dx: all_thumb_coords.dx - 20,
        dy: rect_height
    }
    roundRect(ctx, question_box_coords.x, question_box_coords.y, question_box_coords.dx, question_box_coords.dy, radius, true, true)
    wrapText(ctx, txt, question_box_coords.x + padding, question_box_coords.y + padding, question_box_coords.dx - 2 * padding, font_size)

    return {
        thumb_coords: thumb_coords, question_coords: {
            x: question_box_coords.x,
            y: question_box_coords.y,
            dx: (all_thumb_coords.x + all_thumb_coords.dx) - question_box_coords.x,
            dy: (all_thumb_coords.y + all_thumb_coords.dy) - question_box_coords.y
        }
    }
}

const rateScreen = (rater, ratee, n, section) => {
  let stimulus = `<div class="task-container">` + canvasHTML + `</div>`

  return {
    type: 'call_function',
    async: true,
    func: (done) => {
      document.getElementById('jspsych-content').innerHTML = stimulus
      let canvas = document.querySelector('#jspsych-canvas')
      let ctx = canvas.getContext('2d')
      $('html').css('cursor', 'auto')
      ctx.clearRect(0, 0, canvas.width, canvas.height); // transparent background

      drawWatching(ctx, n, score)
      const thumb_coords = drawQuestion(ctx).thumb_coords
      drawRater(ctx, rater)
      drawRatee(ctx, ratee)
      
      if (section == 'rating') {
        const thumbClickListener = (e) => {
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

        $(document).bind('click', thumbClickListener)
      }
    }
  }
}

export default rateScreen