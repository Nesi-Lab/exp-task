import { jsPsych } from 'jspsych-react'
// import { AT_HOME, MTURK, lang, numRequiredImages, defaultBlockSettings } from '../config/main'
import { settings } from '../config/main'
import experimentEnd from '../trials/experimentEnd'
import feelingScreens from '../trials/feelingScreens'
import { shuffleArray } from '../lib/utils'
import { watchingTrial, ratingTrial, ratedTrial, blockSummary } from './taskTrial'
import jblockStart from '../trials/jblockStart'
import { blockTypeStart } from '../trials/experimentStart'

// const setImages = (blockSettings) => {
// 	if ( app ) {
// 		try {
// 			const patientID = jsPsych.data.get().select('patient_id').values[0]
// 			const localImagePath = path.join(app.getPath('desktop'), 'provocation-images', `${patientID}`)
// 			const neutralImagePath = path.join(localImagePath, 'neutral')
// 			const provokingImagePath = path.join(localImagePath, 'provoking')

// 			let neutralItems = fs.readdirSync(neutralImagePath)
// 			let provokingItems = fs.readdirSync(provokingImagePath)
// 			blockSettings.images.neutral = neutralItems.map( (image) => `file://` + path.join(neutralImagePath, image))
// 			blockSettings.images.provoking = provokingItems.map( (image) => `file://` + path.join(provokingImagePath, image))

// 			// check the number of loaded imaegs matches what is expected
// 			let numNeutral = blockSettings.images.neutral.length
// 			let numProvoking = blockSettings.images.provoking.length
// 			if ( numNeutral !=== numRequiredImages || numProvoking !== numRequiredImages) {
// 				ipcRenderer.send('error', `Number of images provided does not meet requirement.  Found ${numNeutral} neutral images and ${numProvoking} provoking images, the settings for this task requires ${numRequiredImages} of each type.`)
// 			}

// 			console.log(`Loaded images from ${localImagePath}`)
// 		} catch (error) {
// 			console.log("Error loading local files - using default images")
// 			ipcRenderer.send('error', `Could not load images from local device. - ${error}`)
// 		}
// 	}
// }

const emptyFun = () => {}

const taskSetUp = () => {

	const ratingorder = shuffleArray(["m", "f"])

	const ratedorder = shuffleArray([
		shuffleArray([{ gender: "f", majority: "acceptance" }, { gender: "f", majority: "rejection" }]),
		shuffleArray([{ gender: "m", majority: "acceptance" }, { gender: "m", majority: "rejection" }])
	])

	const rated_extra_level = {
		4: settings.impersonatorBlocks.rated[ratedorder[0][0].gender][ratedorder[0][0].majority],
		5: settings.impersonatorBlocks.rated[ratedorder[0][1].gender][ratedorder[0][1].majority],
		6: settings.impersonatorBlocks.rated[ratedorder[1][0].gender][ratedorder[1][0].majority],
		7: settings.impersonatorBlocks.rated[ratedorder[1][1].gender][ratedorder[1][1].majority]
	}

	// dict of arrays incl maybe raters, ratees, and scores
	const trialopts = {
		1: settings.impersonatorBlocks.watching,
		2: settings.impersonatorBlocks.rating[ratingorder[0]],
		3: settings.impersonatorBlocks.rating[ratingorder[1]],
		4: rated_extra_level[4].trial,
		5: rated_extra_level[5].trial,
		6: rated_extra_level[6].trial,
		7: rated_extra_level[7].trial
	}

	let addTasks = {
		type: 'html_keyboard_response',
		trial_duration: 1,
		stimulus: '',
		prompt: '',
		on_start: (trial) => {
			// setImages(blockSettings)
			// jsPsych.addNodeToEndOfTimeline(buildCountdown(lang.countdown.message, 3), () => {})
			// jsPsych.addNodeToEndOfTimeline(taskBlock(blockSettings), () => {})

			let i = 1;
			var taskTrial = watchingTrial
			while (i <= 7) {
				if (i === 1) { jsPsych.addNodeToEndOfTimeline(blockTypeStart('watching'), emptyFun) }
				else if (i === 2) { jsPsych.addNodeToEndOfTimeline(blockTypeStart('rating'), emptyFun) }
				else if (i === 4) { jsPsych.addNodeToEndOfTimeline(blockTypeStart('rated'), emptyFun) }

				if (i <= 3 && i >= 2) { taskTrial = ratingTrial }
				else if (i >= 4) { taskTrial = ratedTrial }
				jsPsych.addNodeToEndOfTimeline(jblockStart(i), emptyFun)
				trialopts[i].forEach(trialDict =>
					jsPsych.addNodeToEndOfTimeline(taskTrial(trialDict), emptyFun)
				)
				if (i >= 4) {
					const ratee_mean_score = rated_extra_level[i].summary.ratee_mean_score
					rated_extra_level[i].summary.raters.forEach(sum_info =>
						jsPsych.addNodeToEndOfTimeline(blockSummary(
							rated_extra_level[i].trial[sum_info.raters[0]], 
							rated_extra_level[i].trial[sum_info.raters[1]], 
							sum_info.num_watching,
							ratee_mean_score
						), emptyFun)
					)
					jsPsych.addNodeToEndOfTimeline(feelingScreens(), emptyFun)
				}
				i += 1
			}
			jsPsych.addNodeToEndOfTimeline(experimentEnd(5000), emptyFun)
		}
	}

	return {
		type: 'html_keyboard_response',
		// timeline: (AT_HOME) ? [addTasks] : [addTasks, startCode()]
		timeline: [addTasks]
	}
}

export default taskSetUp
