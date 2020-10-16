// import trials
import { anticipationScreenInteractive, anticipationScreenAutomatic } from "../trials/anticipationScreen"
import { feedbackScreen } from "../trials/feedbackScreen"
import { interpretationScreen } from "../trials/interpretationScreen"
import { summaryScreen } from "../trials/summaryScreen"
import { settings } from '../config/main'
import { jsPsych } from 'jspsych-react'

const participantInfo = () => {
  return {
    "town": jsPsych.data.get().values()[0].participant_town,
    "bio": jsPsych.data.get().values()[0].participant_bio,
    "img": settings.participantImage
  }
}

const watchingTrial = (trialDict) => {
  const rater = settings.impersonatorInfo[trialDict.rater]
  const ratee = settings.impersonatorInfo[trialDict.ratee]
  const n = trialDict.num_watching
  let timeline = [
    // fixation(fixation_len, false, false, true), // jittered, white, hidden cursor
    anticipationScreenAutomatic(rater, ratee, n, true),
    feedbackScreen(rater, ratee, n, trialDict.score, true)
  ]

  return {
    type: 'html_keyboard_response',
    timeline: timeline
  }
}

const ratingTrial = (trialDict) => {
  const rater = participantInfo()
  const ratee = settings.impersonatorInfo[trialDict.ratee]
  const n = trialDict.num_watching
  let timeline = [
    // fixation(fixation_len, false, false, true), // jittered, white, hidden cursor
    anticipationScreenInteractive(rater, ratee, n),
    feedbackScreen(rater, ratee, n)
  ]

  return {
    type: 'html_keyboard_response',
    timeline: timeline
  }
}

const ratedTrial = (trialDict) => {
  const rater = settings.impersonatorInfo[trialDict.rater]
  const ratee = participantInfo()
  const n = trialDict.num_watching
  let timeline = [
    // fixation(fixation_len, false, false, true), // jittered, white, hidden cursor
    anticipationScreenAutomatic(rater, ratee, n),
    feedbackScreen(rater, ratee, n, trialDict.score),
    interpretationScreen(rater)
  ]

  return {
    type: 'html_keyboard_response',
    timeline: timeline
  }
}

const blockSummary = (trialDictLeft, trialDictRight, num_watching, ratee_mean_score) => {
  const rater_l = settings.impersonatorInfo[trialDictLeft.rater]
  const rater_r = settings.impersonatorInfo[trialDictRight.rater]
  const ratee = participantInfo()
  let timeline = [
    summaryScreen(ratee, rater_l, rater_r, ratee_mean_score, num_watching)
  ]
  
  return {
    type: 'html_keyboard_response',
    timeline: timeline
  }
}

export { watchingTrial, ratingTrial, ratedTrial, blockSummary }
