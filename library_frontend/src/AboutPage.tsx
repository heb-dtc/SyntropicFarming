import React from 'react'
import styles from '@/style.css'

const AboutPage: React.FC = () => (
  <div className={styles['pageContainer']}>
    <div className={`${styles['contentContainer']} ${styles['topMarginContainer']}`}>
      <div className={styles['content']}>
        <p>
          Syntropic Materials is a long term research project initiated by{' '}
          <a href="http://www.eumo.it" target="_blank" rel="noreferrer">
            Eugenia Morpurgo
          </a>{' '}
          in September 2019 during the Tiffany & Co. Italian Fellowship at the&nbsp;
          <a href="https://www.aarome.org/home" target="_blank" rel="noreferrer">
            American Academy in Rome
          </a>{' '}
          and for the moment is planned to continue thanks to a Fellowship at the
          <a href="https://www.akademie-solitude.de/en/" target="_blank" rel="noreferrer">
            {' '}
            Akademie Schloss Solitude
          </a>{' '}
          from November 2020 until April 2021.
        </p>
        <p>Programming by Florent Noel <br/>
        To see the source code of this library go to <a href="https://github.com/heb-dtc/SyntropicFarming/">https://github.com/heb-dtc/SyntropicFarming/</a></p>
        <p>Contact: eumorpurgo at gmail.com</p>
        <p>Thanks to: Fiori Berhane, Naomi Galavotti and Sophia Guggenberger.</p>
      </div>
    </div>
  </div>
)

export default AboutPage
