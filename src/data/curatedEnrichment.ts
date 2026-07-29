import { Tutorial } from '../types';

/** Hand-authored chapters/transcripts/skills overlaid onto imported catalog rows. */
export const CURATED_ENRICHMENT: Tutorial[] = [
  // --- ALTIUM DESIGNER FOUNDATIONS & HARDWARE DESIGN ---
  {
    id: 'tut-001',
    youtubeId: 'eet_pending_001',
    title: 'Altium Designer Installation, Environment Setup & License Workspace',
    slug: 'altium-designer-installation-setup',
    shortDescription: 'Master initial setup, system preferences, grid configuration, and workspace customization for maximum PCB design efficiency.',
    fullSummary: 'In this introductory tutorial, we walk step-by-step through installing Altium Designer, setting up cloud workspace connections, configuring grid shortcuts, setting preferences for multi-monitor setups, and creating workspace defaults.',
    durationSeconds: 480,
    durationFormatted: '8:00',
    publishedDate: '2024-01-15',
    product: 'Altium Designer',
    softwareVersion: 'AD24.1',
    difficulty: 'Beginner',
    role: 'Hardware & PCB Engineering',
    skills: ['Workspace Setup', 'Environment Configuration', 'Grids & Units'],
    learningPathIds: ['path-001'],
    projectId: 'proj-esp32',
    featured: true,
    chapters: [
      { timestampSeconds: 0, timestampFormatted: '0:00', title: 'Introduction & License Setup' },
      { timestampSeconds: 120, timestampFormatted: '2:00', title: 'Configuring Preference Defaults' },
      { timestampSeconds: 300, timestampFormatted: '5:00', title: 'Snap Grid & Hotkey Configuration' },
      { timestampSeconds: 420, timestampFormatted: '7:00', title: 'Summary & Best Practices' }
    ],
    transcript: [
      { timestampSeconds: 5, timestampFormatted: '0:05', text: 'Welcome to this Altium Designer tutorial series by Educational Engineering Team.' },
      { timestampSeconds: 60, timestampFormatted: '1:00', text: 'First, log into your Altium 365 cloud workspace to activate your device license.' },
      { timestampSeconds: 180, timestampFormatted: '3:00', text: 'Go to Preferences -> PCB Editor -> General and enable Smart Cursor snapping.' }
    ],
    commands: [
      { key: 'TP', action: 'Open Preferences Dialog', context: 'General' },
      { key: 'G', action: 'Change Snap Grid Size', context: 'PCB' }
    ],

    officialDocUrl: 'https://www.altium.com/documentation/altium-designer/system-requirements',
    altiumTrialUrl: 'https://www.altium.com/free-trial?utm_source=eet_learning_hub&utm_medium=tutorial&utm_campaign=altium_develop_library'
  },
  {
    id: 'tut-002',
    youtubeId: 'zFOiYNcBVEY',
    title: 'Creating Your First Altium PCB Project & Document Structure',
    slug: 'creating-first-altium-pcb-project',
    shortDescription: 'Learn how to structure schematic sheets, PCB layout files, and library links inside an Altium project container.',
    fullSummary: 'Learn the foundational rules of project management in Altium Designer. Understand .PrjPcb files, adding schematic (.SchDoc) and PCB (.PcbDoc) documents, and keeping project files synchronized.',
    durationSeconds: 620,
    durationFormatted: '10:20',
    publishedDate: '2024-01-20',
    product: 'Altium Designer',
    softwareVersion: 'AD24.1',
    difficulty: 'Beginner',
    role: 'Hardware & PCB Engineering',
    skills: ['Project Management', 'Document Hierarchy', 'Schematic Capture'],
    learningPathIds: ['path-001', 'path-004'],
    projectId: 'proj-arduino',
    featured: true,
    chapters: [
      { timestampSeconds: 0, timestampFormatted: '0:00', title: 'Understanding .PrjPcb Container' },
      { timestampSeconds: 150, timestampFormatted: '2:30', title: 'Adding Schematic & PCB Documents' },
      { timestampSeconds: 380, timestampFormatted: '6:20', title: 'Linking External Libraries' },
      { timestampSeconds: 540, timestampFormatted: '9:00', title: 'Saving & Cloud Sync' }
    ],
    transcript: [
      { timestampSeconds: 10, timestampFormatted: '0:10', text: 'Every hardware design in Altium starts with a project file.' },
      { timestampSeconds: 200, timestampFormatted: '3:20', text: 'Right click on the project name and choose Add New to Project -> Schematic.' }
    ],
    commands: [
      { key: 'Ctrl + N', action: 'New Project', context: 'General' },
      { key: 'F9', action: 'Compile Project', context: 'Schematic' }
    ],
    officialDocUrl: 'https://www.altium.com/documentation',
    altiumTrialUrl: 'https://www.altium.com/free-trial?utm_source=eet_learning_hub&utm_medium=tutorial&utm_campaign=altium_develop_library'
  },
  {
    id: 'tut-003',
    youtubeId: 'GybRq75o7g8',
    title: 'Schematic Symbol Creation & Parameter Management in Altium',
    slug: 'schematic-symbol-creation-parameters',
    shortDescription: 'Step-by-step guide to drawing schematic symbols, assigning pin types, net names, and component parameters.',
    fullSummary: 'Component libraries are the bedrock of reliable hardware design. This tutorial demonstrates how to draw multi-pin schematic symbols from datasheets, set pin electrical types (Passive, Input, Output, Power), assign designators, and add MPN manufacturing parameters.',
    durationSeconds: 940,
    durationFormatted: '15:40',
    publishedDate: '2024-02-01',
    product: 'Altium Designer',
    softwareVersion: 'AD24.2',
    difficulty: 'Beginner',
    role: 'Procurement & Components',
    skills: ['Component Creation', 'Schematic Symbols', 'Pin Configuration'],
    learningPathIds: ['path-001', 'path-002'],
    projectId: 'proj-esp32',
    featured: true,
    chapters: [
      { timestampSeconds: 0, timestampFormatted: '0:00', title: 'Symbol Editor Overview' },
      { timestampSeconds: 210, timestampFormatted: '3:30', title: 'Drawing Component Outline' },
      { timestampSeconds: 450, timestampFormatted: '7:30', title: 'Placing & Configuring Pins' },
      { timestampSeconds: 720, timestampFormatted: '12:00', title: 'Adding Manufacturer Part Numbers (MPN)' }
    ],
    transcript: [
      { timestampSeconds: 15, timestampFormatted: '0:15', text: 'In this video, we build a custom ESP32 microcontroller schematic symbol from scratch.' },
      { timestampSeconds: 480, timestampFormatted: '8:00', text: 'Make sure power pins like VCC and GND are marked as Power Electrical Types for Electrical Rule Checking.' }
    ],
    commands: [
      { key: 'P -> P', action: 'Place Pin', context: 'Schematic' },
      { key: 'Spacebar', action: 'Rotate Component/Pin', context: 'Schematic' }
    ],

    officialDocUrl: 'https://www.altium.com/documentation',
    altiumTrialUrl: 'https://www.altium.com/free-trial?utm_source=eet_learning_hub&utm_medium=tutorial&utm_campaign=altium_develop_library'
  },
  {
    id: 'tut-004',
    youtubeId: 't6ePVpeCLxw',
    title: 'Precision PCB Footprint Creation & IPC Wizard Compliance',
    slug: 'precision-pcb-footprint-ipc-wizard',
    shortDescription: 'Create accurate SMD and Through-Hole footprints using Altium IPC Compliant Footprint Wizard and 3D STEP models.',
    fullSummary: 'Learn how to generate high-density PCB footprints that pass IPC-7351 guidelines. Use Altium built-in Footprint Wizard, configure pad stacks, silkscreen clearances, courtyard boundaries, and attach 3D STEP models for mechanical checking.',
    durationSeconds: 1120,
    durationFormatted: '18:40',
    publishedDate: '2024-02-10',
    product: 'Altium Designer',
    softwareVersion: 'AD24.2',
    difficulty: 'Intermediate',
    role: 'Hardware & PCB Engineering',
    skills: ['Footprint Design', 'IPC Standards', '3D STEP Models'],
    learningPathIds: ['path-001', 'path-002', 'path-003'],
    projectId: 'proj-esp32',
    featured: true,
    chapters: [
      { timestampSeconds: 0, timestampFormatted: '0:00', title: 'IPC Footprint Wizard Overview' },
      { timestampSeconds: 300, timestampFormatted: '5:00', title: 'LQFP & QFN Footprint Generation' },
      { timestampSeconds: 650, timestampFormatted: '10:50', title: '3D STEP Model Alignment' },
      { timestampSeconds: 980, timestampFormatted: '16:20', title: '3D Clearance Checks' }
    ],
    transcript: [
      { timestampSeconds: 20, timestampFormatted: '0:20', text: 'Using the IPC Compliant Footprint Wizard saves hours of manual dimensioning.' },
      { timestampSeconds: 670, timestampFormatted: '11:10', text: 'Attach the .STEP file and adjust Z-height offset to match physical pin heights.' }
    ],
    commands: [
      { key: '3', action: 'Switch to 3D View', context: 'PCB' },
      { key: '2', action: 'Switch to 2D 2D View', context: 'PCB' }
    ],
    officialDocUrl: 'https://www.altium.com/documentation',
    altiumTrialUrl: 'https://www.altium.com/free-trial?utm_source=eet_learning_hub&utm_medium=tutorial&utm_campaign=altium_develop_library'
  },

  // --- ARDUINO UNO HARDWARE DESIGN SERIES ---
  {
    id: 'tut-005',
    youtubeId: 'SVGqGIxXhkY',
    title: 'Arduino UNO Schematic Design: ATmega328P, USB-UART & Power Circuitry',
    slug: 'arduino-uno-schematic-design-atmega328p',
    shortDescription: 'Complete schematic capture of the Arduino UNO Rev3 board including power auto-select and crystal oscillator circuits.',
    fullSummary: 'A complete walk-through of schematic capture for an Arduino UNO hardware clone. Covers ATmega328P support components, USB-to-Serial converter (CH340/ATmega16U2), 5V/3.3V linear regulators, protection diodes, and net labeling.',
    durationSeconds: 1450,
    durationFormatted: '24:10',
    publishedDate: '2024-02-18',
    product: 'Altium Designer',
    softwareVersion: 'AD24.2',
    difficulty: 'Intermediate',
    role: 'Hardware & PCB Engineering',
    skills: ['Schematic Capture', 'Microcontroller Circuits', 'Power Supply Design'],
    learningPathIds: ['path-001', 'path-004'],
    projectId: 'proj-arduino',
    featured: true,
    chapters: [
      { timestampSeconds: 0, timestampFormatted: '0:00', title: 'Arduino UNO Architectural Overview' },
      { timestampSeconds: 320, timestampFormatted: '5:20', title: 'ATmega328P Core Circuitry & Crystal' },
      { timestampSeconds: 750, timestampFormatted: '12:30', title: 'Power Auto-Selector Circuit' },
      { timestampSeconds: 1180, timestampFormatted: '19:40', title: 'Net Labeling & Electrical Rules Check' }
    ],
    commands: [
      { key: 'P -> W', action: 'Place Wire', context: 'Schematic' },
      { key: 'P -> N', action: 'Place Net Label', context: 'Schematic' },
      { key: 'T -> U', action: 'Annotate Schematics', context: 'Schematic' }
    ],

    officialDocUrl: 'https://www.altium.com/documentation',
    altiumTrialUrl: 'https://www.altium.com/free-trial?utm_source=eet_learning_hub&utm_medium=tutorial&utm_campaign=altium_develop_library'
  },
  {
    id: 'tut-006',
    youtubeId: 'Ev50Iv42V18',
    title: 'Arduino UNO Board Layout: Component Placement & Critical Signal Paths',
    slug: 'arduino-uno-board-layout-placement',
    shortDescription: 'Import schematic changes to PCB, set physical board contours, place connectors, and group sub-circuits.',
    fullSummary: 'Transfer your Arduino UNO schematic design to PCB using Design Change Notification (ECO). Define board shape, stackup, ground strategy, crystal proximity rules, and header placement compatible with Arduino shields.',
    durationSeconds: 1280,
    durationFormatted: '21:20',
    publishedDate: '2024-02-25',
    product: 'Altium Designer',
    softwareVersion: 'AD24.2',
    difficulty: 'Intermediate',
    role: 'Hardware & PCB Engineering',
    skills: ['Board Shape Definition', 'Component Placement', 'ECO Import'],
    learningPathIds: ['path-003', 'path-004'],
    projectId: 'proj-arduino',
    featured: true,
    chapters: [
      { timestampSeconds: 0, timestampFormatted: '0:00', title: 'Executing ECO (Design -> Update PCB)' },
      { timestampSeconds: 280, timestampFormatted: '4:40', title: 'Arduino Shield Form Factor Outline' },
      { timestampSeconds: 680, timestampFormatted: '11:20', title: 'Placing High-Speed & Crystal Components' },
      { timestampSeconds: 1050, timestampFormatted: '17:30', title: '3D Clearance Verification' }
    ],
    commands: [
      { key: 'D -> U', action: 'Update PCB Document (ECO)', context: 'Schematic' },
      { key: 'D -> S -> D', action: 'Redefine Board Shape', context: 'PCB' }
    ],
    officialDocUrl: 'https://www.altium.com/documentation',
    altiumTrialUrl: 'https://www.altium.com/free-trial?utm_source=eet_learning_hub&utm_medium=tutorial&utm_campaign=altium_develop_library'
  },
  {
    id: 'tut-007',
    youtubeId: '60VRmxI2HO4',
    title: 'Interactive PCB Routing, Ground Pour & DRC Rules for Arduino',
    slug: 'interactive-pcb-routing-ground-pour-drc',
    shortDescription: 'Route power and signal traces, apply copper pours, configure Design Rule Checks (DRC), and resolve clearance errors.',
    fullSummary: 'Master interactive routing modes (Walkaround, Push, Hug) in Altium Designer. Route the Arduino UNO signals, assign 20mil power trace widths, pour top and bottom ground planes, and run a Design Rule Check (DRC) to fix zero errors.',
    durationSeconds: 1620,
    durationFormatted: '27:00',
    publishedDate: '2024-03-05',
    product: 'Altium Designer',
    softwareVersion: 'AD24.3',
    difficulty: 'Intermediate',
    role: 'Hardware & PCB Engineering',
    skills: ['Interactive Routing', 'Design Rules & DRC', 'Polygon Copper Pours'],
    learningPathIds: ['path-003', 'path-004'],
    projectId: 'proj-arduino',
    featured: true,
    chapters: [
      { timestampSeconds: 0, timestampFormatted: '0:00', title: 'Interactive Routing Modes Overview' },
      { timestampSeconds: 420, timestampFormatted: '7:00', title: 'Routing Power & Ground Traces' },
      { timestampSeconds: 900, timestampFormatted: '15:00', title: 'Creating Top & Bottom Polygon Pours' },
      { timestampSeconds: 1320, timestampFormatted: '22:00', title: 'Running & Fixing DRC Errors' }
    ],
    commands: [
      { key: 'Ctrl + W', action: 'Interactive Routing', context: 'PCB' },
      { key: 'P -> G', action: 'Place Polygon Pour', context: 'PCB' },
      { key: 'T -> D', action: 'Design Rule Check', context: 'PCB' }
    ],
    officialDocUrl: 'https://www.altium.com/documentation/altium-designer/interactive-routing-pcb',
    altiumTrialUrl: 'https://www.altium.com/free-trial?utm_source=eet_learning_hub&utm_medium=tutorial&utm_campaign=altium_develop_library'
  },

  // --- POWER ELECTRONICS BUCK CONVERTER SERIES ---
  {
    id: 'tut-008',
    youtubeId: 'eet_pending_008',
    title: 'Buck Converter Circuit Design & Component Selection in Altium',
    slug: 'buck-converter-circuit-design-component-selection',
    shortDescription: 'Design a 12V to 5V 3A DC-DC Buck Switching Regulator schematic with inductor and switching diode layout consideration.',
    fullSummary: 'Detailed walkthrough of high-frequency switching regulator power supply design. Understand switching loop area minimization, feedback resistor calculation, inductor saturation limits, and heat sink thermal requirements.',
    durationSeconds: 1380,
    durationFormatted: '23:00',
    publishedDate: '2024-03-12',
    product: 'Altium Designer',
    softwareVersion: 'AD24.3',
    difficulty: 'Advanced',
    role: 'Hardware & PCB Engineering',
    skills: ['Power Electronics', 'Switching Regulators', 'Thermal Management'],
    learningPathIds: ['path-005'],
    projectId: 'proj-buck',
    featured: true,
    chapters: [
      { timestampSeconds: 0, timestampFormatted: '0:00', title: 'Buck Converter Topologies & Formulas' },
      { timestampSeconds: 380, timestampFormatted: '6:20', title: 'IC Selection (TPS5430 / LM2596)' },
      { timestampSeconds: 820, timestampFormatted: '13:40', title: 'Feedback Loop & Input Capacitor Placement' },
      { timestampSeconds: 1180, timestampFormatted: '19:40', title: 'Thermal Vias & Copper Planes' }
    ],
    commands: [
      { key: 'P -> P', action: 'Place Thermal Via Matrix', context: 'PCB' }
    ],

    officialDocUrl: 'https://www.altium.com/documentation',
    altiumTrialUrl: 'https://www.altium.com/free-trial?utm_source=eet_learning_hub&utm_medium=tutorial&utm_campaign=altium_develop_library'
  },

  // --- ALTIUM DEVELOP PLATFORM & MULTIDISCIPLINARY WORKFLOWS ---
  {
    id: 'tut-009',
    youtubeId: 'jv-m0xkAFck',
    title: 'Altium Develop Tour: Cloud Workspace, Multidisciplinary Co-Creation & Project Hubs',
    slug: 'altium-develop-tour-cloud-workspace',
    shortDescription: 'Discover Altium Develop connected environment bringing together Electrical, Mechanical, Firmware, and Sourcing teams.',
    fullSummary: 'Altium Develop transforms hardware creation into a unified multidisciplinary platform. Learn how to navigate cloud project dashboards, view 3D renders in browser, track change histories, and invite external partners securely.',
    durationSeconds: 890,
    durationFormatted: '14:50',
    publishedDate: '2024-03-20',
    product: 'Altium Develop',
    softwareVersion: 'Develop 2025',
    difficulty: 'Beginner',
    role: 'Engineering Leadership',
    skills: ['Cloud Collaboration', 'Multidisciplinary Workflows', 'Workspace Management'],
    learningPathIds: ['path-006', 'path-007', 'path-010'],
    featured: true,
    chapters: [
      { timestampSeconds: 0, timestampFormatted: '0:00', title: 'What is Altium Develop?' },
      { timestampSeconds: 240, timestampFormatted: '4:00', title: 'Navigating the Web Project Inspector' },
      { timestampSeconds: 510, timestampFormatted: '8:30', title: 'Role-Based Permissions & Invitations' },
      { timestampSeconds: 720, timestampFormatted: '12:00', title: 'Integrating ECAD, MCAD & Procurement' }
    ],
    transcript: [
      { timestampSeconds: 10, timestampFormatted: '0:10', text: 'Altium Develop is designed to bridge the gap between hardware engineering and corporate lifecycle tools.' },
      { timestampSeconds: 300, timestampFormatted: '5:00', text: 'Non-CAD stakeholders can view complete 3D designs directly in their web browser without installing Altium Designer.' }
    ],
    officialDocUrl: 'https://resources.altium.com/p/getting-started-in-develop',
    altiumTrialUrl: 'https://www.altium.com/free-trial?utm_source=eet_learning_hub&utm_medium=tutorial&utm_campaign=altium_develop_library'
  },
  {
    id: 'tut-010',
    youtubeId: 'Noxk9jw-3rs',
    title: 'AI-Assisted Requirements Extraction & Traceability in Altium Develop',
    slug: 'ai-assisted-requirements-extraction-traceability',
    shortDescription: 'Convert PRDs and system specs into linked hardware requirements with automated verification rules and compliance tracking.',
    fullSummary: 'Explore Altium Develop Requirements Portal powered by AI. Automatically extract design rules, operating temperature constraints, voltage tolerances, and compliance standards from PDF specs into verified hardware requirements.',
    durationSeconds: 1050,
    durationFormatted: '17:30',
    publishedDate: '2024-03-28',
    product: 'Altium Develop',
    softwareVersion: 'Develop 2025',
    difficulty: 'Intermediate',
    role: 'Compliance & Sustainability',
    skills: ['Requirements Engineering', 'AI Assistance', 'Verification & Traceability'],
    learningPathIds: ['path-007', 'path-009'],
    featured: true,
    chapters: [
      { timestampSeconds: 0, timestampFormatted: '0:00', title: 'Requirements Management Challenges' },
      { timestampSeconds: 280, timestampFormatted: '4:40', title: 'Uploading PRD Specs & AI Parsing' },
      { timestampSeconds: 610, timestampFormatted: '10:10', title: 'Linking Requirements to Schematic Objects' },
      { timestampSeconds: 890, timestampFormatted: '14:50', title: 'Verification Matrix & Audit Sign-off' }
    ],
    transcript: [
      { timestampSeconds: 15, timestampFormatted: '0:15', text: 'Hardware bugs caused by missed requirement specs cost millions. Altium Develop solves this.' },
      { timestampSeconds: 350, timestampFormatted: '5:50', text: 'Watch as the AI engine extracts maximum DC voltage specifications and converts them into design rule limits.' }
    ],
    officialDocUrl: 'https://resources.altium.com/p/getting-started-in-develop',
    altiumTrialUrl: 'https://www.altium.com/free-trial?utm_source=eet_learning_hub&utm_medium=tutorial&utm_campaign=altium_develop_library'
  },
  {
    id: 'tut-011',
    youtubeId: 'eet_pending_011',
    title: 'Real-Time BOM Risk, Obsolescence & Supply-Chain Insights in Altium Develop',
    slug: 'real-time-bom-risk-obsolescence-supply-chain',
    shortDescription: 'Identify lifecycle risks, lead time spikes, single-source parts, and RoHS compliance issues before releasing your PCB.',
    fullSummary: 'Connect your ActiveBOM component list to global distributor inventory networks (Mouser, DigiKey, Element14) inside Altium Develop. Instantly flag NRND (Not Recommended for New Designs), lifecycle end-of-life parts, and add approved alternate part numbers.',
    durationSeconds: 980,
    durationFormatted: '16:20',
    publishedDate: '2024-04-05',
    product: 'Altium Develop',
    softwareVersion: 'Develop 2025',
    difficulty: 'Intermediate',
    role: 'Procurement & Components',
    skills: ['BOM Management', 'Supply Chain Risk', 'Part Lifecycle Tracking'],
    learningPathIds: ['path-007', 'path-008'],
    featured: true,
    chapters: [
      { timestampSeconds: 0, timestampFormatted: '0:00', title: 'ActiveBOM Live Supply-Chain Dashboard' },
      { timestampSeconds: 260, timestampFormatted: '4:20', title: 'Detecting Component Lifecycle Status' },
      { timestampSeconds: 580, timestampFormatted: '9:40', title: 'Assigning Approved Alternate MPNs' },
      { timestampSeconds: 810, timestampFormatted: '13:30', title: 'Exporting Procurement Risk Report' }
    ],
    officialDocUrl: 'https://www.altium.com/documentation/altium-designer/activebom',
    altiumTrialUrl: 'https://www.altium.com/free-trial?utm_source=eet_learning_hub&utm_medium=tutorial&utm_campaign=altium_develop_library'
  },
  {
    id: 'tut-012',
    youtubeId: 'eet_pending_012',
    title: 'ECAD-MCAD Seamless Collaboration with SolidWorks & Fusion 360',
    slug: 'ecad-mcad-collaboration-solidworks-fusion360',
    shortDescription: 'Push and pull PCB enclosure models, mounting hole positions, and component clearances between Altium and MCAD tools.',
    fullSummary: 'Eliminate physical enclosure interferences by connecting Altium Designer or Altium Develop directly to SolidWorks, Creo, or Fusion 360 via MCAD CoDesigner plugin. Pass 3D copper shapes, board cutouts, and component movements in real time.',
    durationSeconds: 1180,
    durationFormatted: '19:40',
    publishedDate: '2024-04-12',
    product: 'Altium Develop',
    softwareVersion: 'Develop 2025',
    difficulty: 'Intermediate',
    role: 'Manufacturing & Quality',
    skills: ['ECAD-MCAD CoDesign', 'Enclosure Fitting', '3D STEP Sync'],
    learningPathIds: ['path-006', 'path-007'],
    projectId: 'proj-esp32',
    featured: true,
    chapters: [
      { timestampSeconds: 0, timestampFormatted: '0:00', title: 'MCAD CoDesigner Architecture' },
      { timestampSeconds: 310, timestampFormatted: '5:10', title: 'Pushing Board Contours from SolidWorks' },
      { timestampSeconds: 680, timestampFormatted: '11:20', title: 'Pulling Changes in Altium Designer' },
      { timestampSeconds: 990, timestampFormatted: '16:30', title: 'Resolving 3D Connector Collisions' }
    ],
    officialDocUrl: 'https://www.altium.com/documentation',
    altiumTrialUrl: 'https://www.altium.com/free-trial?utm_source=eet_learning_hub&utm_medium=tutorial&utm_campaign=altium_develop_library'
  },
  {
    id: 'tut-013',
    youtubeId: 'PQPA30fd1NY',
    title: 'Engineering Management & Hardware Sprint Planning in Altium Develop',
    slug: 'engineering-management-hardware-sprint-planning',
    shortDescription: 'Provide CTOs and Engineering Managers live visibility into hardware revision milestones, design review status, and team bottlenecks.',
    fullSummary: 'Hardware sprint planning requires real-time tracking of design revisions, markup comments, and manufacturing release states. Learn how engineering managers use Altium Develop management views to monitor R&D progress without disrupting CAD workflows.',
    durationSeconds: 850,
    durationFormatted: '14:10',
    publishedDate: '2024-04-20',
    product: 'Altium Develop',
    softwareVersion: 'Develop 2025',
    difficulty: 'Advanced',
    role: 'Engineering Leadership',
    skills: ['Engineering Management', 'Hardware Sprinting', 'Design Review Audits'],
    learningPathIds: ['path-010'],
    featured: true,
    chapters: [
      { timestampSeconds: 0, timestampFormatted: '0:00', title: 'Why Hardware Management Needs Custom Dashboards' },
      { timestampSeconds: 220, timestampFormatted: '3:40', title: 'Reviewing Comment Threads & Unresolved Design Markups' },
      { timestampSeconds: 510, timestampFormatted: '8:30', title: 'Revision Comparisons (V1 vs V2 Visual Diff)' },
      { timestampSeconds: 730, timestampFormatted: '12:10', title: 'Exporting Executive Status Reports' }
    ],
    officialDocUrl: 'https://resources.altium.com/p/getting-started-in-develop',
    altiumTrialUrl: 'https://www.altium.com/free-trial?utm_source=eet_learning_hub&utm_medium=tutorial&utm_campaign=altium_develop_library'
  },
  {
    id: 'tut-014',
    youtubeId: 'eet_pending_014',
    title: 'ESP32 Wi-Fi & Bluetooth Custom IoT Board Layout & Antenna Rules',
    slug: 'esp32-custom-iot-board-layout-antenna',
    shortDescription: 'Layout a complete ESP32 IoT board with 2.4GHz PCB trace antenna keepouts, RF impedance matching, and ground stitching.',
    fullSummary: 'Detailed walkthrough of high-frequency RF layout rules for ESP32 and Wi-Fi/BLE modules. Configure 50-ohm microstrip trace calculations, antenna clearance zones, copper pour cutouts, and ground stitching via placement.',
    durationSeconds: 1540,
    durationFormatted: '25:40',
    publishedDate: '2024-04-28',
    product: 'Altium Designer',
    softwareVersion: 'AD24.4',
    difficulty: 'Advanced',
    role: 'Hardware & PCB Engineering',
    skills: ['RF Layout', 'Antenna Design', 'Impedance Control'],
    learningPathIds: ['path-003'],
    projectId: 'proj-esp32',
    featured: true,
    chapters: [
      { timestampSeconds: 0, timestampFormatted: '0:00', title: '2.4GHz RF Layout Fundamentals' },
      { timestampSeconds: 380, timestampFormatted: '6:20', title: 'Calculating 50-Ohm Controlled Impedance Traces' },
      { timestampSeconds: 820, timestampFormatted: '13:40', title: 'Antenna Keepout Zone Definition' },
      { timestampSeconds: 1250, timestampFormatted: '20:50', title: 'Adding Ground Stitching Via Array' }
    ],
    commands: [
      { key: 'T -> V', action: 'Add Ground Stitching Vias', context: 'PCB' }
    ],
    officialDocUrl: 'https://www.altium.com/documentation',
    altiumTrialUrl: 'https://www.altium.com/free-trial?utm_source=eet_learning_hub&utm_medium=tutorial&utm_campaign=altium_develop_library'
  },
  {
    id: 'tut-015',
    youtubeId: 'eet_pending_015',
    title: 'Generating Manufacturing Outputs: Gerber X2, ODB++, Pick & Place, and Assembly Draw',
    slug: 'generating-manufacturing-outputs-gerber-odb-pick-place',
    shortDescription: 'Prepare complete manufacturing release packages with OutJob files, IPC-2581 outputs, NC drill, and Pick & Place centroids.',
    fullSummary: 'Zero-defect manufacturing release requires standardized output generation. Learn how to configure Altium OutputJob files (.OutJob) to automatically generate Gerber X2, ODB++, IPC-2581, NC Drill files, Pick & Place location files, and Assembly Drawings with a single click.',
    durationSeconds: 1220,
    durationFormatted: '20:20',
    publishedDate: '2024-05-05',
    product: 'Altium Designer',
    softwareVersion: 'AD24.4',
    difficulty: 'Intermediate',
    role: 'Manufacturing & Quality',
    skills: ['Manufacturing Release', 'Gerber X2', 'OutputJob Files'],
    learningPathIds: ['path-001', 'path-004'],
    projectId: 'proj-arduino',
    featured: true,
    chapters: [
      { timestampSeconds: 0, timestampFormatted: '0:00', title: 'Understanding OutJob Files' },
      { timestampSeconds: 290, timestampFormatted: '4:50', title: 'Configuring Gerber X2 & NC Drill Settings' },
      { timestampSeconds: 670, timestampFormatted: '11:10', title: 'Pick & Place Centroid File Settings' },
      { timestampSeconds: 980, timestampFormatted: '16:20', title: 'Generating Draftsman Assembly Drawings' }
    ],
    officialDocUrl: 'https://www.altium.com/documentation',
    altiumTrialUrl: 'https://www.altium.com/free-trial?utm_source=eet_learning_hub&utm_medium=tutorial&utm_campaign=altium_develop_library'
  }
];
