import React, { useState, useEffect } from 'react'
import styles from '@/style.css'
import { LibraryFilter, Filter } from '@/models'

const FilterSelector: React.FC<FilterSelectorProps> = ({ libraryFilters, libFiltersIndex, filterIndex, onChoose }) => {
  const [currentLibFilter, setCurrentLibFilter] = useState(libFiltersIndex)
  const [filters, setFilters] = useState([])
  const [currentFilterIndex, setCurrentFilterIndex] = useState(filterIndex)

  useEffect(() => {
    setFilters(libraryFilters[currentLibFilter].filters)
  }, [currentLibFilter])

  useEffect(() => {
    onChoose(currentLibFilter, libraryFilters[currentLibFilter].filters[currentFilterIndex], currentFilterIndex)
  })

  return (
    <div>
      <select className={styles['select']} value={currentLibFilter} onChange={e => {
          setCurrentLibFilter(parseInt(e.target.value, 10))
          //when switching the lib filters we want to display the first filter item
          setCurrentFilterIndex(0)
        }} >
        {libraryFilters.map((filter,index) => (
          <option key={index} value={index}>
            {filter.name}
          </option>
        ))}
      </select>
      /
      <select className={styles['select']} value={currentFilterIndex} onChange={e => {
        setCurrentFilterIndex(parseInt(e.target.value, 10))
      }}>
        {filters.map((filter,index) => (
          <option key={filter.id} value={index}>
            {filter.value}
          </option>
        ))}
      </select>
      </div>
  )
}

interface FilterSelectorProps {
  libraryFilters: Array<LibraryFilter>
  libFiltersIndex: number
  filterIndex: number
  onChoose: (libFiltersIndex:number, filter: Filter, index: number) => void
}

export default FilterSelector
