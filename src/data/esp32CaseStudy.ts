/** Guided multidisciplinary ESP32 product case study — stage → stakeholders → lessons. */

export interface CaseStudyStakeholder {
  roleSlug: string;
  roleTitle: string;
  entryPoint: string;
}

export interface CaseStudyStage {
  id: string;
  title: string;
  summary: string;
  stakeholders: CaseStudyStakeholder[];
  /** Preferred catalog slugs (resolved at render time). */
  tutorialSlugs: string[];
  toolLinks?: { label: string; path: string }[];
}

export const ESP32_CASE_STUDY = {
  slug: 'esp32-product',
  title: 'ESP32 IoT Product — Multidisciplinary Case Study',
  headline: 'From requirements to manufacturing release in one guided story',
  description:
    'Follow a compact Wi-Fi/BLE ESP32 product through the full electronics product-development loop. Each stage shows who enters the workflow and which EET lessons demonstrate the handoff — so Altium Develop reads as multidisciplinary co-creation, not only PCB CAD.',
  projectSlug: 'esp32-iot-development-board',
  stages: [
    {
      id: 'requirements',
      title: 'Requirements',
      summary:
        'Capture product constraints (RF keepouts, battery life, USB-C power, enclosure fit) and link them to verifiable design intent before schematic freeze.',
      stakeholders: [
        {
          roleSlug: 'engineering-leadership',
          roleTitle: 'Engineering management',
          entryPoint: 'Owns scope, schedule, and acceptance criteria for the ESP32 SKU.',
        },
        {
          roleSlug: 'compliance-sustainability',
          roleTitle: 'Compliance & product',
          entryPoint: 'Adds regulatory, RoHS, and labeling requirements into the same thread.',
        },
        {
          roleSlug: 'product-applications',
          roleTitle: 'Applications / firmware',
          entryPoint: 'Maps GPIO, buses, and antenna constraints that firmware depends on.',
        },
      ],
      tutorialSlugs: [
        'ai-assisted-requirements-to-verified-hardware-in-altium-develop',
        'from-requirement-to-test-point-in-altium-develop',
        'introduction-to-altium-develop',
      ],
      toolLinks: [
        {
          label: 'Browse Develop tutorials',
          path: '/tutorials?product=Altium%20Develop',
        },
      ],
    },
    {
      id: 'pcb',
      title: 'PCB design',
      summary:
        'Create the ESP32 symbol and footprint, place RF-sensitive layout, and keep mechanical keepouts visible to ECAD and MCAD reviewers.',
      stakeholders: [
        {
          roleSlug: 'hardware-pcb-engineering',
          roleTitle: 'Hardware & PCB',
          entryPoint: 'Owns schematic, footprint, RF layout, and stackup decisions.',
        },
        {
          roleSlug: 'product-applications',
          roleTitle: 'Embedded / systems',
          entryPoint: 'Confirms pin mux and peripheral routing against firmware needs.',
        },
        {
          roleSlug: 'manufacturing-quality',
          roleTitle: 'Manufacturing (early)',
          entryPoint: 'Flags courtyard, fiducial, and panelization constraints while layout is still fluid.',
        },
      ],
      tutorialSlugs: [
        '2-altium-develop-tutorial-create-esp32-symbol-step-by-step',
        '4-create-esp32-pcb-footprint-library-from-scratch',
        'design-motion-sensor-with-esp32-using-altium-designer',
      ],
      toolLinks: [
        { label: 'DRC assistant lab', path: '/tools/drc' },
        { label: 'Stackup inspector', path: '/tools/stackup' },
      ],
    },
    {
      id: 'sourcing',
      title: 'Sourcing',
      summary:
        'Review ActiveBOM risk, lead times, and alternates while the design is still changeable — before a late EOL surprise forces a respin.',
      stakeholders: [
        {
          roleSlug: 'procurement-components',
          roleTitle: 'Procurement',
          entryPoint: 'Primary entry: lifecycle, AVL, and distributor risk on the live BOM.',
        },
        {
          roleSlug: 'hardware-pcb-engineering',
          roleTitle: 'Hardware & PCB',
          entryPoint: 'Approves footprint-compatible alternates without breaking layout.',
        },
        {
          roleSlug: 'engineering-leadership',
          roleTitle: 'Engineering management',
          entryPoint: 'Sees cost/lead-time risk before committing to a release gate.',
        },
      ],
      tutorialSlugs: [
        '10-bom-supply-chain-and-fast-supplier-feedback-in-altium-develop',
        '2-altium-develop-tutorial-create-esp32-symbol-step-by-step',
      ],
      toolLinks: [{ label: 'ActiveBOM risk simulator', path: '/tools/activebom' }],
    },
    {
      id: 'review',
      title: 'Review',
      summary:
        'Run contextual design reviews — electrical, mechanical, and management — without exporting static PDFs into email threads.',
      stakeholders: [
        {
          roleSlug: 'hardware-pcb-engineering',
          roleTitle: 'Hardware & PCB',
          entryPoint: 'Responds to in-context comments on nets, clearances, and RF keepouts.',
        },
        {
          roleSlug: 'manufacturing-quality',
          roleTitle: 'Manufacturing & QA',
          entryPoint: 'Reviews assembly drawings and DFM notes alongside electrical peers.',
        },
        {
          roleSlug: 'engineering-leadership',
          roleTitle: 'Engineering management',
          entryPoint: 'Sees review status and open threads without chasing local file versions.',
        },
      ],
      tutorialSlugs: [
        '05-comments-reviews-and-design-intent-in-altium-develop',
        'showcasing-mechanical-collaboration-altium-develop',
        'working-with-external-partners-in-altium-develop',
      ],
      toolLinks: [
        {
          label: 'Develop team workspace project',
          path: '/projects/altium-develop-team-workspace',
        },
      ],
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing release',
      summary:
        'Package Gerbers, assembly docs, and release notes with early fab feedback already folded in — then verify post-release changes stay traceable.',
      stakeholders: [
        {
          roleSlug: 'manufacturing-quality',
          roleTitle: 'Manufacturing & QA',
          entryPoint: 'Owns fab package sign-off and first-article feedback loops.',
        },
        {
          roleSlug: 'procurement-components',
          roleTitle: 'Procurement',
          entryPoint: 'Locks AVL / alternate decisions into the released BOM snapshot.',
        },
        {
          roleSlug: 'engineering-leadership',
          roleTitle: 'Engineering management',
          entryPoint: 'Gates the release on shared readiness, not a private folder zip.',
        },
      ],
      tutorialSlugs: [
        '10-how-to-release-a-project-in-altium-develop',
        '4-create-esp32-pcb-footprint-library-from-scratch',
      ],
      toolLinks: [
        {
          label: 'Professional PCB manufacturing project',
          path: '/projects/professional-pcb-manufacturing-release',
        },
      ],
    },
  ] as CaseStudyStage[],
};
