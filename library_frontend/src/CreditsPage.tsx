import React from 'react'
import styles from '@/style.css'

const CreditsPage: React.FC = () => (
  <div className={styles['pageContainer']}>
    <div className={`${styles['contentContainer']} ${styles['topMarginContainer']}`}>
      <div className={styles['content']}>
        <p>
          The images published in the library have been sourced online and each of them is linked directly to their
          source. This has been done in good faith and with the goal of presenting the widest variety of species and
          materials. However if you find that an image you produced was credited in a way that doesn’t satisfy you or
          you don’t want it to be used in the library, please let us know and we will remove the visual content.
        </p>
        <p>
          All the content of the library is freely accessible through a JSON API. This is still very much a work in
          progress so the access to the API or the way the data is presented can be subjected to changes.
        </p>
        <p>Contributions to the library have been made by: Eugenia Morpurgo, Naomi Galavotti.</p>
        <p>If you wish to contribute too please write to: eumorpurgo at gmail.com</p>
      </div>
    </div>
  </div>
)

export default CreditsPage
