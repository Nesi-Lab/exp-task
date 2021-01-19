import { getUserId } from '../lib/utils'

const id = () => {
    return {
        type: 'survey_text',
        questions: [
            {prompt: "Participant ID:", rows: 1, columns: 40}
        ],
        on_finish: (data) => {
            getUserId(data)
        }
    }
}

export default id