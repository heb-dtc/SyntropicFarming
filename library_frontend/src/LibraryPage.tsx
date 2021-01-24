import React, { useState, useEffect } from 'react'
import { fetchLibraryFilters } from '@/api'
import LibraryExplorer from '@/LibraryExplorer'
import LibrarySlider from '@/LibrarySlider'
import { Hardiness, FilterType } from '@/models'

const LibraryPage: React.FC = () => {
  const [introPlayed, setIntroPlayed] = useState(false)
  const [hardinessValues, setValues] = useState(null)
  const [hardiness, setHardiness] = useState(0)

  useEffect(() => {
    const fetchValues = async () => {
      const values: Array<Hardiness> = await fetchLibraryFilters(FilterType.HARDINESS)
      setValues(values)
    }
    fetchValues()
  }, [])

  if (introPlayed) {
    return (
      <LibraryExplorer
        availableValues={hardinessValues}
        value={hardiness}
        onValueChange={(value) => setHardiness(value)}
      />
    )
  }
  return (
    <LibrarySlider
      hardinessValues={hardinessValues}
      onComplete={(selectedHardiness) => {
        setHardiness(selectedHardiness)
        setIntroPlayed(true)
      }}
    />
  )
}

export default LibraryPage
