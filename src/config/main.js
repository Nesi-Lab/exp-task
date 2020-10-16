// config/main.js
// This is the main configuration file where universal and default settings should be placed.
// These settins can then be imported anywhere in the app as they are exported at the botom of the file.

import { eventCodes } from './trigger'
import requireContext from 'require-context.macro'

import impersonatorInfo from '../assets/impersonators.json'

import eyeImg from '../assets/src-images/eye.png'
import upThumbImg from '../assets/src-images/up_thumb.png'
import downThumbImg from '../assets/src-images/down_thumb.png'
import fbImg from '../assets/src-images/fb.png'
import igImg from '../assets/src-images/ig.png'
import scImg from '../assets/src-images/sc.png'
import ttImg from '../assets/src-images/tt.png'
import checkImg from '../assets/src-images/check.png'
import loadingImg from '../assets/src-images/loading.gif'

const importAll = (r) => {
	return r.keys().map(r);
}

const genParticipantImage = () => {
	const participantImages = importAll(requireContext('../assets/participant-image', false, /\.(png|jpe?g|svg)$/))
	if (!(participantImages.length === 1)) { throw new Error("Wrong number of participant images") }
	return participantImages[0]
}

const genPeople = () => {
	// ASSUMING THAT DIRECTORY ORDER IS ALPHABETICAL
	const participantImage = genParticipantImage()
	const impersonatorImages = importAll(requireContext('../assets/impersonator-images', false, /\.(png|jpe?g|svg)$/))

	// transform dict of id --> details into a sorted list of lists
	let biosWithPhotos = []
	for (var key in impersonatorInfo.bios) {
		biosWithPhotos.push([key, impersonatorInfo.bios[key]])
	}
	biosWithPhotos.sort(function compare(kv1, kv2) { return kv1[0] - kv2[0] })

	// add image path to each in the list of lists
	if (!(biosWithPhotos.length === impersonatorImages.length)) { 
		throw new Error("Number of impersonator photos is not equal to number of bios in json")
	}
	biosWithPhotos.forEach((combinedInfo, index) => {
		combinedInfo[1]["img"] = impersonatorImages[index];
	});

	// transform list of lists back into dict
	const impersonatorInfoWithPhotos = Object.fromEntries(biosWithPhotos);

	return {
		impersonatorBlocks: impersonatorInfo.blocks,
		impersonatorInfo: impersonatorInfoWithPhotos,
		participantImage: participantImage
	}
}

const settings = genPeople()
settings.eye = eyeImg
settings.upThumb = upThumbImg
settings.downThumb = downThumbImg
settings.socials = {
	facebook: fbImg,
	instagram: igImg,
	snapchat: scImg,
	tiktok: ttImg
}
settings.check = checkImg
settings.loading = loadingImg
settings.taskName = "Experimental Task"
settings.canvasSize = 640
settings.fontFace = "px arial"
settings.bioFontSize = 18
settings.questionFontSize = 22
settings.watchingFontSize = 22
settings.xFontSize = 28

// get language file
const lang = require('../language/en_us.json')

export { 
	settings, 
	eventCodes,
	lang
}

// is this mechanical turk?
// const MTURK = (!jsPsych.turk.turkInfo().outsideTurk)
// const AT_HOME = (process.env.REACT_APP_AT_HOME === 'true')
// const VIDEO =  (process.env.REACT_APP_VIDEO === 'true')
// // console.log(VIDEO)

// const imageSettings = {
// 	width: 600,
// 	height: 600
// }

// // how many of each type of image are required if loading images from disk
// const numRequiredImages = 10

// // import images
// const importAll = (r) => {
//   return r.keys().map(r);
// }

// // audio codes
// const audioCodes = {
// 	frequency: 100*(eventCodes.open_provoc_task - 9),
// 	type: 'sine'
// }

// // UPDATE THIS PATH TO CHANGE IMAGE FOLDER
// const neutralImages = importAll(requireContext('../assets/images/provocation-images/neutral', false, /\.(png|jpe?g|svg)$/));
// const provokingImages = importAll(requireContext('../assets/images/provocation-images/provoking', false, /\.(png|jpe?g|svg)$/));

// const practiceImages = importAll(requireContext('../assets/images/practice-images/neutral', false, /\.(png|jpe?g|svg)$/));

// const audio = importAll(requireContext('../assets/audio', false, /\.(m4a|mp3)$/))

// const breathingAudio = _.filter(audio, (o) => o.includes(`breathing_exercise`))[0]

// // console.log(breathingAudio)

// const ratingSettings = {
// 	min: 1,
// 	max: 4,
// 	canvasSize: 640, // canvas is a square
// 	circleRadius: 28,
// 	cursorRadius: 7.5,
// 	eye: eyeImg,
// 	thumb: thumbImg
// }

// // get language file
// const lang = require('../language/en_us.json')
// if (MTURK) { // if this is mturk, merge in the mturk specific language
//   const mlang = require('../language/en_us.mturk.json')
// 	_.merge(lang, mlang)
// }

// const participantImages = importAll(requireContext('../assets/participant-image', false, /\.(png|jpe?g|svg)$/))
// if (!(participantImages.length == 1)) { throw "Wrong number of participant images" }
// const participantImage = participantImages[0]

// // ASSUMING THAT DIRECTORY ORDER IS ALPHABETICAL
// const impersonatorImages = importAll(requireContext('../assets/impersonator-images', false, /\.(png|jpe?g|svg)$/))

// // transform dict of id --> details into a sorted list of lists
// let biosWithPhotos = []
// for (var key in impersonatorInfo.bios) {
// 	biosWithPhotos.push([key, impersonatorInfo.bios[key]])
// }
// biosWithPhotos.sort(function compare(kv1, kv2) { return kv1[0] - kv2[0] })

// // add image path to each in the list of lists
// if (!(biosWithPhotos.length == impersonatorImages.length)) { 
// 	throw "Number of impersonator photos is not equal to number of bios in json"
// }
// biosWithPhotos.forEach((combinedInfo, index) => {
// 	combinedInfo[1]["img"] = impersonatorImages[index];
// });

// // transform list of lists back into dict
// const impersonatorInfoWithPhotos = Object.fromEntries(biosWithPhotos);

// const defaultBlockSettings = {
// 	impersonatorBlocks: impersonatorInfo.blocks,
// 	impersonatorInfo: impersonatorInfoWithPhotos,
// 	participantImage: participantImage
// }
// console.log("settings", defaultBlockSettings)
// console.log(eyeImg, thumbImg, participantImage, impersonatorInfoWithPhotos)

// const practiceBlockSettings = {
// 	images: {
// 		neutral: practiceImages,
// 		provoking: []
// 	},
// 	repeats_per_condition: 1, // number of times every condition is repeated
// 	is_practice: true
// }

// const taskName = "Provocation"

// export {
// 	imageSettings,
// 	numRequiredImages,
// 	ratingSettings,
// 	defaultBlockSettings,
// 	lang,
// 	eventCodes,
// 	MTURK,
// 	AT_HOME,
// 	VIDEO,
// 	practiceBlockSettings,
// 	importAll,
// 	breathingAudio,
// 	audioCodes,
// 	taskName
// }
