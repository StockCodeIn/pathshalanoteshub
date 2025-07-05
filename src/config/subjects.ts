export interface Subject {
  id: string
  name: string
  chapters: string[]
}

export interface ClassSubjects {
  [key: string]: Subject[]
}

export const subjects: ClassSubjects = {
  '10': [
    {
      id: 'mathematics',
      name: 'Mathematics',
      chapters: [
        'Real Numbers',
        'Polynomials',
        'Pair of Linear Equations in Two Variables',
        'Quadratic Equations',
        'Arithmetic Progressions',
        'Triangles',
        'Coordinate Geometry',
        'Introduction to Trigonometry',
        'Applications of Trigonometry',
        'Circles',
        'Constructions',
        'Areas Related to Circles',
        'Surface Areas and Volumes',
        'Statistics',
        'Probability'
      ]
    },
    {
      id: 'science',
      name: 'Science',
      chapters: [
        'Chemical Reactions and Equations',
        'Acids, Bases and Salts',
        'Metals and Non-metals',
        'Carbon and its Compounds',
        'Life Processes',
        'Control and Coordination',
        'How do Organisms Reproduce?',
        'Heredity',
        'Light - Reflection and Refraction',
        'Human Eye and Colourful World',
        'Electricity',
        'Magnetic Effects of Electric Current',
        'Our Environment'
      ]
    },


  ],
  '11': [
    {
      id: 'physics',
      name: 'Physics',
      chapters: [
        'Physical World',
        'Units and Measurements',
        'Motion in a Straight Line',
        'Motion in a Plane',
        'Laws of Motion',
        'Work, Energy and Power',
        'System of Particles and Rotational Motion',
        'Gravitation',
        'Mechanical Properties of Solids',
        'Mechanical Properties of Fluids',
        'Thermal Properties of Matter',
        'Thermodynamics',
        'Kinetic Theory',
        'Oscillations',
        'Waves'
      ]
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      chapters: [
        'Some Basic Concepts of Chemistry',
        'Structure of Atom',
        'Classification of Elements and Periodicity in Properties',
        'Chemical Bonding and Molecular Structure',
        'States of Matter',
        'Thermodynamics',
        'Equilibrium',
        'Redox Reactions',
        'Hydrogen',
        'The s-Block Elements',
        'The p-Block Elements',
        'Organic Chemistry - Some Basic Principles and Techniques',
        'Hydrocarbons',
        'Environmental Chemistry'
      ]
    },

    {
      id: 'biology',
      name: 'Biology',
      chapters: [
        'The Living World',
        'Biological Classification',
        'Plant Kingdom',
        'Animal Kingdom',
        'Morphology of Flowering Plants',
        'Anatomy of Flowering Plants',
        'Structural Organisation in Animals',
        'Cell Structure and Function',
        'Cell Cycle and Cell Division'
      ]
    },

    {
      id: 'mathematics',
      name: 'Mathematics',
      chapters: [
        'Sets',
        'Relations and Functions',
        'Trigonometric Functions',
        'Principle of Mathematical Induction',
        'Complex Numbers and Quadratic Equations',
        'Linear Inequalities',
        'Permutations and Combinations',
        'Binomial Theorem',
        'Sequences and Series',
        'Straight Lines',
        'Conic Sections',
        'Introduction to Three Dimensional Geometry',
        'Limits and Derivatives',
        'Mathematical Reasoning'
      ]
    }

  ],

  '12': [
    {
      id: 'physics',
      name: 'Physics',
      chapters: [
        'Electric Charges and Fields',
        'Electrostatic Potential and Capacitance',
        'Current Electricity',
        'Moving Charges and Magnetism',
        'Magnetism and Matter',
        'Electromagnetic Induction',
        'Alternating Current',
        'Electromagnetic Waves',
        'Ray Optics and Optical Instruments',
        'Wave Optics',
        'Dual Nature of Matter and Radiation',
        'Atoms',
        'Nuclei',
        'Semiconductor Electronics'
      ]
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      chapters: [
        'The Solid State',
        'Solutions',
        // 'Electrochemistry',
        // 'Chemical Kinetics',
        // 'Surface Chemistry',
        // 'General Principles and Processes of Isolation of Elements',
        // 'The p-Block Elements',
        // 'The d and f Block Elements',
        // 'Coordination Compounds',
        // 'Haloalkanes and Haloarenes',
        // 'Alcohols, Phenols and Ethers',
        // 'Aldehydes, Ketones and Carboxylic Acids',
        // 'Amines',
        // 'Biomolecules',
        // 'Polymers',
        // 'Chemistry in Everyday Life'
      ]
    },
    // Extra subject for Grade 12
    // {
    //   id: 'mathematics',
    //   name: 'Mathematics',
    //   chapters: [
    //     'Relations and Functions',
    //     'Inverse Trigonometric Functions',
    //     'Matrices',
    //     'Determinants',
    //     'Continuity and Differentiability',
    //     'Application of Derivatives',
    //     'Integrals',
    //     'Applications of Integrals',
    //     'Differential Equations',
    //     'Vector Algebra',
    //     'Three Dimensional Geometry',
    //     'Linear Programming',
    //     'Probability'
    //   ]
    // },
    // {
    //   id: 'biology',
    //   name: 'Biology',
    //   chapters: [
    //     'Reproduction in Organisms',
    //     'Sexual Reproduction in Flowering Plants',
    //     'Human Reproduction',
    //     'Reproductive Health',
    //     'Principle of Inheritance and Variation',
    //     'Molecular Basis of Inheritance',
    //     'Evolution',
    //     'Human Health and Disease',
    //     'Strategies for Enhancement in Food Production',
    //     'Microbes in Human Welfare',
    //     'Environmental Issues',
    //     'Biotechnology and Its Applications',
    //   ]
    // }

  ]
}
