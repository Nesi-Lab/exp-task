import { getUserId } from '../lib/utils'

const id = () => {
    return {
        type: 'survey_text',
        //   show_clickable_nav: true,
        questions: [
            {prompt: "Participant ID:", rows: 1, columns: 40}
        ],
        on_finish: (data) => {
            getUserId(data)
        }
    }
}

export default id