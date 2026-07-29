import { EngineeringRole } from '../types';

export const ENGINEERING_ROLES: EngineeringRole[] = [
  {
    id: 'role-pcb',
    slug: 'hardware-pcb-engineering',
    title: 'Hardware & PCB Engineer',
    category: 'Hardware & PCB Engineering',
    description: 'Designs schematic circuits, defines stackups, places components, routes high-speed signals, and generates manufacturing releases.',
    keyResponsibilities: [
      'Schematic capture & circuit simulation',
      'High-density component placement & 3D clearance checks',
      'Interactive routing, differential pairs & length matching',
      'Design Rule Checks (DRC) & Gerber manufacturing output'
    ],
    primaryWorkflows: [
      'Schematic Entry',
      'Component Footprints',
      'Interactive Routing',
      'Signal Integrity',
      'OutJob Release'
    ],
    recommendedPathId: 'path-001',
    tutorialIds: ['cat-036', 'cat-178', 'cat-191', 'cat-197', 'cat-186', 'cat-133', 'cat-047'],
    iconName: 'Cpu'
  },
  {
    id: 'role-procurement',
    slug: 'procurement-components',
    title: 'Procurement & Component Specialist',
    category: 'Procurement & Components',
    description: 'Manages component libraries, distributor price feeds, lifecycle risks (NRND/EOL), and alternate part approvals.',
    keyResponsibilities: [
      'Maintaining standardized corporate symbol & footprint libraries',
      'ActiveBOM live price and lead-time monitoring',
      'Identifying single-source obsolete component risks',
      'Managing approved vendor lists (AVL) & alternate MPNs'
    ],
    primaryWorkflows: [
      'ActiveBOM',
      'Distributor API Sync',
      'Lifecycle Monitoring',
      'Alternate Part Number Assignment'
    ],
    recommendedPathId: 'path-008',
    tutorialIds: ['cat-189', 'cat-161'],
    iconName: 'ShoppingBag'
  },
  {
    id: 'role-manufacturing',
    slug: 'manufacturing-quality',
    title: 'Manufacturing & Quality Engineer',
    category: 'Manufacturing & Quality',
    description: 'Ensures Design for Manufacturability (DFM) compliance, panelization, assembly drawings, and Gerber/ODB++ verification.',
    keyResponsibilities: [
      'DFM / DFA rule checks for automated SMT lines',
      'Draftsman fabrication and assembly documentation',
      'Pick & Place centroid file verification',
      'ECAD-MCAD enclosure clearance sign-off'
    ],
    primaryWorkflows: [
      'Gerber X2 Output',
      'IPC-2581 Output',
      'Draftsman Drawings',
      'ECAD-MCAD CoDesign'
    ],
    recommendedPathId: 'path-004',
    tutorialIds: ['cat-191', 'cat-160', 'cat-150'],
    iconName: 'Wrench'
  },
  {
    id: 'role-embedded',
    slug: 'product-applications',
    title: 'Embedded & Systems Engineer',
    category: 'Product & Applications',
    description: 'Integrates microcontrollers, sensor buses, firmware pinouts, and system peripherals into physical PCB designs.',
    keyResponsibilities: [
      'Microcontroller pinout optimization & GPIO mapping',
      'Communication bus routing (I2C, SPI, UART, CAN, USB)',
      'Exporting C header files from pin mapping',
      'Validating power tree rails & decoupling capacitors'
    ],
    primaryWorkflows: [
      'Pin Mapping',
      'Power Tree Validation',
      'RF Antenna Keepouts',
      'Firmware Pin Header Export'
    ],
    recommendedPathId: 'path-004',
    tutorialIds: ['cat-180', 'cat-047'],
    iconName: 'Terminal'
  },
  {
    id: 'role-leadership',
    slug: 'engineering-leadership',
    title: 'Engineering Manager & CTO',
    category: 'Engineering Leadership',
    description: 'Oversees R&D project timelines, design review sign-offs, cross-functional collaboration, and audit history.',
    keyResponsibilities: [
      'Monitoring multi-project hardware release pipelines',
      'Conducting browser-based design reviews with markup comments',
      'Inspecting visual diff changes between hardware revisions',
      'Managing R&D resource allocation & component risks'
    ],
    primaryWorkflows: [
      'Web Design Reviews',
      'Hardware Sprint Planning',
      'Visual Diff Inspection',
      'Release Approval Gates'
    ],
    recommendedPathId: 'path-010',
    tutorialIds: ['cat-188', 'cat-170', 'cat-163'],
    iconName: 'Users'
  },
  {
    id: 'role-compliance',
    slug: 'compliance-sustainability',
    title: 'Regulatory & Compliance Engineer',
    category: 'Compliance & Sustainability',
    description: 'Verifies FCC/CE electromagnetic compatibility (EMC), RoHS/REACH environmental standards, and safety requirements.',
    keyResponsibilities: [
      'Parsing product requirement documents into design constraints',
      'Checking creepage, clearance & high-voltage isolation',
      'Maintaining environmental compliance records (RoHS, REACH)',
      'Building requirement-to-verification audit matrices'
    ],
    primaryWorkflows: [
      'AI Requirements Parsing',
      'EMC Clearance Checks',
      'Environmental Compliance Verification'
    ],
    recommendedPathId: 'path-009',
    tutorialIds: ['cat-170', 'cat-161'],
    iconName: 'ShieldAlert'
  },
  {
    id: 'role-library',
    slug: 'component-library-architect',
    title: 'Component Library Architect',
    category: 'Procurement & Components',
    description: 'Role hub for engineers who own corporate SchLib/PcbLib standards, IPC footprints, and symbol quality gates.',
    keyResponsibilities: [
      'IPC-compliant footprint & courtyard standards',
      'Symbol electrical-type conventions',
      'Library release & versioning',
      'Part parameter completeness for BOM'
    ],
    primaryWorkflows: [
      'Symbol Creation',
      'Footprint Wizard',
      'Library Integration',
      'MPN Parameters'
    ],
    recommendedPathId: 'path-002',
    tutorialIds: ['cat-189', 'cat-191', 'cat-004'],
    iconName: 'Boxes'
  },
  {
    id: 'role-fae',
    slug: 'field-applications-engineer',
    title: 'Field Applications / Customer Success Engineer',
    category: 'Product & Applications',
    description: 'Role hub covering demo boards, customer enablement content, and Develop workspace onboarding for partner conversations.',
    keyResponsibilities: [
      'Demo project readiness',
      'Workspace onboarding walkthroughs',
      'Customer-facing design reviews',
      'Mapping pain points to tutorial curricula'
    ],
    primaryWorkflows: [
      'Develop Onboarding',
      'Project Hubs',
      'Design Reviews',
      'Trial Enablement'
    ],
    recommendedPathId: 'path-006',
    tutorialIds: ['cat-188', 'cat-178', 'cat-163'],
    iconName: 'Briefcase'
  }
];
