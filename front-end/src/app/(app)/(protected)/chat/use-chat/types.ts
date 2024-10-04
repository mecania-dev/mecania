export type BaseQuestion = {
  text: string
  answer?: string
}

export type OptionsQuestion = BaseQuestion & {
  options: {
    text: string
    followUp?: string | Question
    end?: boolean
  }[]
  type: 'options'
}

export type TextQuestion = BaseQuestion & {
  followUp?: string | Question
  type: 'text'
}

export type Question = OptionsQuestion | TextQuestion
