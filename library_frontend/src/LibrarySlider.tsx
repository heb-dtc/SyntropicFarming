import React, { useState } from 'react'
import { Hardiness } from '@/models'
import styles from '@/style.css'
import ArrowNext from '@/assets/next_arrow.svg'
import ArrowPrevious from '@/assets/prev_arrow.svg'

const SlideOne = () => (
  <div>
    <p>In this section you can find the first iteration of the syntropic materials library.</p>
    <p> Here you will be able to browse through species and the materials they can be processed into.</p>
    <p> All entries are categorized and filterable by climatic zones.</p>
  </div>
)

const SlideTwo = () => (
  <div>
    <p>Your search begin with selecting a climatic zone of interest.</p>
    <p>
      At first all the species and materials recorded in the library for that specific climatic zone will be displayed.
    </p>
    <p>You will then be able to filter out materials or species that you dont find interesting by de-selecting them.</p>
  </div>
)

const SlideThree = () => (
  <div>
    <p>For the moment this library uses the hardiness zone classification system.</p>
    <p>
      “A hardiness zone is a geographic area defined to encompass a certain range of climatic conditions relevant to
      plant growth and survival.”&nbsp;
      <a href="https://en.wikipedia.org/wiki/Hardiness_zone" target="_blank" rel="noreferrer">
        https://en.wikipedia.org/wiki/Hardiness_zone
      </a>
    </p>
    <p>
      To find the hardiness zone number connected to you geographical area please visit&nbsp;
      <a href="https://www.plantmaps.com/index.php" target="_blank" rel="noreferrer">
        https://www.plantmaps.com
      </a>
    </p>
  </div>
)

const SlideFour: React.FC<SlideFourProps> = ({ hardinessValues, onChoose }) => (
  <div>
    <p>Select the hardiness zone of your interest and begin to explore the library</p>
    <p>
      Hardiness Zone /
      <select className={styles['select']} onChange={e => onChoose(parseInt(e.target.value, 10))}>
        <option value={0}>ALL</option>
        {hardinessValues.map(hardiness => (
          <option key={hardiness.id} value={hardiness.value}>
            {hardiness.value}
          </option>
        ))}
      </select>
    </p>
  </div>
)

interface SlideFourProps {
  hardinessValues: Array<Hardiness>
  onChoose: (hardiness: number) => void
}

const LibrarySlider: React.FC<LibSliderProps> = ({ hardinessValues, onComplete }) => {
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
    <div className={styles['sliderContainer']}>
      <div className={styles['sliderArrowContainer']}>
        {index > 0 && (
          <img
            className={styles['sliderArrow']}
            src={ArrowPrevious}
            alt="previous"
            onClick={() => {
              const newIndex = index - 1
              setIndex(newIndex)
            }}
          />
        )}
      </div>
      <div className={styles['sliderContent']}>{slide}</div>
      <div className={styles['sliderArrowContainer']}>
        <img
          className={styles['sliderArrow']}
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

interface LibSliderProps {
  hardinessValues: Array<Hardiness>
  onComplete: (hardiness: number) => void
}

export default LibrarySlider
