import { drawSummaryPeople, drawWatching } from '../lib/draw'
import { settings } from '../config/main'
import $ from 'jquery'

const DURATION = 3 * 1000  // three seconds

const canvasHTML = `<canvas width="${settings.canvasSize}" height="${settings.canvasSize}" id="jspsych-canvas">
    Your browser does not support HTML5 canvas
  </canvas>`

const summaryScreen = (ratee, rater_l, rater_r, ratee_mean_score, n) => {
    let stimulus = `<div class="task-container">` + canvasHTML + `</div>`

    return {
        type: 'call_function',
        async: true,
        trial_duration: DURATION,
        func: (done) => {
  
        document.getElementById('jspsych-content').innerHTML = stimulus
        // set up canvas
        let canvas = document.querySelector('#jspsych-canvas');
        let ctx = canvas.getContext('2d');

        $('html').css('cursor', 'none')
        drawWatching(ctx, n, settings.watchingFontSize, false)
        drawSummaryPeople(ctx, [rater_l, ratee, rater_r], [rater_l.mean_score, ratee_mean_score, rater_r.mean_score], settings.bioFontSize)
        //  TODO add scores as part of drawSummaryPeople

        setTimeout(() => {
            $('html').css('cursor', 'auto')
            done({})
          }, DURATION)

        }
    }
}

export { summaryScreen }