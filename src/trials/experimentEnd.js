import { lang } from '../config/main'
import { baseStimulus } from '../lib/markup/stimuli'

const experimentEnd = (duration) => {
  // let stimulus = baseStimulus(`<h1>${lang.task.end}</h1>`, true) + photodiodeGhostBox()
  let stimulus = baseStimulus(`<h1>${lang.task.end}</h1>`, true)

   return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    trial_duration: duration,
    on_load: () => {
      // if (VIDEO) {
      //   console.log('finished')
      //   window.cameraCapture.stop()
      //   window.screenCapture.stop()
      // }
    }
  }
}

export default experimentEnd
