import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styles from '@/style.css'
import ArrowNext from '@/assets/next_arrow.svg'
import ArrowPrevious from '@/assets/prev_arrow.svg'

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
      this database use the hardiness zone classification system. To know more about this classification and to find
      your hardiness number please visit&nbsp;
      <a href="https://www.plantmaps.com/index.php" target="_blank" rel="noreferrer">
        https://www.plantmaps.com
      </a>
    </p>
    <p>
      To learn more about the hardiness zones classification system go to &nbsp;
      <a href="https://en.wikipedia.org/wiki/Hardiness_zone" target="_blank" rel="noreferrer">
        https://en.wikipedia.org/wiki/Hardiness_zone
      </a>
    </p>
  </div>
)

const SlideFour = ({ hardinessValues, onChoose }) => (
  <div>
    <p>select the hardiness zone of your interest and begin to explore the library</p>
    <p>
      Hardiness Zone /
      <select className={styles.select} onChange={e => onChoose(e.target.value)}>
        <option value={0}>All</option>
        {hardinessValues.map(hardiness => (
          <option key={hardiness.id} value={hardiness.value}>
            {hardiness.value}
          </option>
        ))}
      </select>
    </p>
  </div>
)

SlideFour.propTypes = {
  hardinessValues: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChoose: PropTypes.func.isRequired,
}

const LibrarySlider = ({ hardinessValues, onComplete }) => {
  const [index, setIndex] = useState(0)
  const [hardiness, chooseHardiness] = useState(0)

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
    <div className={styles.sliderContainer}>
      <div className={styles.sliderArrowContainer}>
        {index > 0 && (
          <img
            class={styles.sliderArrow}
            src={ArrowPrevious}
            alt="previous"
            onClick={() => {
              const newIndex = index - 1
              setIndex(newIndex)
            }}
          />
        )}
      </div>
      <div className={styles.sliderContent}>{slide}</div>
      <div className={styles.sliderArrowContainer}>
        <img
          class={styles.sliderArrow}
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

LibrarySlider.propTypes = {
  hardinessValues: PropTypes.arrayOf(PropTypes.number).isRequired,
  onComplete: PropTypes.func.isRequired,
}

export default LibrarySlider
