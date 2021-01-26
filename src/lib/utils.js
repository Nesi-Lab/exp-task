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
  jsPsych.data.addProperties({ participant_id: participantId, timestamp: Date.now() })
  console.log("id", participantId)
}

const getUserBio = (data) => {
  const participantTown = JSON.parse(data.responses)['Q0']
  const participantActivity = JSON.parse(data.responses)['Q1']
  jsPsych.data.addProperties({ participant_town: participantTown, timestamp: Date.now() })
  jsPsych.data.addProperties({ participant_activity: participantActivity, timestamp: Date.now() })
  console.log("town", participantTown)
  console.log("activity", participantActivity)
}

const findData = (name) => {
  console.log(jsPsych.data.get().values())
  for (const [k, v] of Object.entries(jsPsych.data.get().values())) {
    if ('value' in v) {
      if (name in v.value) {
        return v.value[name]
      }
    }
  }
}

const findData2 = (name) => {
  for (const [k, v] of Object.entries(jsPsych.data.get().values())) {
    if (name in v) {
      return v[name]
    }
  }
}

export {
  shuffleArray,
  getUserId,
  getUserBio,
  findData,
  findData2
}
