import { getUserBio } from '../lib/utils'

const bio = () => {
    return {
        type: 'survey_text',
        //   show_clickable_nav: true,
        questions: [
            {prompt: "Please enter your first and last name...", rows: 1, columns: 40},
            {prompt: "Please enter your town in RI...", rows: 1, columns: 40},
            {prompt: "Please create your bio...", rows: 3, columns: 40}
        ],
        on_finish: (data) => {
            getUserBio(data)
        }
    }
}

export default bio