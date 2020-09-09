import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DatabaseExplorer from '@/DatabaseExplorer'
import LibrarySlider from '@/LibrarySlider'

const Library = (props) => {
  const [introPlayed, setIntroPlayed] = useState(true)
  const [hardinessValues, setValues] = useState(null)
  const [hardiness, setHardiness] = useState(3)

  const baseUrl = 'https://syntropic-api.hebus.net/api'

  useEffect(() => {
    const fetchValues = async () => {
     const response = await axios(`${baseUrl}/hardiness`)
     setValues(response.data)
    }
    fetchValues()
  }, [props])

  if (introPlayed) {
    return <DatabaseExplorer hardiness={hardiness} />
  } else {
    return <LibrarySlider hardinessValues={hardinessValues} onComplete={(hardiness) => {
      setHardiness(hardiness)
      setIntroPlayed(true)
    }} />
  }
}

export default Library
