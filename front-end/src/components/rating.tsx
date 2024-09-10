import { FaStar, FaStarHalfAlt } from 'react-icons/fa'

import { useControlledState } from '@/hooks/use-controlled-state'
import { tv, VariantProps } from '@nextui-org/react'
import { range } from 'lodash'

interface RatingProps extends VariantProps<typeof ratingClasses> {
  rating?: number
  onRatingChange?: (rating: number) => void
  isDisabled?: boolean
}

const ratingClasses = tv({
  slots: {
    base: 'flex items-center',
    label: '',
    star: 'cursor-pointer transition-colors duration-500 hover:scale-110 active:scale-95'
  },
  variants: {
    labelPosition: {
      right: { label: 'ml-1' },
      left: { label: 'mr-1' }
    },
    hideLabel: {
      true: { label: 'hidden' },
      false: {}
    }
  },
  defaultVariants: {
    labelPosition: 'left',
    hideLabel: false
  }
})

export function Rating({
  rating: controlledRating,
  onRatingChange,
  labelPosition = 'left',
  hideLabel,
  isDisabled
}: RatingProps) {
  const [rating, setRating] = useControlledState(controlledRating, 0, onRatingChange)
  const roundedRating = Math.round(rating * 2) / 2
  const { base, label, star } = ratingClasses({ labelPosition, hideLabel })

  const handleRatingChange = (newRating: number) => () => {
    if (isDisabled) return
    setRating(newRating)
  }

  return (
    <div className={base()}>
      {labelPosition === 'left' && <p className={label()}>{roundedRating}</p>}
      {range(1, 6).map(ratingValue => {
        const isCompleted = ratingValue <= roundedRating
        const isHalf = ratingValue - 0.5 === roundedRating
        const isSame = Math.round(roundedRating) === ratingValue
        const Star = isCompleted ? FaStar : isHalf ? FaStarHalfAlt : FaStar

        return (
          <Star
            className={star({ class: [isCompleted || isHalf ? 'text-yellow-500' : 'text-default-500'] })}
            onClick={handleRatingChange(isSame ? 0 : ratingValue)}
            key={ratingValue}
          />
        )
      })}
      {labelPosition === 'right' && <p className={label()}>{roundedRating}</p>}
    </div>
  )
}
