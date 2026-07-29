import { PersonaJourney } from '../types';

/**
 * Six Altium Develop persona journeys — outcome-led, not a duplicate of `/roles`.
 * Roles map catalog categories; personas answer “what Develop solves for my job.”
 */
export const PERSONA_JOURNEYS: PersonaJourney[] = [
  {
    id: 'persona-pcb',
    slug: 'pcb-designer',
    selectorLabel: 'PCB Designer',
    title: 'Hardware Design & Engineering',
    audience: 'Hardware design and engineering',
    iconName: 'Cpu',
    developOutcomes: [
      'One workspace for schematic → PCB → release without emailing ZIP dumps',
      'Faster design reviews with browser markup instead of meeting screenshares',
      'Fewer late ECOs from mechanical and firmware pin conflicts',
      'Clear revision history when a board spins mid-sprint',
    ],
    recommendedPathId: 'path-006',
    tutorialIds: ['cat-101', 'cat-048', 'cat-074', 'cat-084', 'cat-214', 'cat-058'],
    workflowExample: {
      title: 'Spin a revision without losing the team',
      narrative:
        'You finish a routing pass on an ESP32 carrier, invite mechanical and firmware into the same Develop project, resolve clearance comments in-browser, then release Gerbers from a signed-off revision.',
      steps: [
        'Open the shared Develop project and pull the latest electrical revision',
        'Complete routing / plane work and run DRC in the connected Designer flow',
        'Invite mechanical + firmware to leave browser comments on the 3D view',
        'Resolve comments, tag a release, and hand manufacturing a single revision ID',
      ],
    },
    relevantTool: {
      tab: 'drc',
      label: 'DRC Assistant',
      description: 'Practice common clearance and manufacturing rule checks before a release gate.',
    },
    ctaLabel: 'Try Altium Develop for hardware teams',
    utmContent: 'persona-pcb-designer',
    relatedRoleSlug: 'hardware-pcb-engineering',
  },
  {
    id: 'persona-procurement',
    slug: 'procurement-manager',
    selectorLabel: 'Procurement Manager',
    title: 'Procurement & BOM Management',
    audience: 'Procurement and BOM management',
    iconName: 'ShoppingBag',
    developOutcomes: [
      'Live BOM risk signals before PCB release locks the AVL',
      'Earlier visibility into EOL / NRND / single-source parts',
      'Shared part context with design — not a stale spreadsheet handoff',
      'Faster alternate MPN decisions tied to the same project revision',
    ],
    recommendedPathId: 'path-008',
    tutorialIds: ['cat-125', 'cat-258', 'cat-283', 'cat-274', 'cat-224'],
    workflowExample: {
      title: 'Kill a single-source risk before fab',
      narrative:
        'ActiveBOM flags a microcontroller as NRND with 40-week lead time. You propose two alternates in the same Develop project, engineering validates pin-compat footprints, and the release AVL updates before Gerber drop.',
      steps: [
        'Open the project BOM in Develop and sort by lifecycle / lead-time risk',
        'Flag NRND / single-source lines and attach distributor evidence',
        'Propose alternates; request footprint pin-check from hardware',
        'Lock the approved AVL on the release revision manufacturing will build',
      ],
    },
    relevantTool: {
      tab: 'activebom',
      label: 'ActiveBOM Risk Simulator',
      description: 'Walk sample BOMs to practice spotting lifecycle and lead-time risk before release.',
    },
    ctaLabel: 'Evaluate Develop for BOM & supply chain',
    utmContent: 'persona-procurement-manager',
    relatedRoleSlug: 'procurement-components',
  },
  {
    id: 'persona-manufacturing',
    slug: 'manufacturing-engineer',
    selectorLabel: 'Manufacturing Engineer',
    title: 'Manufacturing, Testing & QA',
    audience: 'Manufacturing, testing, and QA',
    iconName: 'Wrench',
    developOutcomes: [
      'DFM feedback lands on the same revision design is releasing',
      'ECAD–MCAD enclosure conflicts surface before panelization',
      'Clearer assembly / fab package tied to project history',
      'Fewer “wrong Gerber set” escapes between engineering and CM',
    ],
    recommendedPathId: 'path-007',
    tutorialIds: ['cat-199', 'cat-140', 'cat-248', 'cat-244', 'cat-058'],
    workflowExample: {
      title: 'Sign off DFM on the revision you will build',
      narrative:
        'CM feedback arrives as Develop comments on keepouts and fiducials. You confirm enclosure clearance with mechanical, regenerate outputs from the approved revision, and archive the package against that release ID.',
      steps: [
        'Review fab/assembly outputs against the pending Develop release',
        'Log DFM issues as comments on the shared project (not a side email)',
        'Confirm mechanical clearance with ECAD–MCAD sync',
        'Approve the revision and freeze the manufacturing package',
      ],
    },
    relevantTool: {
      tab: 'stackup',
      label: 'Stackup Inspector',
      description: 'Inspect common stackup presets so impedance and fab notes stay aligned with release intent.',
    },
    ctaLabel: 'See Develop for manufacturing handoff',
    utmContent: 'persona-manufacturing-engineer',
    relatedRoleSlug: 'manufacturing-quality',
  },
  {
    id: 'persona-applications',
    slug: 'applications-engineer',
    selectorLabel: 'Applications / Product Engineer',
    title: 'Applications, Technical Marketing & Product',
    audience: 'Applications, technical marketing, and product',
    iconName: 'Briefcase',
    developOutcomes: [
      'Demo boards and reference designs stay in a shareable workspace',
      'Product requirements stay linked to the hardware under discussion',
      'FAE and marketing review the same revision customers will see',
      'Faster enablement content from real project context — not screenshots of local files',
    ],
    recommendedPathId: 'path-007',
    tutorialIds: ['cat-097', 'cat-101', 'cat-090', 'cat-140', 'cat-114'],
    workflowExample: {
      title: 'Ship a customer-ready demo from one workspace',
      narrative:
        'Product writes a short PRD for a sensor demo. Applications maps requirements in Develop, hardware publishes a reviewable board, and FAE walks the customer through the same browser project during a call.',
      steps: [
        'Capture demo PRD bullets into Develop requirements',
        'Link critical nets / connectors to those requirements',
        'Publish a review revision for FAE + marketing walkthrough',
        'Use the same project link in customer enablement sessions',
      ],
    },
    relevantTool: {
      tab: 'projects',
      label: 'Project Hubs',
      description: 'Browse hardware project hubs that mirror how demos and reference designs are packaged for teams.',
    },
    ctaLabel: 'Explore Develop for product & applications',
    utmContent: 'persona-applications-engineer',
    relatedRoleSlug: 'field-applications-engineer',
  },
  {
    id: 'persona-management',
    slug: 'engineering-manager',
    selectorLabel: 'Engineering Manager',
    title: 'Engineering Management & Strategy',
    audience: 'Engineering management and strategic decision-makers',
    iconName: 'Users',
    developOutcomes: [
      'Release status without chasing CAD seat owners for ZIP files',
      'Visual diffs and comment audit trails for design reviews',
      'Cross-functional visibility (mech, procurement, firmware) in one place',
      'Clearer go / no-go evidence for spin decisions',
    ],
    recommendedPathId: 'path-010',
    tutorialIds: ['cat-101', 'cat-097', 'cat-114', 'cat-058', 'cat-030'],
    workflowExample: {
      title: 'Approve a spin with an audit trail',
      narrative:
        'Two open comments block release. You open the Develop review, see who owns each thread, confirm BOM risk is green, and sign off the revision that program management will schedule.',
      steps: [
        'Open the hardware program dashboard / project in Develop',
        'Triage unresolved review comments and assign owners',
        'Check BOM / supply risk before committing the spin',
        'Record release approval against the revision ID',
      ],
    },
    relevantTool: {
      tab: 'myActivity',
      label: 'My Activity',
      description: 'See your browser-local learning progress and outbound evaluation signals — not site-wide KPIs.',
    },
    ctaLabel: 'Evaluate Develop for engineering leadership',
    utmContent: 'persona-engineering-manager',
    relatedRoleSlug: 'engineering-leadership',
  },
  {
    id: 'persona-compliance',
    slug: 'compliance-engineer',
    selectorLabel: 'Compliance Engineer',
    title: 'Compliance & Sustainability',
    audience: 'Compliance and sustainability',
    iconName: 'ShieldAlert',
    developOutcomes: [
      'Requirements-to-hardware traceability instead of orphaned PRD PDFs',
      'Earlier visibility into materials / lifecycle constraints that affect RoHS / REACH stories',
      'Verification evidence tied to the same project revision under audit',
      'Shared compliance threads across design, procurement, and QA',
    ],
    recommendedPathId: 'path-009',
    tutorialIds: ['cat-090', 'cat-157', 'cat-190', 'cat-125', 'cat-250'],
    workflowExample: {
      title: 'Trace a safety requirement to a test point',
      narrative:
        'A PRD requires reinforced isolation on a mains-sensing input. You parse the requirement in Develop, bind it to the isolation net / creepage rules, and attach verification evidence when QA closes the test point.',
      steps: [
        'Import or paste the compliance-critical requirement into Develop',
        'Link the requirement to schematic nets / design constraints',
        'Coordinate BOM material flags with procurement where needed',
        'Attach verification / test-point evidence on the release revision',
      ],
    },
    relevantTool: {
      tab: 'glossary',
      label: 'PCB & Altium Glossary',
      description: 'Align terminology (creepage, RoHS, REACH, DRC) across compliance and design conversations.',
    },
    ctaLabel: 'Explore Develop for compliance workflows',
    utmContent: 'persona-compliance-engineer',
    relatedRoleSlug: 'compliance-sustainability',
  },
];

export function findPersonaBySlug(slug: string): PersonaJourney | undefined {
  return PERSONA_JOURNEYS.find((p) => p.slug === slug);
}
