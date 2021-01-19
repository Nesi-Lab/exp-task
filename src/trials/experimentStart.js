import { baseStimulus } from '../lib/markup/stimuli'
import { settings } from '../config/main'

const introScreen = baseStimulus(`
    <div class='instructions'>
    <h1>${settings.introScreen.welcome} <b>${settings.introScreen.name}</b>.</h1>
    <h1>${settings.introScreen.description}</h1>
    </div>
    `, true)

const howItWorksScreen = baseStimulus(`
    <div class='instructions'>
    <h1 style="text-align:left">${settings.howItWorksScreen.title}</h1>
    <p style="text-align:left">${settings.howItWorksScreen.description1} <i>${settings.howItWorksScreen.description2}</i> ${settings.howItWorksScreen.description3}</p>
    <p style="text-align:left">${settings.howItWorksScreen.smDescription}</p>
    <p style="text-align:left">${settings.howItWorksScreen.impressionsDescription}</p>
    <p>${settings.howItWorksScreen.getStarted}</p>
    <br><br><br>
    </div>
    `, true)

const howItLooksScreen = baseStimulus(`
    <div class='instructions'>
    <h1 style="text-align:left">${settings.howItLooksScreen.title}</h1>
    <p style="text-align:left">${settings.howItLooksScreen.description1}</p>
    <p style="text-align:left">${settings.howItLooksScreen.description2}</p>
    <p style="text-align:left">${settings.howItLooksScreen.description3}</p>
    </div>
    `, true)

const getStartedScreen = baseStimulus(`
    <div class='instructions'>
    <h1 style="text-align:left">${settings.getStartedScreen.title}</h1>
    <p style="text-align:left">${settings.getStartedScreen.description1}</p>
    <p style="text-align:left">${settings.getStartedScreen.description2}</p>
    </div>
    `, true)

const watchingScreen = baseStimulus(`
  <div class='instructions'>
  <h1 style="text-align:left">Instruction screen (watching)</h1>
  </div>
  `, true)

const ratingScreen = baseStimulus(`
  <div class='instructions'>
  <h1 style="text-align:left">Instruction screen (rating)</h1>
  </div>
  `, true)

const ratedScreen = baseStimulus(`
  <div class='instructions'>
  <h1 style="text-align:left">Now it's your turn...</h1>
  <p style="text-align:left">You will be randomly paired with other connect users. Find out their first impressions of you!</p>
  </div>
  `, true)

const experimentStart = () => {
  return {
    type: 'instructions',
    show_clickable_nav: true,
    pages: [
      introScreen,
      howItWorksScreen
    ]
  }
}

const tutorial = () => {
  return {
    type: 'instructions',
    show_clickable_nav: true,
    pages: [
      howItLooksScreen,
      '<img src="https://i.ibb.co/23KZpQV/tut1.jpg"></img>',
      '<img src="https://i.ibb.co/Gk8p7K3/tut2.jpg"></img>',
      '<img src="https://i.ibb.co/Y8NP9fy/tut3.jpg"></img>',
      '<img src="https://i.ibb.co/mb5sndr/tut4.jpg"></img>',
      '<img src="https://i.ibb.co/zSVXf31/tut5.jpg"></img>',
      '<img src="https://i.ibb.co/4WX5VFv/tut6.jpg"></img>',
    ]
  }
}

const blockTypeStart = (block_type) => {
  let pgs = (block_type === "watching") ? [watchingScreen] : ((block_type === "rating") ? [ratingScreen] : [ratedScreen])
  return {
    type: 'instructions',
    show_clickable_nav: true,
    pages: pgs
  }
}

// at beginning of every block!!



export { experimentStart, tutorial, blockTypeStart }
