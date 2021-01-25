import React, { useState, useEffect } from 'react'
import { fetchLibraryFilters } from '@/api'
import LibraryExplorer from '@/LibraryExplorer'
import LibrarySlider from '@/LibrarySlider'
import { LibraryFilter, FilterType } from '@/models'

const LibraryPage: React.FC = () => {
  const [introPlayed, setIntroPlayed] = useState(false)
  const [filters, setFilters] = useState([])
  const [libFiltersIndex, setLibFiltersIndex] = useState(0)
  const [filterIndex, setFilterIndex] = useState(0)
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
        selectedFilterIndex={filterIndex}
        libFiltersIndex={libFiltersIndex}
        onFilterChange={(libFiltersIndex, filter, index) => {
          setFilter(filter) 
          setLibFiltersIndex(libFiltersIndex)
          setFilterIndex(filterIndex)
        }}
      />
    )
  }
  return (
    <LibrarySlider
      filters={filters}
      onComplete={(libFiltersIndex, selectedFilter, selectedFilterIndex) => {
        setFilter(selectedFilter)
        setFilterIndex(selectedFilterIndex)
        setLibFiltersIndex(libFiltersIndex)
        setIntroPlayed(true)
      }}
    />
  )
}

export default LibraryPage
