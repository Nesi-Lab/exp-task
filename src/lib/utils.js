import { jsPsych } from 'jspsych-react'

// shuffle the items in an array randomly
const shuffleArray = (array) => {
  let currentIndex = array.length
  let temporaryValue, randomIndex
  // While there remain elements to shuffle
  while (0 !== currentIndex) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    // And swap it with the current element
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

const getUserId = (data) => {
  const participantId = JSON.parse(data.responses)['Q0']
  jsPsych.data.addProperties({participant_id: participantId, timestamp: Date.now()})
  console.log("id", participantId)
}

const getUserBio = (data) => {
  const participantName = JSON.parse(data.responses)['Q0']
  const participantTown = JSON.parse(data.responses)['Q1']
  const participantBio = JSON.parse(data.responses)['Q2']
  jsPsych.data.addProperties({participant_name: participantName, timestamp: Date.now()})
  jsPsych.data.addProperties({participant_town: participantTown, timestamp: Date.now()})
  jsPsych.data.addProperties({participant_bio: participantBio, timestamp: Date.now()})
  console.log("name", participantName)
  console.log("town", participantTown)
  console.log("bio", participantBio)
}

export {
  shuffleArray,
  getUserId,
  getUserBio
}
