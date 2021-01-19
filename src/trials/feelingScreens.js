// const slider = (emotion) => {
//     return {
//     type: 'jspsych-html-slider-response',
//     // timeline: [
//         // {stimulus: '<p>' + emotion + '</p>'}
//     // ],
//     stimulus: '<p>' + emotion + '</p>',
//     labels: ['not at all', 'a lot'],
//     prompt: "<p>Here is a word that describes different feelings and emotions.</p><p>Please indicate how much you feel this way RIGHT NOW, in the present moment.</p><p>This information is totally private. Only the researchers will see your ratings.</p>"
// }
// }

const feelingsScreens = () => {
    const emotions = ['Joyful', 'Miserable', 'Cheerful', 'Mad', 'Afraid', 'Happy', 'Sad', 'Scared', 'Lively', 'Anxious', 'Embarrassed', 'Proud', 'Annoyed']
    // return emotions.map(slider)
    // return slider(emotions[0])
    return 1
}

export default feelingsScreens