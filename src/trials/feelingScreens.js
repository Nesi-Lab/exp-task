const emotions = ['Joyful', 'Miserable', 'Cheerful', 'Mad', 'Afraid', 'Happy', 'Sad', 'Scared', 'Lively', 'Anxious', 'Embarrassed', 'Proud', 'Annoyed']
const prompt = "<p>Here is a word that describes different feelings and emotions.</p><p>Please indicate how much you feel this way RIGHT NOW, in the present moment.</p><p>This information is totally private. Only the researchers will see your ratings.</p><br><br>"


const feelingsScreens = () => {
    return {
        type: 'html_slider_response',
        slider_width: parseInt(document.body.clientWidth * 0.7),
        timeline: emotions.map(em => { return { stimulus: prompt + '<h1>' + em + '</h1>' } }),
        // stimulus: '<p>' + emotion + '</p>',
        labels: ['not at all', 'a lot'],
    }
}

export default feelingsScreens