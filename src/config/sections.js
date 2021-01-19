import requireContext from 'require-context.macro'
import impersonatorProfiles from '../assets/impersonatorProfiles.json'
import trialData from '../assets/trialData.json'

import { shuffleArray } from '../lib/utils'
import feelingScreen from '../trials/feelingScreen'
import { summaryScreen } from '../trials/summaryScreen'

const importAll = (r) => {
	return r.keys().map(r);
}

const genProfiles = () => {
    // ASSUMING THAT DIRECTORY ORDER IS ALPHABETICAL
    const participantImages = importAll(requireContext('../assets/participant-image', false, /\.(png|jpe?g|svg)$/))
	const participantImage = participantImages[0]
	const impersonatorImages = importAll(requireContext('../assets/impersonator-images', false, /\.(png|jpe?g|svg)$/))

	// transform dict of id --> details into a sorted list of lists
	let profiles = []
	for (var key in impersonatorProfiles) {
		profiles.push([key, impersonatorProfiles[key]])
	}
	profiles.sort(function compare(kv1, kv2) { return kv1[0] - kv2[0] })

	// add image path to each in the list of lists
	profiles.forEach((profile, index) => {
		profile[1]["img"] = impersonatorImages[index];
	});

	// transform list of lists back into dict
	profiles = Object.fromEntries(profiles);

	return profiles
}

const addToTL = (screens) => { jsPsych.addNodeToEndOfTimeline(screens, () => {}) }

const populateImpersonators = (profiles, info) => {
    if ('rater' in info) {
        info.rater = profiles[info.rater]
    }
    if ('ratee' in info) {
        info.ratee = profiles[info.ratee]
    }
    return info
}

const watching = (profiles) => {
    addToTL(sectionInstructions('watching'))
    trialData.watching.forEach(info => 
        addToTL(rateScreen(populateImpersonators(profiles, info)))
    )
    addToTL(feelingScreen())
}

const rating = (profiles) => {
    addToTL(sectionInstructions('rating'))
    const data = trialData.rating
    const order = shuffleArray(["m", "f"])
    const blocks = [order[0], order[1]].map(t => data[t])
    for (const b of blocks) {
        b.forEach(t => 
            addToTL(rateScreen(populateImpersonators(profiles, t)))
        )
        addToTL(feelingScreen())
    }
}

const rated = (profiles) => {
    addToTL(sectionInstructions('rated'))
    const data = trialData.rated
    const order = shuffleArray([
		shuffleArray([
            { gender: "f", majority: "acceptance" }, 
            { gender: "f", majority: "rejection" }]),
		shuffleArray([
            { gender: "m", majority: "acceptance" }, 
            { gender: "m", majority: "rejection" }])
    ])
    const blocks = [order[0][0], order[0][1], order[1][0], order[1][1]].map(
        t => data[t.gender][t.majority]
    )
    for (const b of blocks) {
        for (let t of b.trial) {
            t = populateImpersonators(profiles, t)
            addToTL(rateScreen(t))
            addToTL(interpretationScreen(t))
        }
        b.summary.raters.forEach(t => addToTL(summaryScreen(
                b.trial[t.raters[0]],
                b.trial[t.raters[1]],
                t.n,
                b.summary.rateeMeanScore
        )))
        addToTL(feelingScreen())
    }
}

const sections = () => {
    return {
        type: 'html_keyboard_response',
        timeline: [{
            type: 'html_keyboard_response',
            on_start: (_) => {          
                const profiles = genProfiles()
                watching(profiles)
                rating(profiles)
                rated(profiles)
            }
        }]
    }
}

export default sections