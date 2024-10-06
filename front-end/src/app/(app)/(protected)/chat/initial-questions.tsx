import { SelectableButton } from '@/components/button'

import { Question, useChat } from './use-chat'

export function InitialQuestions() {
  const { chat, vehicle, initialQuestions, answerQuestion, getCurrentQuestion } = useChat()
  const { index, isAllAnswered } = getCurrentQuestion()
  if ((chat && !isAllAnswered) || !vehicle) return null

  function handleSelectOption(question: Question) {
    answerQuestion(index, question)
  }

  return initialQuestions.map((q, i) =>
    i <= index ? (
      <DisplayQuestion question={q} onSelectOption={handleSelectOption} disableAnimation={!!chat} key={i} />
    ) : null
  )
}

interface QuestionProps {
  question: Question
  onSelectOption: (question: Question) => void
  disableAnimation?: boolean
}

function DisplayQuestion({ question, onSelectOption, disableAnimation }: QuestionProps) {
  const selectedOption =
    question.type === 'options' ? question.options.find(o => o.text === question.answer) : undefined

  const handleSelectOption = (option: string) => () => {
    onSelectOption({ ...question, answer: option })
  }

  return (
    <>
      <div data-animation={!disableAnimation} className="data-[animation=true]:animate-appearance-in">
        <h2 className="mb-4 text-large font-semibold">{question.text}</h2>
        {/* Render text questions with input field */}
        {question.answer && question.type === 'text' && (
          <p className="mb-4 break-all">
            <span className="mr-2 font-bold">Sua resposta:</span>
            <span className="font-semibold italic text-default-500">{question.answer}</span>
          </p>
        )}
        {question.answer && question.type === 'text' && typeof question.followUp === 'string' && (
          <h2 className="!my-8 text-medium font-semibold italic text-secondary">{question.followUp}</h2>
        )}
        {question.answer && question.type === 'text' && typeof question.followUp === 'object' && (
          <DisplayQuestion question={question.followUp} onSelectOption={onSelectOption} />
        )}
        {/* Render multiple-choice questions with selectable options */}
        {question.type === 'options' && (
          <div className="flex flex-wrap gap-3">
            {question.options.map((option, j) => (
              <SelectableButton
                isSelected={question.answer === option.text}
                onPress={handleSelectOption(option.text)}
                key={`${option.text}-${j}`}
              >
                {option.text}
              </SelectableButton>
            ))}
          </div>
        )}
      </div>
      {selectedOption && typeof selectedOption.followUp === 'string' && (
        <h2 className="!my-8 text-medium font-semibold italic text-secondary">{selectedOption.followUp}</h2>
      )}
      {selectedOption && typeof selectedOption.followUp === 'object' && (
        <DisplayQuestion question={selectedOption.followUp} onSelectOption={onSelectOption} />
      )}
    </>
  )
}
