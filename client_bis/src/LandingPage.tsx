import React from 'react'
import styles from '@/style.css'

const LandingPage = () => (
  <div className={styles['landingPageContainer']}>
    <div className={styles['contentHeader']}>
      <p>
        In this section you can find a description of the project, description which will change with the development of
        the research.
      </p>
    </div>
    <div className={styles['contentContainerCol']}>
      <div className={styles['landingContent']}>
        <p>
          The current environmental crisis has proven to be a total one, affecting biodiversity, soil, water and air. As
          a reaction to it, an ever-growing quest for sustainable alternatives to oil-based materials has emerged. In
          the field of design - products, interiors and fashion - this translated with increasing natural and
          bio-fabricated options developed at an industrial level as well as at an experimental design-studio level.
          Among other solutions, many companies, material engineers and designers started looking into the use of
          industrial agriculture leftovers motivated by the necessity of not stealing land from food production. Based
          strongly on local bioregional economies, these researches are creating an expanding landscape of natural
          materials. Despite giving birth to a richer biodiversity of resources, however, these researches are only
          technical solutions to the use of waste materials and are not questioning the agricultural system that
          generated them in the first place. They are not providing real alternatives to the environmental impact of
          monocultural industrial farming and, in some ways, they are even contributing to confusing people regarding
          the difference between renewable and extractive resources.
        </p>
        <p>
          In response to this, the research project Syntropic Materials looks at alternative agroecological models such
          as regenerative agriculture practices and attempts to combine these with the latest development in natural
          material research. In order to design regenerative processes for plant/animal based materials production.
          Asking if this great innovation in the field of materials can open new possibilities for the development of
          polycultures, and vice versa, if the choices taken in designing polycultures could define new directions in
          new materials development. Until now the research took the shape of a database, the analysis of an existing
          polycultural regenerative agroecosystem, and a series of workshops.
        </p>
        <p>
          What is presented on this website space is the state of development of the research and its first findings. It
          has the objective of shifting the focus on material research from use to origin, looking at the ecosystems
          from which raw materials come from. Presenting the approach proposed by Syntropic Materials research and
          questioning what could be the relationship between a polycultural biodiverse successional and cyclical
          agroecosystem and innovation in material production.
        </p>
        <p>
          For the development of the research a series of polycultural regenerative agroecosystems will be analysed and
          presented in the section Polycutures.
        </p>
        <h3>LIBRARY</h3>
        <p>
          Conceived as an open platform, the tool is an archive of materials catalogised through species and their
          material characteristics. The library allows us to browse through this information under the logic of species
          coexistence. When approaching the library users will be asked to select a hardiness zone, which is a
          geographic area defined to encompass a certain range of climatic conditions relevant to plant growth and
          survival This will lead users to be exposed to a list of potential materials producible with species growing
          in the same climatic conditions. From this point users will be able to filter their way through the
          information by de-selecting materials or species which are not of interest to them. The library can, for
          example, help users to enlarge the spectrum of species taken into consideration while designing a polycultural
          field for material production or foster the creation of new briefs for material design based on the
          combinations of plants that create regenerative ecosystems. Rather than being a simple repository of data, the
          platform functions as a filter and re-directory to information already published on and offline. Its primary
          objective is to centralise this information allowing us to create novel and meaningful connections. What is
          presented now is the first iteration of the library. With the development of the research, further information
          and filtering tools are planned to be added.
        </p>
      </div>
    </div>
  </div>
)

export default LandingPage
