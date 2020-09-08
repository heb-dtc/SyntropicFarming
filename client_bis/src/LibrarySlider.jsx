import React, { useState } from 'react'
import styles from '@/style.css'
import ArrowNext from '../assets/next_arrow.svg'
import ArrowPrevious from '../assets/prev_arrow.svg'

const SlideOne = () => (
  <div>
    <p>
      welcome on syntropic materials library here you will be able to discover species and the materials they can be
      processed into.
    </p>
    <p> your exploration will be filtered by selecting a climatic zone of interest</p>
  </div>
)

const SlideTwo = () => (
  <div>
    <p>
      when your search will begin you’ll be exposed to all the species and materials recorded in the library which grows
      in your selected climatic zone.
    </p>
  </div>
)

const SlideThree = () => (
  <div>
    <p>your exploration will begin by selecting a climatic zone of interest </p>
    <p>
      every time you will want to restart your research just press CLEAR RESEARCH and you’ll come back to this dialogue
      menu.
    </p>
  </div>
)

const SlideFour = ({ hardinessValues, onChoose }) => (
  <div>
    <p>select the hardiness zone of your interest and begin to explore the library</p>
    <p>
      Hardiness Zone /
      <select onChange={e => onChoose(e.target.value)}>
        <option value="-1">All</option>
        {hardinessValues.map(hardiness => (
          <option key={hardiness.id} value={hardiness.value}>
            {hardiness.value}
          </option>
        ))}
      </select>
    </p>
  </div>
)

const LibrarySlider = ({ hardinessValues, onComplete }) => {
  const [index, setIndex] = useState(0)
  const [hardiness, chooseHardiness] = useState(-1)

  let slide
  switch (index) {
    case 1:
      slide = <SlideTwo />
      break
    case 2:
      slide = <SlideThree />
      break
    case 3:
      slide = <SlideFour hardinessValues={hardinessValues} onChoose={value => chooseHardiness(value)} />
      break
    case 0:
    default:
      slide = <SlideOne />
  }

  return (
    <div className={styles.introContainer}>
      <div className={styles.introAsideLeft}>
        {index > 0 && (
          <img
            src={ArrowPrevious}
            alt="previous"
            onClick={() => {
              const newIndex = index - 1
              setIndex(newIndex)
            }}
          />
        )}
      </div>
      <div className={styles.introMain}>{slide}</div>
      <div className={styles.introAsideRight}>
        <img
          src={ArrowNext}
          alt="next"
          onClick={() => {
            const newIndex = index + 1
            if (newIndex === 4) {
              onComplete(hardiness)
            } else {
              setIndex(newIndex)
            }
          }}
        />
      </div>
    </div>
  )
}

export default LibrarySlider
