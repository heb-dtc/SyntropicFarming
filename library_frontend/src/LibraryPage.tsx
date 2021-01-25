import React, { useState, useEffect } from 'react'
import { fetchLibraryFilters } from '@/api'
import LibraryExplorer from '@/LibraryExplorer'
import LibrarySlider from '@/LibrarySlider'
import { LibraryFilter, FilterType } from '@/models'

const LibraryPage: React.FC = () => {
  const [introPlayed, setIntroPlayed] = useState(false)
  const [filters, setFilters] = useState([])
  const [currentFilterIndex, setCurrentFilterIndex] = useState(0)
  const [filter, setFilter] = useState(null)

  useEffect(() => {
    const fetchValues = async () => {
      const filters: Array<LibraryFilter> = await fetchLibraryFilters()
      setFilters(filters)
    }
    fetchValues()
  }, [])

  if (introPlayed) {
    return (
      <LibraryExplorer
        filters={filters}
        selectedFilter={filter}
        onFilterChange={(value) => setFilter(value)}
      />
    )
  }
  return (
    <LibrarySlider
      filters={filters}
      onComplete={(selectedFilter) => {
        setFilter(selectedFilter)
        setIntroPlayed(true)
      }}
    />
  )
}

export default LibraryPage
