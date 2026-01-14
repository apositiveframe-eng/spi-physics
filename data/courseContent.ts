
export type AssessmentQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
};

export type Topic = {
  id: string;
  title: string;
  visualType: string;
  estTime: string;
  assessment: AssessmentQuestion[];
  timeSaverHook: string;       
  activeLearningPromise: string; 
  roadmap: string;             
  negation: string;            
  mnemonic: string;            
  analogy: string;             
  practicalApplication: string;
  mindsetShift: string;        
  assessmentCTA: string;       
  harveyTakeaways: string;     
};

export type Module = {
  id: string;
  title: string;
  description: string;
  weight: string;
  topics: Topic[];
};

export const glossaryTerms = [
    { term: "ALARA", def: "As Low As Reasonably Achievable; the fundamental principle of ultrasound safety to minimize patient exposure.", cat: "Safety" },
    { term: "Impedance", def: "The acoustic resistance to sound travel in a medium, calculated as Density x Propagation Speed.", cat: "Waves" },
    { term: "Nyquist Limit", def: "The highest Doppler frequency shift detectable without aliasing, equal to PRF divided by 2.", cat: "Doppler" },
    { term: "LARRD", def: "Axial Resolution acronym: Longitudinal, Axial, Range, Radial, Depth. Determined by Spatial Pulse Length.", cat: "Resolution" },
    { term: "LATA", def: "Lateral Resolution acronym: Lateral, Angular, Transverse, Azimuthal. Determined by the width of the sound beam.", cat: "Resolution" },
    { term: "Bernoulli", def: "The principle describing the inverse relationship between pressure and velocity in a moving fluid.", cat: "Hemodynamics" },
    { term: "Period", def: "The time required for one complete cycle to occur. Inversely related to frequency.", cat: "Waves" },
    { term: "Wavelength", def: "The physical distance of a single cycle in space. λ = 1.54 / Frequency (in soft tissue).", cat: "Waves" },
    { term: "Propagation Speed", def: "The distance sound travels through a medium in 1 second. Average in soft tissue is 1,540 m/s.", cat: "Waves" },
    { term: "Pulse Duration", def: "The actual time from the start of a pulse to the end of that same pulse ('on' time).", cat: "Pulsed Wave" },
    { term: "Spatial Pulse Length", def: "The distance that a pulse occupies in space from the start to the end of the pulse.", cat: "Pulsed Wave" },
    { term: "Duty Factor", def: "The percentage or fraction of time the system is transmitting a pulse. Typically < 1% for imaging.", cat: "Pulsed Wave" },
    { term: "Attenuation", def: "The decrease in intensity, power, and amplitude as sound travels through a medium.", cat: "Interactions" },
    { term: "Specular Reflection", def: "Reflection from a smooth boundary where sound is redirected in a single, organized direction.", cat: "Interactions" },
    { term: "Scattering", def: "The random redirection of sound in many directions by interfaces smaller than or equal to the wavelength.", cat: "Interactions" },
    { term: "Rayleigh Scattering", def: "Organized scattering in all directions when the structure is much smaller than the wavelength (e.g., Red Blood Cells).", cat: "Interactions" },
    { term: "Snell's Law", def: "The physics law describing the direction of transmission when sound strikes a boundary at an oblique angle.", cat: "Interactions" },
    { term: "Refraction", def: "The change in direction of wave propagation when traveling from one medium to another; 'transmission with a bend'.", cat: "Interactions" },
    { term: "Piezoelectric Effect", def: "The property of certain materials to create a voltage when pressure is applied (sound to electricity).", cat: "Transducers" },
    { term: "Curie Point", def: "The temperature at which piezoelectric materials are polarized; exceeding this causes depolarization.", cat: "Transducers" },
    { term: "Fresnel Zone", def: "The near field of the sound beam; the region from the transducer face to the focal point.", cat: "Beams" },
    { term: "Fraunhofer Zone", def: "The far field of the sound beam; the region beyond the focal point where the beam diverges.", cat: "Beams" },
    { term: "Huygens' Principle", def: "The theory that a large active element acts as millions of tiny, individual sound sources creating an hourglass shape.", cat: "Beams" },
    { term: "Apodization", def: "A method of reducing lobe artifacts by exciting array elements with different voltages.", cat: "Instrumentation" },
    { term: "Temporal Resolution", def: "Accuracy in time; the ability to position moving structures accurately, determined by frame rate.", cat: "Instrumentation" },
    { term: "TGC", def: "Time Gain Compensation; receiver function used to create uniform brightness from top to bottom.", cat: "Instrumentation" },
    { term: "Demodulation", def: "A non-adjustable receiver process (rectification and smoothing) that prepares the signal for display.", cat: "Instrumentation" },
    { term: "Harmonic Imaging", def: "The creation of an image using reflections at twice the fundamental frequency to reduce noise.", cat: "Advanced" },
    { term: "Mechanical Index", def: "A unitless value that estimates the amount of contrast harmonics and the likelihood of cavitation.", cat: "Safety" },
    { term: "Thermal Index", def: "A unitless predictor of the maximum temperature increase in tissue due to ultrasound exposure.", cat: "Safety" },
    { term: "Aliasing", def: "The incorrect display of high-velocity flow in the opposite direction when the Nyquist limit is exceeded.", cat: "Doppler" }
];

export const courseData: Module[] = [
  {
    id: "m1",
    title: "Module 1: Waves and Sound",
    description: "The fundamental nature of sound and its interaction with matter.",
    weight: "15%",
    topics: [
      {
        id: "1-1",
        title: "Introduction to Waves",
        visualType: "LongitudinalWaveVisual",
        estTime: "10 min",
        timeSaverHook: "I manually aggregated 14 different physics textbooks and 50 hours of board prep videos to save you exactly 12 hours of reading on Wave Theory.",
        activeLearningPromise: "If you can identify the difference between compression and rarefaction in the simulation, you are officially board-educated on wave nature.",
        roadmap: "1. Definitions (The 7 Parameters)\n2. Wave Architecture\n3. The Medium Link\n4. The 'Holy Sh*t' Insight: Sound doesn't travel, energy does.",
        negation: "The easiest way to define Sound is to say it is NOT light. Light is transverse and moves in a vacuum. Sound is mechanical and would literally die in a vacuum.",
        mnemonic: "Just think: 'Silly Mice Love Pizza' (Sound, Mechanical, Longitudinal, Pressure).",
        analogy: "Think of a crowded stadium doing 'The Wave'. The people don't move to the other side of the stadium; they just stand up and sit down. Only the energy travels.",
        practicalApplication: "To make this practical, imagine your probe is 'poking' the tissue. If the tissue is too stiff, the poke returns faster. This is how we map density.",
        mindsetShift: "Stop focusing on the line on the screen; focus on the invisible pressure pulse moving through the patient.",
        assessmentCTA: "As promised, here is your wave audit. Solve this to prove your mastery.",
        harveyTakeaways: "Welcome, scholar. Remember: Sound is just particles having a rhythmic handshake. If they can't touch, the message stops.",
        assessment: [{ question: "Which of the following is NOT true about sound?", options: ["It is mechanical", "It travels in a vacuum", "It is longitudinal", "It carries energy"], correctAnswer: 1 }]
      },
      {
          id: "1-3",
          title: "Interaction with Media",
          visualType: "TissueInteractionVisual",
          estTime: "12 min",
          timeSaverHook: "I've deconstructed the complex Snell's Law into a 12-minute cliffnote that usually takes 4 hours to master in a university lab.",
          activeLearningPromise: "By the end of this lab, you'll predict exactly where an echo will bounce before the machine even renders it.",
          roadmap: "1. Impedance Logic\n2. Reflection vs Refraction\n3. Interface Physics\n4. The Insight: Mismatch is the master of the image.",
          negation: "Refraction is NOT a reflection. Reflection is a bounce; Refraction is a 'bend'. If the angle is 0, refraction simply cannot exist.",
          mnemonic: "Think: 'Big Dogs Run Fast' (Boundary, Density, Reflection, Frequency).",
          analogy: "Reflection is like hitting a wall with a ball. Refraction is car hitting a patch of ice with only its right tires—it pulls the whole car in a new direction.",
          practicalApplication: "Look at the liver/kidney interface. That bright white line? That's a high-impedance mismatch. No mismatch, no line.",
          mindsetShift: "You aren't looking at organs; you are looking at the 'arguments' between different tissue types.",
          assessmentCTA: "Can you calculate the mismatch? Prove it in this assessment.",
          harveyTakeaways: "Sound is picky. It only talks back when it hits something different from itself. Embrace the mismatch!",
          assessment: [{ question: "What physical property is required for reflection to occur?", options: ["Identical densities", "Impedance mismatch", "High frequency", "Perpendicular angle only"], correctAnswer: 1 }]
      }
    ]
  },
  {
    id: "m2",
    title: "Module 2: Transducers",
    description: "The hardware that generates the beam.",
    weight: "16%",
    topics: [
      {
        id: "2-1",
        title: "The PZT Stack",
        visualType: "TransducerAnatomyVisual",
        estTime: "15 min",
        timeSaverHook: "I spent 3 years in a repair lab deconstructing probes so you don't have to. Here is the 15-minute anatomy cheat sheet.",
        activeLearningPromise: "If you can label the four internal layers of the probe, you have mastered the hardware domain of the SPI.",
        roadmap: "1. The Crystal (PZT)\n2. Backing Material\n3. Matching Layer\n4. The Insight: Damping is the secret to resolution.",
        negation: "The Matching Layer is NOT a lens. It doesn't focus. It only 'greases the wheels' so sound can move from crystal to skin without a total internal reflection.",
        mnemonic: "Think: 'Big Penguins Make Milk' (Backing, PZT, Matching).",
        analogy: "The backing material is like putting your hand on a vibrating bell. It stops the ringing so the bell is ready to be hit again immediately.",
        practicalApplication: "Why do we use gel? Without it, the impedance mismatch with air is so high that 100% of the sound reflects back before entering the body.",
        mindsetShift: "The probe isn't a camera; it's a very fast translator between electricity and pressure.",
        assessmentCTA: "Audit the transducer architecture below.",
        harveyTakeaways: "That PZT crystal is fragile. One drop on the floor can shatter your image resolution forever. Treat it like a diamond.",
        assessment: [{ question: "Which component of the transducer shortens the pulse duration?", options: ["Matching layer", "Acoustic insulator", "Backing material", "Plastic housing"], correctAnswer: 2 }]
      }
    ]
  },
  {
    id: "m3",
    title: "Module 3: Pulsed-Echo Instrumentation",
    description: "The logic of pulses, resolution, and receiver operations.",
    weight: "28%",
    topics: [
      {
        id: "3-1",
        title: "Pulsed Wave Parameters",
        visualType: "PulsedWaveVisual",
        estTime: "15 min",
        timeSaverHook: "You've likely struggled with the difference between Pulse Duration and Spatial Pulse Length. I've engineered a visual sync to fix that in 15 minutes.",
        activeLearningPromise: "Identify the exact moment duty factor reaches its limit in our simulator.",
        roadmap: "1. Pulse Duration Logic\n2. Spatial Pulse Length (SPL)\n3. Duty Factor vs. PRP/PRF\n4. The Insight: Listening time is the primary variable.",
        negation: "A pulse is NOT continuous. If the machine is talking, it isn't listening. That's why 99% of the time, the machine is silent.",
        mnemonic: "Think: 'Dashing Pilots Love Speed' (Duration, Pulse, Length, Speed).",
        analogy: "A pulse is like a camera flash. The flash is very quick (Pulse Duration), but the time between flashes is much longer (PRP).",
        practicalApplication: "When you increase your depth, you are increasing the 'Listening Time'. This lowers your PRF and slows your frame rate.",
        mindsetShift: "Stop viewing sound as a stream; view it as a series of distinct data packets.",
        assessmentCTA: "Verify your pulsed parameter synchronization.",
        harveyTakeaways: "Efficiency is key. A shorter pulse means higher resolution. If you can't hear the echo, the pulse was too long.",
        assessment: [{ question: "What happens to the Pulse Repetition Period (PRP) when depth is increased?", options: ["Decreases", "Increases", "Stays the same", "Becomes zero"], correctAnswer: 1 }]
      }
    ]
  },
  {
    id: "m4",
    title: "Module 4: Doppler Effect",
    description: "Measuring motion and velocity.",
    weight: "36%",
    topics: [
      {
        id: "4-1",
        title: "Doppler Calibration",
        visualType: "DopplerPrincipleVisual",
        estTime: "20 min",
        timeSaverHook: "Doppler is 36% of your exam. I've distilled 400 pages of hemodynamics into this 20-minute protocol.",
        activeLearningPromise: "Solve any velocity shift mystery in under 5 seconds using the 'Cosine Rule'.",
        roadmap: "1. Frequency Shift Logic\n2. The Angle Factor\n3. Velocity Calculation\n4. The Insight: 90 degrees is the 'Black Hole' of Doppler.",
        negation: "Doppler is NOT measuring the speed of sound. It's measuring the change in frequency caused by the speed of blood.",
        mnemonic: "Think: 'Parallel Penguins Play Pop' (Parallel, Frequency, Phase).",
        analogy: "The Siren Analogy: As the ambulance comes toward you, the sound waves get squished (higher pitch). As it leaves, they get stretched (lower pitch).",
        practicalApplication: "Why do we steer the color box? To get as close to 0 or 180 degrees as possible. If you scan at 90, the machine thinks the blood is standing still.",
        mindsetShift: "You aren't just scanning a vessel; you are intercepting a moving target.",
        assessmentCTA: "Validate your Doppler vectors here.",
        harveyTakeaways: "Cosine of 90 is zero. If your angle is 90, your data is zero. Don't be a zero, scholar!",
        assessment: [{ question: "At what angle is the Doppler shift at its maximum?", options: ["90 degrees", "45 degrees", "0 degrees", "60 degrees"], correctAnswer: 2 }]
      }
    ]
  },
  {
    id: "m7",
    title: "Module 7: Hemodynamics",
    description: "The physics of blood flow.",
    weight: "10%",
    topics: [
      {
        id: "7-2",
        title: "Bernoulli's Logic",
        visualType: "PhysicalPrinciplesVisual",
        estTime: "15 min",
        timeSaverHook: "I've synthesized fluid dynamics research papers from NASA and medical journals to explain flow energy in 15 minutes.",
        activeLearningPromise: "You will be able to explain exactly why pressure drops at a stenosis while speed increases.",
        roadmap: "1. Conservation of Energy\n2. Pressure Gradients\n3. The Stenosis Paradox\n4. The Insight: Speed up, Pressure down.",
        negation: "A stenosis is NOT a bottleneck that slows things down. In physics, a narrowing is an accelerator.",
        mnemonic: "Think: 'Narrow Snakes Push' (Narrowing, Speed, Pressure drop).",
        analogy: "Putting your thumb over the end of a garden hose. The water has to move faster to get the same amount out of the smaller hole.",
        practicalApplication: "When you see a plaque, measure the velocity. The higher the speed, the tighter the hole. Simple as that.",
        mindsetShift: "Think like the fluid. It's looking for the path of least resistance.",
        assessmentCTA: "Calculate the pressure gradient below.",
        harveyTakeaways: "Energy cannot be created or destroyed. If blood gains speed, it MUST lose pressure. It's the law!",
        assessment: [{ question: "According to Bernoulli, what happens to pressure at a narrowing?", options: ["Increases", "Decreases", "Stays the same", "Becomes zero"], correctAnswer: 1 }]
      }
    ]
  },
  {
      id: "m11",
      title: "Module 11: Instrumentation",
      description: "How the machine processes the signal.",
      weight: "20%",
      topics: [
          {
              id: "11-1",
              title: "The Receiver Loop",
              visualType: "ReceiverFunctionsVisual",
              estTime: "18 min",
              timeSaverHook: "I've spent years calibrating these consoles. Here is the order of operations that most engineers take 6 months to learn.",
              activeLearningPromise: "Master the 5 functions of the receiver in alphabetical order. Never forget them again.",
              roadmap: "1. Amplification\n2. Compensation (TGC)\n3. Compression\n4. Demodulation\n5. Reject\n6. The Insight: You only control 4 out of 5.",
              negation: "Demodulation is NOT something you can change. If a salesman tells you to 'adjust the demodulation,' they're lying.",
              mnemonic: "Think: 'All Crazy Children Do Recess' (Amplification, Compensation, Compression, Demodulation, Reject).",
              analogy: "Like recording a podcast: First boost the mic (Amp), fix the volume for the quiet guest (Comp), squash the loud peaks (Compression), clean the signal (Demod), and cut the background hiss (Reject).",
              practicalApplication: "Using TGC is just 'Compensation'. You're telling the machine: 'Hey, that sound had a long trip, give it a little extra boost.'",
              mindsetShift: "The console isn't a TV; it's a sophisticated signal processing laboratory.",
              assessmentCTA: "Can you order the processing steps correctly? Try now.",
              harveyTakeaways: "Five steps. One order. Alphabetical. If you know that, you've already won Module 11.",
              assessment: [{ question: "Which receiver function is NOT operator adjustable?", options: ["Compression", "Reject", "Demodulation", "Amplification"], correctAnswer: 2 }]
          }
      ]
  }
];
