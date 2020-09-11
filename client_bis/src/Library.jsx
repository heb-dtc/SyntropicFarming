import React, { useState, useEffect } from 'react'
import {fetchHardinessValues} from '@/api'
import LibraryExplorer from '@/LibraryExplorer'
import LibrarySlider from '@/LibrarySlider'

const Library = (props) => {
  const [introPlayed, setIntroPlayed] = useState(false)
  const [hardinessValues, setValues] = useState(null)
  const [hardiness, setHardiness] = useState(0)

  useEffect(() => {
    const fetchValues = async () => {
     const hardinessValues = await fetchHardinessValues()
     setValues(hardinessValues)
    }
    fetchValues()
  }, [props])

  if (introPlayed) {
    return <LibraryExplorer hardinessValues={hardinessValues} hardiness={hardiness} onChangeHardiness={
      (value) => setHardiness(value)}/>
  } else {
    return <LibrarySlider hardinessValues={hardinessValues} onComplete={(hardiness) => {
      setHardiness(hardiness)
      setIntroPlayed(true)
    }} />
  }
}

export default Library
