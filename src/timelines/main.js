import bio from '../trials/participantBio'
import id from '../trials/participantID'
import { experimentStart } from '../trials/experimentStart'
import taskSetUp from './taskSetUp'
import { linkSM, processSM, friendsSM} from '../trials/linkSM'

let timeline

// if (AT_HOME && !VIDEO) {
//   timeline = [
//     experimentStart(),
//     userId(),
//     adjustVolume(),
//     taskSetUp(defaultBlockSettings), // start pd code + get local images, add block to end of timeline
//     instructions1,
//     taskBlock(practiceBlockSettings),
//     instructions2,
//     experimentEnd()
//     ]
// }
// else if (AT_HOME && VIDEO) {
//   timeline = [
//     experimentStart(),
//     userId(),
//     adjustVolume(),
//     camera(),
//     taskSetUp(defaultBlockSettings), // start pd code + get local images, add block to end of timeline
//     instructions1,
//     taskBlock(practiceBlockSettings),
//     instructions2,
//     experimentEnd()
//     ]
// }
// else {
  timeline = [
    id(),
    experimentStart(),
    linkSM(),
    processSM(),
    friendsSM(),
    // userId(),
    bio(),
    // adjustVolume(),
    // holdUpMarker(),
    taskSetUp(), // start pd code + get local images, add block to end of timeline
    // instructions1,
    // taskBlock(practiceBlockSettings),
    // instructions2
    ]
// }

// const primaryTimeline = timeline
// const mturkTimeline = []
// export const tl = (MTURK) ? mturkTimeline : primaryTimeline
export const tl = timeline