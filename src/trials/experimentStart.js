import { baseStimulus } from '../lib/markup/stimuli'

const introScreen = baseStimulus(`
    <div class='instructions'>
    <h1>Welcome to <b>Connect</b>.</h1>
    <h1>Connect is a game about how people form first impressions online.</h1>
    </div>
    `, true)

const howItWorksScreen = baseStimulus(`
    <div class='instructions'>
    <h1 style="text-align:left">Here's how it works...</h1>
    <p style="text-align:left">Connect is a live simulation game. People are participating <i>right now</i> at multiple sites throughout Rhode Island.</p>
    <p style="text-align:left">Connect will search your Instagram, Snapchat, and Facebook networks to see if anyone you know is participating right now.</p>
    <p style="text-align:left">On Connect, you will give your first impressions of other people and they will give their first impressions of you.</p>
    <p>Let’s get started!</p>
    </div>
    `, true)

const getStartedScreen = baseStimulus(`
    <div class='instructions'>
    <h1 style="text-align:left">Let's get started!</h1>
    <p style="text-align:left">You will be paired with the Connect users you selected.</p>
    <p style="text-align:left">Please give your first impressions by rating how much you think you'd like to be friends with each person.</p>
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
      howItWorksScreen,
    ]
  }
}

const blockTypeStart = (block_type) => {
  let pgs = (block_type === "watching") ? [getStartedScreen, watchingScreen] : ((block_type === "rating") ? [ratingScreen] : [ratedScreen])
  return {
    type: 'instructions',
    show_clickable_nav: true,
    pages: pgs
  }
}

// at beginning of every block!!



export { experimentStart, blockTypeStart }
