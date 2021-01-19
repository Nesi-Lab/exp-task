import $ from 'jquery'
import { baseStimulus } from '../lib/markup/stimuli'

const jblockStart = (jblockNum, duration=3*1000, hideCursor=true) => {
  let stimulus = baseStimulus(`<h1>Block ${jblockNum} starting...</h1>`, true)

   return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    trial_duration: duration,
    on_load: () => {
      // if (hideCursor) $('html').css('cursor', 'none')
      }
    }
  }
  
export default jblockStart
