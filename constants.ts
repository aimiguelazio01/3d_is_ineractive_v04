import { SectionData, WorkItem } from './types';

export const WORKS_INDEX: WorkItem[] = [
  {
    id: 'w1',
    title: 'APPLE HARMONICS',
    description: 'An experimental interface where a pile of real apples becomes a playable, touch-sensitive piano. Each section of the fruit cluster triggers a musical note, transforming organic matter into an instrument. Simultaneously, a projected 3D apple environment mirrors the user’s hand movements in real time. The physical and digital worlds blend into one tactile, immersive performance. A study in playful interaction, natural materials, and expressive motion.',
    mediaUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
    mediaType: 'image'
  },
  {
    id: 'w2',
    title: 'ROCKTOUCH POSTER',
    description: 'An interactive rock-festival poster transformed into a playable instrument. Touching the guitar strings and fret area triggers real notes and chords. Each illustrated speaker activates a song from its featured band. The poster becomes a tactile musical stage where graphics turn into sound. A fusion of design, interactivity, and rock culture.',
    mediaUrl: 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4',
    mediaType: 'video'
  },
  {
    id: 'w3',
    title: 'TOUCHSTONE CATALOG',
    description: 'A hands-on catalog where touching a stone activates its digital counterpart. The system instantly changes the projected 3D scene to match the selected material. Printed buttons allow smooth transitions between curated environments. Users experience materials not just by seeing, but by interacting. A hybrid interface combining samples, sensors, and immersive visualization.',
    mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
    mediaType: 'image'
  },
  {
    id: 'w4',
    title: 'ARCHSYNC MODEL',
    description: 'A 3D-printed architectural model perfectly synchronized with a virtual 3D environment. Rotating or manipulating the physical building instantly updates the projected scene. Detachable floors reveal level-by-level exteriors in real time. Users can walk through interiors or orbit the structure using hand-tracking gestures. An integrated screen offers floor selection and precise camera control for exploration.',
    mediaUrl: 'https://videos.pexels.com/video-files/20770858/20770858-uhd_2560_1440_60fps.mp4',
    mediaType: 'video'
  },
  {
    id: 'w5',
    title: 'LIVESPACE',
    description: 'An immersive 3D visualization of a house where users can freely walk through every space. Interactively change furniture, colors, interior styles, and lighting in real time. Open and close doors or adjust lights to experiment with different atmospheres. Daylight and environmental settings respond dynamically to user actions. A fully interactive platform that brings architectural design to life.',
    mediaUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop',
    mediaType: 'image'
  },
  {
    id: 'w6',
    title: 'GREENHAVEN INTERACTIVE',
    description: 'Explore a forest house in an interactive, photorealistic 3D environment. Modify interior styles, furniture layouts, colors, and lighting on the fly. Walk through the space, open doors, and adjust lights with intuitive controls. Dynamic daylight and natural forest surroundings enhance realism. A digital experience connecting architectural exploration with immersive nature.',
    mediaUrl: 'https://videos.pexels.com/video-files/3141208/3141208-uhd_2560_1440_25fps.mp4',
    mediaType: 'video'
  },
  {
    id: 'w7',
    title: 'ORBITARIUM INTERACTIVE',
    description: 'Explore the solar system in an interactive, hand-controlled 3D environment. Navigate between planets and examine them up close with intuitive gestures. Each planet features immersive videos detailing its characteristics and features. Experience the movement, scale, and orbiting dynamics of our cosmic neighborhood. A unique fusion of interactivity, education, and astronomical visualization.',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    mediaType: 'image'
  },
  {
    id: 'w8',
    title: 'SKETCHMAGIC',
    description: 'An immersive AI-powered drawing experience designed for children. Users create sketches with hand motions, which are instantly transformed into playful AI-generated images. Choose from cute cartoon monsters, rainbow stars, or abstract landscapes. Sensors capture gestures while projections or screens display the results in real time. A fun and interactive platform combining creativity, technology, and imagination.',
    mediaUrl: 'https://videos.pexels.com/video-files/5527739/5527739-uhd_2560_1440_25fps.mp4',
    mediaType: 'video'
  },
  {
    id: 'w9',
    title: 'MOTIONSCAPE',
    description: 'A series of interactive, immersive installations where visuals respond to body movement and audio. Wall projections and screen displays react dynamically to user gestures and motion sensors. Particle systems, abstract visuals, and environmental backgrounds shift in real time. Each interaction transforms the space into a living, responsive digital canvas. A fusion of motion, sound, and immersive visual storytelling for engaging experiences.',
    mediaUrl: 'https://images.unsplash.com/photo-1633511090164-b43840ea1607?q=80&w=2574&auto=format&fit=crop',
    mediaType: 'image'
  },
  {
    id: 'w10',
    title: 'PHANTOMVIEW',
    description: 'Experience a Rolls-Royce in a fully interactive 3D environment. Customize car paint, interiors, and toggle doors and lighting with intuitive controls. Switch between studio, urban street, and snow-covered road scenes. Explore every angle and immerse yourself in luxury automotive design. An engaging tool that fuses visualization, interactivity, and high-end design.',
    mediaUrl: 'https://videos.pexels.com/video-files/852422/852422-hd_1920_1080_30fps.mp4',
    mediaType: 'video'
  },
  {
    id: 'w11',
    title: 'SUPRAVIEW',
    description: 'An interactive 3D visualization of the Toyota Supra, designed for hands-on exploration. Users can switch exterior colors and materials in real time, seeing instant updates. View the car from multiple perspectives to examine every detail. Explore both a studio environment and a dynamic exterior scene. A sleek digital platform blending automotive design, interactivity, and visual realism.',
    mediaUrl: 'https://images.unsplash.com/photo-1631557022789-9828d5d4d385?q=80&w=2070&auto=format&fit=crop',
    mediaType: 'image'
  },
  {
    id: 'w12',
    title: 'VASEMOTION',
    description: 'A unique 3D-printed vase with its own dedicated animated presentation. Motion graphics reveal every angle, curve, and detail of the object. The project blends tactile design with dynamic visual storytelling. Physical and digital representations create a cohesive showcase experience. A creative exploration of 3D printing, form, and animation.',
    mediaUrl: 'https://videos.pexels.com/video-files/3845070/3845070-uhd_2560_1440_30fps.mp4',
    mediaType: 'video'
  },
];

export const SECTIONS: SectionData[] = [
  {
    id: 'section_01',
    title: 'HUMAN–OBJECT INTERACTION',
    backgroundText: ['TOUCH', 'MOVE', 'CONTROL'],
    description: [
      'CAPACITIVE SENSORS',
      'TOUCH INTERFACES',
      'HAND TRACKING',
      'MOTION SENSING'
    ],
    videoPoster: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop', // Cybernetic hand/touch
    videoUrl: 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4' // Abstract touch
  },
  {
    id: 'section_02',
    title: 'REAL-TIME 3D VISUALIZATION',
    backgroundText: ['INTERACTIVE', 'WORLDS', 'IN MOTION'],
    description: [
      'INTERACTIVE INTERIORS AND EXTERIORS',
      'DESIGN EXPLORATION',
      'PHYSICAL-DIGITAL MODELS',
      'IMMERSIVE EXPERIENCES'
    ],
    videoPoster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', // Abstract flow
    videoUrl: 'https://videos.pexels.com/video-files/20770858/20770858-uhd_2560_1440_60fps.mp4'
  },
  {
    id: 'section_03',
    title: 'HYBRID PHYSICAL DIGITAL SYSTEMS',
    backgroundText: ['BRIDGING', 'MATTER', 'AND PIXELS'],
    description: [
      'DIGITAL TWINS',
      'TANGIBLE INTERFACES',
      'PROJECTION MAPPING',
      'PHYSICAL-DIGITAL SYNC'
    ],
    videoPoster: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop', // Tech hardware/light
    videoUrl: 'https://videos.pexels.com/video-files/852422/852422-hd_1920_1080_30fps.mp4'
  },
  {
    id: 'section_04',
    title: 'AI & GENERATIVE INTERACTION',
    backgroundText: ['SYSTEMS THAT', 'CREATE', 'WITH YOU'],
    description: [
      'AI IMAGE GENERATION',
      'GENERATIVE VISUALS',
      'CREATIVE CODING',
      'ADAPTIVE USER INTERFACES'
    ],
    videoPoster: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop', // Abstract nodes/AI
    videoUrl: 'https://videos.pexels.com/video-files/3141208/3141208-uhd_2560_1440_25fps.mp4'
  },
  {
    id: 'section_05',
    title: '3D GENERALIST',
    backgroundText: ['FORM', 'MOTION', 'AND', 'SIMULATION'],
    description: [
      '3D MODELING',
      'UVS, TEXTURING & RENDERING',
      '3D TRACKING',
      'LOOK DEVELOPMENT',
      'VFX & MOTION DESIGN'
    ],
    videoPoster: 'https://images.unsplash.com/photo-1633511090164-b43840ea1607?q=80&w=2574&auto=format&fit=crop', // 3D abstract shapes
    videoUrl: 'https://videos.pexels.com/video-files/5527739/5527739-uhd_2560_1440_25fps.mp4'
  },
  {
    id: 'section_06',
    title: '3D PRINTING & FABRICATION',
    backgroundText: ['FROM DIGITAL', 'TO PHYSICAL'],
    description: [
      '3D PRINTING',
      'DIGITAL FABRICATION',
      'PHYSICAL PROTOTYPING',
      'OBJECT DESIGN'
    ],
    videoPoster: 'https://images.unsplash.com/photo-1631557022789-9828d5d4d385?q=80&w=2070&auto=format&fit=crop', // 3D printing/tech
    videoUrl: 'https://videos.pexels.com/video-files/3845070/3845070-uhd_2560_1440_30fps.mp4'
  }
];

export const INTEL_DATA: Record<string, { description: string, image?: string, video?: string }> = {
  'CAPACITIVE SENSORS': {
    description: 'CAPACITIVE SENSORS DETECT HUMAN TOUCH BY MEASURING CHANGES IN ELECTRICAL FIELDS.\nTHEY ENABLE PRECISE, RESPONSIVE INTERACTION BETWEEN PHYSICAL SURFACES AND DIGITAL SYSTEMS.',
    video: '/assets/videos/capacitive_sensors.mp4'
  },
  'TOUCH INTERFACES': {
    description: 'TOUCH INTERFACES TRANSFORM PHYSICAL CONTACT INTO DIRECT DIGITAL INPUT.\nTHEY CREATE INTUITIVE, IMMEDIATE CONNECTIONS BETWEEN HUMAN ACTION AND RESPONSIVE SYSTEMS.',
    video: '/assets/videos/touch_interfaces.mp4'
  },
  'HAND TRACKING': {
    description: 'HAND TRACKING CAPTURES NATURAL HUMAN MOVEMENT TO CONTROL DIGITAL ENVIRONMENTS IN REAL TIME.\nIT ENABLES TOUCHLESS, INTUITIVE INTERACTION WHERE THE BODY BECOMES THE INTERFACE.',
    video: '/assets/videos/hand_tracking.mp4'
  },
  'MOTION SENSING': {
    description: 'MOTION SENSING DETECTS BODY MOVEMENT TO DRIVE REAL-TIME DIGITAL RESPONSE.\nIT ENABLES SPATIAL, INTUITIVE INTERACTION WITHOUT PHYSICAL CONTACT.',
    video: '/assets/videos/motion_sensing.mp4'
  },
  'INTERACTIVE INTERIORS AND EXTERIORS': {
    description: 'INTERACTIVE ARCHVIZ INTERIORS AND EXTERIORS ALLOW REAL-TIME EXPLORATION OF ARCHITECTURAL SPACES.\nUSERS CAN MOVE, CUSTOMIZE, AND EXPERIENCE DESIGN WITH FULL CONTROL AND IMMERSION.',
    video: '/assets/videos/interactive_int_ext.mp4'
  },
  'DESIGN EXPLORATION': {
    description: 'DESIGN EXPLORATION ENABLES REAL-TIME TESTING OF SPACES, MATERIALS, AND LIGHT.\nIT TRANSFORMS STATIC VISUALIZATION INTO AN INTERACTIVE DECISION-MAKING TOOL.',
    video: '/assets/videos/design_exploration.mp4'
  },
  'PHYSICAL-DIGITAL MODELS': {
    description: 'ARCHVIZ PHYSICAL–DIGITAL MODELS CONNECT TANGIBLE ARCHITECTURAL MAQUETTES WITH REAL-TIME 3D ENVIRONMENTS.\nPHYSICAL INTERACTION INSTANTLY DRIVES DIGITAL UPDATES FOR IMMERSIVE DESIGN EXPLORATION.',
    video: '/assets/videos/physical_digital_models.mp4'
  },
  'IMMERSIVE EXPERIENCES': {
    description: 'IMMERSIVE EXPERIENCES PLACE USERS INSIDE REACTIVE DIGITAL ENVIRONMENTS.\nTHEY ENGAGE SENSES, MOTION, AND SPACE TO CREATE DEEP, MEMORABLE INTERACTION.',
    video: '/assets/videos/immersive_experiences.mp4'
  },
  'DIGITAL TWINS': {
    description: 'DIGITAL TWINS ARE REAL-TIME VIRTUAL REPRESENTATIONS OF PHYSICAL OBJECTS OR SPACES.\nTHEY ENABLE SIMULATION, MONITORING, AND INTERACTIVE EXPLORATION WITH HIGH ACCURACY.',
    video: '/assets/videos/digital_twins.mp4'
  },
  'TANGIBLE INTERFACES': {
    description: 'TANGIBLE INTERFACES USE PHYSICAL OBJECTS AS DIRECT CONTROLS FOR DIGITAL SYSTEMS.\nTHEY BRIDGE TOUCH, MATERIALITY, AND COMPUTATION FOR INTUITIVE INTERACTION.',
    video: '/assets/videos/tangible_interfaces.mp4'
  },
  'PROJECTION MAPPING': {
    description: 'PROJECTION MAPPING TRANSFORMS PHYSICAL SURFACES INTO DYNAMIC VISUAL DISPLAYS.\nIT MERGES ARCHITECTURE, LIGHT, AND MOTION TO CREATE IMMERSIVE EXPERIENCES.',
    video: '/assets/videos/projection_mapping.mp4'
  },
  'PHYSICAL-DIGITAL SYNC': {
    description: 'PHYSICAL–DIGITAL SYNC LINKS REAL-WORLD ACTIONS WITH REAL-TIME DIGITAL RESPONSE.\nIT CREATES COHERENT SYSTEMS WHERE TOUCH, MOTION, AND DATA MOVE AS ONE.',
    video: '/assets/videos/physical_digital_sync.mp4'
  },
  'AI IMAGE GENERATION': {
    description: 'AI IMAGE GENERATION USES MACHINE LEARNING TO CREATE VISUALS FROM DATA OR PROMPTS.\nIT ENABLES RAPID, ADAPTIVE VISUAL CREATION FOR INTERACTIVE AND CREATIVE SYSTEMS.',
    video: '/assets/videos/ai_image_generation.mp4'
  },
  'GENERATIVE VISUALS': {
    description: 'GENERATIVE VISUALS USE ALGORITHMS AND DATA TO CREATE EVER-CHANGING IMAGES IN REAL TIME.\nTHEY ENABLE DYNAMIC, REACTIVE AESTHETICS THAT EVOLVE THROUGH INTERACTION AND INPUT.',
    video: '/assets/videos/generative_visuals.mp4'
  },
  'CREATIVE CODING': {
    description: 'CREATIVE CODING USES PROGRAMMING AS A MEDIUM FOR VISUAL, INTERACTIVE, AND EXPERIMENTAL EXPRESSION.\nIT ENABLES CUSTOM SYSTEMS WHERE LOGIC, DESIGN, AND MOTION CONVERGE.',
    video: '/assets/videos/creative_coding.mp4'
  },
  'ADAPTIVE USER INTERFACES': {
    description: 'ADAPTIVE USER INTERFACES CHANGE IN REAL TIME BASED ON USER BEHAVIOR AND CONTEXT.\nTHEY CREATE MORE INTUITIVE, RESPONSIVE, AND PERSONALIZED INTERACTION EXPERIENCES.',
    video: '/assets/videos/adaptive_user_interfaces.mp4'
  },
  '3D MODELING': {
    description: '3D MODELING CREATES DIGITAL REPRESENTATIONS OF OBJECTS, SPACES, AND FORMS.\nIT PROVIDES THE FOUNDATION FOR VISUALIZATION, ANIMATION, AND INTERACTIVE EXPERIENCES.',
    video: '/assets/videos/3d_modeling.mp4'
  },
  'UVS, TEXTURING & RENDERING': {
    description: 'UVS, TEXTURING, AND RENDERING WORK TOGETHER TO DEFINE SURFACE DETAIL, MATERIAL QUALITY, AND LIGHT RESPONSE.\nTHEY TRANSFORM 3D MODELS INTO POLISHED, PHOTOREAL, OR STYLIZED VISUAL OUTPUT.',
    video: '/assets/videos/uvs_texturing.mp4'
  },
  '3D TRACKING': {
    description: '3D TRACKING CAPTURES CAMERA OR OBJECT MOTION TO ALIGN DIGITAL CONTENT WITH REAL-WORLD FOOTAGE.\nIT ENABLES SEAMLESS INTEGRATION OF 3D ELEMENTS INTO LIVE-ACTION ENVIRONMENTS.',
    video: '/assets/videos/3d_tracking.mp4'
  },
  'LOOK DEVELOPMENT': {
    description: 'LOOK DEVELOPMENT DEFINES THE VISUAL IDENTITY OF A 3D SCENE THROUGH MATERIALS, LIGHTING, AND COLOR.\nIT SHAPES MOOD, STYLE, AND CONSISTENCY ACROSS VISUAL EXPERIENCES.',
    video: '/assets/videos/look_development.mp4'
  },
  'VFX & MOTION DESIGN': {
    description: 'VFX AND MOTION DESIGN ADD DYNAMIC VISUAL EFFECTS AND MOVEMENT TO DIGITAL CONTENT.\nTHEY ENHANCE STORYTELLING, RHYTHM, AND VISUAL IMPACT ACROSS MEDIA.',
    video: '/assets/videos/vfx_motion_design.mp4'
  },
  '3D PRINTING': {
    description: '3D PRINTING TRANSFORMS DIGITAL MODELS INTO PHYSICAL OBJECTS WITH HIGH PRECISION.\nIT ENABLES RAPID PROTOTYPING AND THE CREATION OF TANGIBLE, FUNCTIONAL FORMS.',
    video: '/assets/videos/3d_printing.mp4'
  },
  'DIGITAL FABRICATION': {
    description: 'DIGITAL FABRICATION USES COMPUTER-CONTROLLED TOOLS TO TURN DIGITAL DESIGNS INTO PHYSICAL OBJECTS.\nIT BRIDGES DESIGN, TECHNOLOGY, AND CRAFTSMANSHIP THROUGH PROCESSES LIKE 3D PRINTING AND CNC.',
    video: '/assets/videos/digital_fabrication.mp4'
  },
  'PHYSICAL PROTOTYPING': {
    description: 'PHYSICAL PROTOTYPING INVOLVES BUILDING TANGIBLE MODELS TO TEST IDEAS, FORM, AND FUNCTION.\nIT HELPS DESIGNERS VALIDATE CONCEPTS EARLY THROUGH HANDS-ON EXPERIMENTATION.',
    video: '/assets/videos/physical_prototyping.mp4'
  },
  'OBJECT DESIGN': {
    description: 'OBJECT DESIGN FOCUSES ON SHAPING FUNCTIONAL AND AESTHETIC PRODUCTS FOR EVERYDAY USE.\nIT COMBINES CREATIVITY, ERGONOMICS, AND MATERIALS TO SOLVE REAL-WORLD PROBLEMS.',
    video: '/assets/videos/object_design.mp4'
  }
};
