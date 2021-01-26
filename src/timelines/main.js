import { bio, photo } from '../trials/participantBio'
import id from '../trials/participantID'
import { experimentStart, tutorial } from '../trials/experimentStart'
import taskSetUp from './taskSetUp'
import { socialMedia } from '../trials/linkSM'
import feelingScreen from '../trials/feelingScreen'
import feelingScreens from '../trials/feelingScreens'
import { jsPsych } from 'jspsych-react'

let timeline = [
  id(),
  feelingScreens(),
  experimentStart(),
  socialMedia(),
  bio(),
  tutorial(),
  taskSetUp()
  ]

export const tl = timeline