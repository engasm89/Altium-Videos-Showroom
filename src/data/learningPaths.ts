import { LearningPath } from '../types';

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-001',
    slug: 'altium-designer-foundations',
    title: 'Altium Designer Foundations',
    headline: 'Master schematic capture, project structure, and basic layout fundamentals',
    outcome: 'Confidently navigate Altium Designer interface, configure workspaces, build schematic symbols, and prepare projects for layout.',
    targetRole: 'Hardware & PCB Engineering',
    difficulty: 'Beginner',
    estimatedHours: 4.5,
    tutorialCount: 6,
    iconName: 'Cpu',
    featured: true,
    prerequisites: ['Basic electrical engineering circuit fundamentals'],
    skillsAcquired: [
      'Workspace Preferences & Grids',
      'Schematic Capture & Wiring',
      'Symbol Creation',
      'Net Labels & Annotations',
      'Electrical Rule Check (ERC)',
      'Design Change Orders (ECO)'
    ],
    modules: [
      {
        id: 'p1-m1',
        title: 'Environment & Workspace Configuration',
        description: 'Set up Altium Designer preferences, licensing, and grid defaults.',
        tutorialIds: ['cat-001', 'cat-175']
      },
      {
        id: 'p1-m2',
        title: 'Schematic Capture Basics',
        description: 'Drawing schematics, placing symbols, wiring nets, and compiling.',
        tutorialIds: ['cat-141', 'cat-074']
      },
      {
        id: 'p1-m3',
        title: 'Project Compilation & ERC Validation',
        description: 'Run Electrical Rule Checks and resolve net warnings.',
        tutorialIds: ['cat-244', 'cat-215']
      }
    ]
  },
  {
    id: 'path-002',
    slug: 'component-library-development',
    title: 'Component Library Development',
    headline: 'Build IPC-compliant footprints, 3D STEP models, and managed part catalogs',
    outcome: 'Create zero-defect schematic symbols and PCB footprints linked to real manufacturer part numbers (MPNs).',
    targetRole: 'Procurement & Components',
    difficulty: 'Intermediate',
    estimatedHours: 5.0,
    tutorialCount: 2,
    iconName: 'Boxes',
    featured: true,
    prerequisites: ['Altium Designer Foundations or equivalent'],
    skillsAcquired: [
      'IPC-7351 Footprint Standards',
      'IPC Compliant Footprint Wizard',
      '3D STEP Model Alignment',
      'Courtyard & Silkscreen Clearance',
      'ActiveBOM MPN Links'
    ],
    modules: [
      {
        id: 'p2-m1',
        title: 'Schematic Symbol Creation',
        description: 'Creating multi-part symbols, pin types, and parameters.',
        tutorialIds: ['cat-141']
      },
      {
        id: 'p2-m2',
        title: 'Precision PCB Footprints & 3D Integration',
        description: 'Using IPC Wizard, creating QFN/LQFP footprints, aligning 3D STEP files.',
        tutorialIds: ['cat-215']
      }
    ]
  },
  {
    id: 'path-003',
    slug: 'pcb-layout-and-routing',
    title: 'PCB Layout & Interactive Routing',
    headline: 'Master component placement, layer stackups, DRC rules, and polygon pours',
    outcome: 'Layout multi-layer PCBs with optimal signal integrity, high-speed routing modes, and ground copper pours.',
    targetRole: 'Hardware & PCB Engineering',
    difficulty: 'Intermediate',
    estimatedHours: 6.5,
    tutorialCount: 3,
    iconName: 'Layers',
    featured: true,
    prerequisites: ['Schematic Capture knowledge'],
    skillsAcquired: [
      'Board Contour Definition',
      'Layer Stackup & Dielectrics',
      'Interactive Routing Modes',
      'Polygon Ground Pours',
      'Design Rule Checks (DRC)'
    ],
    modules: [
      {
        id: 'p3-m1',
        title: 'Placement & Sub-circuit Grouping',
        description: 'Group high-speed signals, crystals, and power paths.',
        tutorialIds: ['cat-067']
      },
      {
        id: 'p3-m2',
        title: 'Interactive Routing & Copper Pours',
        description: 'Walkaround and Push routing, ground stitching, DRC.',
        tutorialIds: ['cat-214', 'cat-002']
      }
    ]
  },
  {
    id: 'path-004',
    slug: 'complete-arduino-uno-design',
    title: 'Complete Arduino UNO Hardware Project',
    headline: 'End-to-end design walkthrough of an Arduino UNO hardware clone from scratch',
    outcome: 'Build a production-ready Arduino UNO PCB from schematic capture to Gerber and BOM output generation.',
    targetRole: 'Hardware & PCB Engineering',
    difficulty: 'Intermediate',
    estimatedHours: 7.0,
    tutorialCount: 5,
    iconName: 'CircuitBoard',
    featured: true,
    prerequisites: ['Basic Altium navigation'],
    skillsAcquired: [
      'ATmega328P Microcontroller Circuits',
      'USB-UART Power Selection',
      'Arduino Shield Layout Compatibility',
      'OutJob Manufacturing Release'
    ],
    modules: [
      {
        id: 'p4-m1',
        title: 'Arduino Schematic Capture',
        description: 'Power regulation, ATmega328P oscillator, USB transceiver.',
        tutorialIds: ['cat-175', 'cat-074']
      },
      {
        id: 'p4-m2',
        title: 'Layout & Interactive Routing',
        description: 'Shield connector spacing, ground plane pour, DRC.',
        tutorialIds: ['cat-067', 'cat-214']
      },
      {
        id: 'p4-m3',
        title: 'Manufacturing Release',
        description: 'Gerber X2, NC Drill, Pick & Place centroid generation.',
        tutorialIds: ['cat-244']
      }
    ]
  },
  {
    id: 'path-005',
    slug: 'power-electronics-pcb-design',
    title: 'Power Electronics & Buck Converter Design',
    headline: 'High-frequency DC-DC switching regulator design, thermal dissipation, and loop layout',
    outcome: 'Design high-efficiency DC-DC converters with low EMI switching loops and thermal via heat sinking.',
    targetRole: 'Hardware & PCB Engineering',
    difficulty: 'Advanced',
    estimatedHours: 5.5,
    tutorialCount: 1,
    iconName: 'Zap',
    featured: false,
    prerequisites: ['DC-DC converter theory'],
    skillsAcquired: [
      'Switching Regulator Loop Minimization',
      'Inductor & Catch Diode Placement',
      'Thermal Via Arrays',
      'Power Ground Plane Isolation'
    ],
    modules: [
      {
        id: 'p5-m1',
        title: 'Buck Converter Topologies',
        description: 'Schematic capture, feedback calculation, component rating.',
        tutorialIds: ['cat-133']
      }
    ]
  },
  {
    id: 'path-006',
    slug: 'altium-develop-foundations',
    title: 'Altium Develop Foundations',
    headline: 'Unified cloud workspace for multidisciplinary electronics development teams',
    outcome: 'Leverage Altium Develop cloud ecosystem for design reviews, version history, and team collaboration.',
    targetRole: 'Engineering Leadership',
    difficulty: 'Beginner',
    estimatedHours: 3.5,
    tutorialCount: 2,
    iconName: 'Cloud',
    featured: true,
    prerequisites: ['None'],
    skillsAcquired: [
      'Cloud Workspace Management',
      'Web-Based CAD Viewer',
      'Version Control History',
      'Design Markup & Comments'
    ],
    modules: [
      {
        id: 'p6-m1',
        title: 'Platform Architecture & Navigation',
        description: 'Web project inspector, browser 3D view, user permissions.',
        tutorialIds: ['cat-101', 'cat-114']
      }
    ]
  },
  {
    id: 'path-007',
    slug: 'multidisciplinary-product-development',
    title: 'Multidisciplinary Product Co-Creation',
    headline: 'Connecting Electrical, Mechanical, Procurement, and Embedded engineering teams',
    outcome: 'Unify hardware sub-disciplines using ECAD-MCAD CoDesigner, AI requirements, and live BOM analytics.',
    targetRole: 'Product & Applications',
    difficulty: 'Intermediate',
    estimatedHours: 6.0,
    tutorialCount: 3,
    iconName: 'Share2',
    featured: true,
    prerequisites: ['Basic understanding of product development'],
    skillsAcquired: [
      'ECAD-MCAD SolidWorks / Fusion Sync',
      'AI Requirements Linking',
      'Firmware Pin Map Export',
      'Supplier Risk Management'
    ],
    modules: [
      {
        id: 'p7-m1',
        title: 'Cross-Functional Engineering Sync',
        description: 'SolidWorks sync, requirements extraction, BOM risk.',
        tutorialIds: ['cat-090', 'cat-125', 'cat-140']
      }
    ]
  },
  {
    id: 'path-008',
    slug: 'bom-and-supply-chain-risk',
    title: 'BOM & Supply-Chain Risk Management',
    headline: 'Proactive component lifecycle, lead-time tracking, alternate part numbers, and pricing',
    outcome: 'Prevent costly production delays by spotting EOL/NRND parts and single-source risks before PCB release.',
    targetRole: 'Procurement & Components',
    difficulty: 'Intermediate',
    estimatedHours: 4.0,
    tutorialCount: 1,
    iconName: 'TrendingUp',
    featured: false,
    prerequisites: ['BOM concepts'],
    skillsAcquired: [
      'ActiveBOM Distributor Feeds',
      'Lifecycle Status Alerts',
      'Approved Alternate Part Numbers',
      'Component Lead-Time Risk Index'
    ],
    modules: [
      {
        id: 'p8-m1',
        title: 'Live Supply Chain Analytics',
        description: 'Connecting ActiveBOM to Mouser/DigiKey API feeds.',
        tutorialIds: ['cat-125']
      }
    ]
  },
  {
    id: 'path-009',
    slug: 'requirements-to-verification',
    title: 'Requirements to Verification & Compliance',
    headline: 'AI-assisted PRD extraction, requirement-to-net linkage, and compliance audit matrices',
    outcome: 'Establish end-to-end traceability from customer PRD specs to physical board test points.',
    targetRole: 'Compliance & Sustainability',
    difficulty: 'Advanced',
    estimatedHours: 4.5,
    tutorialCount: 1,
    iconName: 'ShieldCheck',
    featured: false,
    prerequisites: ['System requirements overview'],
    skillsAcquired: [
      'AI-Powered PRD Parsing',
      'Traceability Matrix',
      'Verification Rule Creation',
      'Compliance Test Evidence'
    ],
    modules: [
      {
        id: 'p9-m1',
        title: 'Requirements Traceability',
        description: 'AI spec parsing and schematic net rule binding.',
        tutorialIds: ['cat-090']
      }
    ]
  },
  {
    id: 'path-010',
    slug: 'engineering-management-visibility',
    title: 'Engineering Management & Project Visibility',
    headline: 'Real-time project status, hardware sprint tracking, review sign-offs, and decision history',
    outcome: 'Manage hardware design cycles with executive dashboards, visual diff checks, and clear audit trails.',
    targetRole: 'Engineering Leadership',
    difficulty: 'Advanced',
    estimatedHours: 3.5,
    tutorialCount: 2,
    iconName: 'Briefcase',
    featured: false,
    prerequisites: ['Engineering leadership role'],
    skillsAcquired: [
      'Hardware Sprint Planning',
      'Visual Diff Inspection',
      'Unresolved Comment Tracking',
      'Executive Release Sign-offs'
    ],
    modules: [
      {
        id: 'p10-m1',
        title: 'Hardware Lifecycle Control',
        description: 'R&D dashboards, comment auditing, release gates.',
        tutorialIds: ['cat-101', 'cat-114']
      }
    ]
  }
];
