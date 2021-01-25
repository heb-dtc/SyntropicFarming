import React, { useState } from 'react'
import FilterSelector from '@/FilterSelector' 
import { LibraryFilter, Filter } from '@/models'
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
    <p>
      For the moment this library uses the&nbsp;
      <a
        className={styles['inlineLink']}
        href="https://en.wikipedia.org/wiki/Hardiness_zone"
        target="_blank"
        rel="noreferrer"
      >
        hardiness zone
      </a>
      &nbsp;classification system.
    </p>
    <p>
      “A hardiness zone is a geographic area defined to encompass a certain range of climatic conditions relevant to
      plant growth and survival.”&nbsp;
    </p>
    <p>
      To find the hardiness zone number connected to you geographical area please visit&nbsp;
      <a className={styles['inlineLink']} href="https://www.plantmaps.com/index.php" target="_blank" rel="noreferrer">
        plantmaps.com
      </a>
    </p>
  </div>
)

const SlideFour: React.FC<SlideFourProps> = ({ filters, onChoose }) => (
  <div>
    <p>Select a filter mode and begin to explore the library</p>
    <p>
      <FilterSelector libraryFilters={filters} libFilterIndex={0} filterIndex={0} onChoose={onChoose} />
    </p>
  </div>
)

interface SlideFourProps {
  filters: Array<LibraryFilter>,
  onChoose: (filter: Filter) => void
}

const LibrarySlider: React.FC<LibSliderProps> = ({ filters, onComplete }) => {
  const [index, setIndex] = useState(0)
  const [filter, chooseFilter] = useState(null)

  let slide
  switch (index) {
    case 1:
      slide = <SlideTwo />
      break
    case 2:
      slide = <SlideThree />
      break
    case 3:
      slide = <SlideFour filters={filters} onChoose={(filter) => {
        chooseFilter(filter)
      }} />
      break
    case 0:
    default:
      slide = <SlideOne />
  }

  return (
    <div className={`${styles['sliderContainer']} ${styles['scrollContainer']}`}>
      <div
        className={
          index == 0 ? `${styles['sliderArrowContainer']} ${styles['hidden']}` : styles['sliderArrowContainer']
        }
      >
        <img
          className={styles['sliderArrow']}
          src={ArrowPrevious}
          alt="previous"
          onClick={() => {
            const newIndex = index - 1
            setIndex(newIndex)
          }}
        />
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
                  if (filter == null) {
                    onComplete(filters[0].filters[0])
                  } else {
                    onComplete(filter)
                  }
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
  filters: Array<LibraryFilter>
  onComplete: (filter: Filter) => void
}

export default LibrarySlider
