import { bio, photo } from '../trials/participantBio'
import id from '../trials/participantID'
import { experimentStart, tutorial } from '../trials/experimentStart'
import taskSetUp from './taskSetUp'
import { linkSM, processSM, friendsSM} from '../trials/linkSM'
import feelingScreen from '../trials/feelingScreen'
import feelingScreens from '../trials/feelingScreens'

let timeline = [
  id(),
  // feelingScreens(),
  // feelingScreen(),
  experimentStart(),
  linkSM(),
  processSM(),
  friendsSM(),
  photo(),
  bio(),
  tutorial(),
  taskSetUp()
  ]

export const tl = timeline