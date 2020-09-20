import React, { useState } from 'react'
import styles from '@/style.css'
import Milpa from '@/assets/01.png'
import Materials from '@/assets/02.png'
import Color from '@/assets/03.png'
import Paper from '@/assets/04.png'
import ParticleBoard from '@/assets/05.png'
import Plastic from '@/assets/06.png'
import Textile from '@/assets/07.png'
import Timber from '@/assets/08.png'
import Veneer from '@/assets/09.png'

const Polyculture = () => {
  const [image, setImage] = useState(Milpa)

  return (
    <div className={styles['polyculturePageContainer']}>
      <div className={styles['contentHeader']}>
        <p>
          In this section you can find a selection of analysis of polycultural agroecosystems and the materials they
          potentially can produce.
        </p>
      </div>
      <div className={styles['polycultureContentContainerCol']}>
        <div className={styles['polycultureMenu']}>
          <div className={styles['polycultureMenuItem']} onClick={() => setImage(Milpa)}>
            MayaForestGarden
          </div>
          <div className={styles['polycultureMenuItem']} onClick={() => setImage(Materials)}>
            Materials
          </div>
          <div className={styles['polycultureMenuItem']} onClick={() => setImage(Color)}>
            Color
          </div>
          <div className={styles['polycultureMenuItem']} onClick={() => setImage(Paper)}>
            Paper
          </div>
          <div className={styles['polycultureMenuItem']} onClick={() => setImage(ParticleBoard)}>
            ParticleBoard
          </div>
          <div className={styles['polycultureMenuItem']} onClick={() => setImage(Plastic)}>
            Plastic
          </div>
          <div className={styles['polycultureMenuItem']} onClick={() => setImage(Textile)}>
            Textile
          </div>
          <div className={styles['polycultureMenuItem']} onClick={() => setImage(Timber)}>
            Timber
          </div>
          <div className={styles['polycultureMenuItem']} onClick={() => setImage(Veneer)}>
            Veneer
          </div>
        </div>
        <img className={styles['polycultureImg']} src={image} />
        <div className={styles['polycultureTextContent']}>
          <h3>Maya Forest Garden - The Milpa cycle</h3>
          <p>
            “Domesticated crops and useful weedy herbs are cultivated annually over approximately four years, while
            woody shrubs, fruit trees, and hardwoods sprout and grow in the shade of the tall maize, progressing toward
            the next stage in the cycle. Some perennial crops are established at this time as well. When the woody
            shrubs ans trees have grown enough to shade annuals, the field advances through successive stages of guided
            reforestation, transforming from an open field into a managed forest (Everton 2012:16-18; Hernàndez
            Xolocotzi et al. 1995:131-139; Livi Tacher and Golicher 2004) “
          </p>
          <p>
            <i>
              From The Maya Forest Garden. Eight millennia of sustainable Cultivation of the tropical woodlands. Anabel
              Ford and Ronald Nigh - 2016 Routledge
            </i>
          </p>
          <p>
            The Maya Forest Garden is the traditional Maya orchid plot that evolves from the milpa, a traditional
            Mesoamerican and Maya agricultural field that employs a system of land use which cycles from closed forest
            canopy to a field dominated by annual crops to an orchard garden, and from an orchard garden back to the
            closed canopy.
          </p>
          <p>
            The Maya Forest remains the second most biodiverse place in the world second only to the Amazon forest. The
            Milpa Cycle is the conservation method of farming and managing the Maya forest. It goes through four main
            stages over the course of approximately 20 years.
          </p>
          <p>
            The Milpa Forest Garden system had been selected as the first case study because of the rich availability of
            scientific and non documentation and analysis of each growing phase. It presents a circular finite model
            which frames the research time-wise. It’s a successional, polycultural, agroforestal system, which allows
            the research to analyse a variety of diverse species, from annual to perennial, from weeds to trees. For the
            purpose of the exhibition and to facilitate the initial steps of the research a selection of 13 species of
            flora has been made, the one more recurring in the literature, even if it’s accounted that in the Milpa
            Forest Garden more than 90 species can be found.
          </p>
          <p>
            It’s important to note that although this analysis focuses exclusively on the agricultural and productive
            aspect of the Milpa cycle, the values of this model goes way beyond this. As Ronald Nigh says “ The making
            of milpa is the central, most sacred act, one which binds together the family, the community, the
            universe…[it] forms the core institution of Indian society in Mesoamerica and its religious and social
            importance often appear to exceed its nutritional and economic importance”
          </p>
          <h3>References</h3>
          <p>
            <a href="https://mayaforestgardeners.org/">https://mayaforestgardeners.org/</a>
          </p>
          <p>
            Maya Forest Garden: Eight Millennia of Sustainable Cultivation of the Tropical Woodlands Book by Anabel Ford
            and Ronald Nigh, Routledge 2016
          </p>
          <p>Lo-TEK Design by Radical Indigenim Book by Julia Watson, Tachen 2019</p>
        </div>
      </div>
    </div>
  )
}

export default Polyculture