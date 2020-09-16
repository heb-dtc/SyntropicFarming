import React, { useState, useEffect } from 'react'
import { fetchHardinessValues } from '@/api'
import LibraryExplorer from '@/LibraryExplorer'
import LibrarySlider from '@/LibrarySlider'
import { Hardiness } from '@/models'

const Library = (props) => {
  const [introPlayed, setIntroPlayed] = useState(false)
  const [hardinessValues, setValues] = useState(null)
  const [hardiness, setHardiness] = useState(0)

  useEffect(() => {
    const fetchValues = async () => {
      const values: Array<Hardiness> = await fetchHardinessValues()
      setValues(values)
    }
    fetchValues()
  }, [props])

  if (introPlayed) {
    return (
      <LibraryExplorer
        hardinessValues={hardinessValues}
        hardiness={hardiness}
        onChangeHardiness={(value) => setHardiness(value)}
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

export default Library
