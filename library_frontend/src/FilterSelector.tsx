import React, { useState, useEffect } from 'react'
import styles from '@/style.css'
import { LibraryFilter, Filter } from '@/models'

const FilterSelector: React.FC<FilterSelectorProps> = ({ libraryFilters, libFilterIndex, filterIndex, onChoose }) => {
  const [currentLibFilter, setCurrentLibFilter] = useState(libFilterIndex)
  const [filters, setFilters] = useState([])
  const [currentFilterIndex, setCurrentFilterIndex] = useState(filterIndex)

  useEffect(() => {
    setFilters(libraryFilters[currentLibFilter].filters)
    setCurrentFilterIndex(0)
  }, [currentLibFilter])

  useEffect(() => {
    onChoose(libraryFilters[currentLibFilter].filters[currentFilterIndex])
  }, [currentFilterIndex])

  return (
    <div>
      <select className={styles['select']} onChange={e => {
          setCurrentLibFilter(parseInt(e.target.value, 10))
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
  libFilterIndex: number
  filterIndex: number
  onChoose: (filter: Filter) => void
}

export default FilterSelector
