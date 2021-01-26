// config/main.js
// This is the main configuration file where universal and default settings should be placed.
// These settins can then be imported anywhere in the app as they are exported at the botom of the file.

import requireContext from 'require-context.macro'

import impersonatorInfo from '../assets/impersonators.json'
import settingInfo from '../assets/settings.json'

import eyeImg from '../assets/src-images/eye.png'
import upThumbImg from '../assets/src-images/up_thumb.png'
import downThumbImg from '../assets/src-images/down_thumb.png'
import fbImg from '../assets/src-images/fb.png'
import igImg from '../assets/src-images/ig.png'
import scImg from '../assets/src-images/sc.png'
import ttImg from '../assets/src-images/tt.png'
import checkImg from '../assets/src-images/check.png'

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
	// const participantImage = genParticipantImage()
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
		participantImage: null
	}
}

let settings = genPeople()
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

settings = Object.assign({}, settings, settingInfo)

// get language file
const lang = require('../language/en_us.json')
const VIDEO =  (process.env.REACT_APP_VIDEO === 'true')

export { 
	settings, 
	lang,
	VIDEO
}