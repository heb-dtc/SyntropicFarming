import React from 'react'
import styles from './style.css'

const LandingPage = () => (
  <div className={styles.container}>
    <div className={styles.column}>
      <p>Why?</p>
      <p>
        In response to looming “climate catastrophe”, designers have increasingly sought out sustainable alternatives to
        oil-based materials and in order to not steal land from food production, agriculture leftovers have become prime
        resources for new material development.
      </p>
      <p>
        From threads made with orange peels, to insulation boards made with sunflower stems, to fake leather made with
        grapes and apples peels and pineapple leaves. Just to mention a few.
      </p>
      <p>
        {' '}
        These researches have led to the creation of an ever growing landscape of natural materials which are strongly
        based on local bio regional economies, addressing the end of materials life-cycles but still relying on
        agricultural industrial monocultural systems, with the environmental consequences that this implies.
      </p>
    </div>
    <div className={styles.column}>
      <p>What?</p>
      <p>
        It’s with this awareness that the project Syntropic Material attempt to design regenerative production processes
        for traditional and innovative plant/animal based materials using agricultural leftovers from regenerative,
        polycultural, agroforestal agriculture.
      </p>
      <p>
        Investigating if this great innovation in the field of materials can open new possibilities for the development
        of polycultures, and vice versa, if the choices taken in designing polycultures can define new directions in new
        materials development.
      </p>
      <p>
        With the objective of shifting natural material production process from an extractive, monocultural, entropic
        one to a nurturing, polycultural syntropic one.
      </p>
    </div>
    <div className={styles.column}>
      <p>How?</p>
      <p>
        The project intend to be rooted on an intellectual polyculture instead of relying on the intellectual
        monoculture of western science. Learning from and engaging with the existing discourse which attempt to bring
        together the wisdom of traditional indegenous environmental practices with the tools of western science to solve
        the most pressing environmental problems.
      </p>
      <p>
        {' '}
        Syntropic Materials is a self initiated long term research, which take shape through different experiences. It
        started thanks to a residency period at the American Academy in Rome from September until December 2019, and
        will continue for all 2020 through a series of workshops and an exhibition which will address specific case
        studies, and a six months residency at Akademie Schloss Solitude from November 2020.
      </p>
    </div>
  </div>
)

export default LandingPage
