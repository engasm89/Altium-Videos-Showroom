/**
 * Flagship Interactive Product-Development Workflow Map.
 * Stages map multidisciplinary hardware delivery to Altium Develop capabilities,
 * Develop-preferring catalog tutorials, and curated learning paths.
 */

export interface WorkflowStageCapability {
  title: string;
  description: string;
}

export interface WorkflowStage {
  id: string;
  slug: string;
  order: number;
  title: string;
  shortLabel: string;
  summary: string;
  /** Role titles shown in the UI (aligned with ENGINEERING_ROLES where possible). */
  responsibleRoles: string[];
  /** Optional role slugs for deep-links into /roles/:slug */
  roleSlugs: string[];
  commonProblems: string[];
  developCapability: WorkflowStageCapability;
  /** Catalog tutorial IDs — prefer Altium Develop; Designer only as fallback. */
  tutorialIds: string[];
  learningPathId: string;
  /** utm_content slug for outbound Altium CTA */
  utmContent: string;
  iconName:
    | 'Lightbulb'
    | 'FileText'
    | 'Network'
    | 'Cpu'
    | 'ShoppingCart'
    | 'MessageSquare'
    | 'Factory'
    | 'ShieldCheck';
}

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: 'wf-concept',
    slug: 'concept',
    order: 1,
    title: 'Concept',
    shortLabel: 'Concept',
    summary:
      'Frame the product intent, form the cross-functional team, and stand up a shared workspace before any CAD file becomes “source of truth.”',
    responsibleRoles: [
      'Engineering Manager & CTO',
      'Hardware & PCB Engineer',
      'Field Applications / Customer Success Engineer',
    ],
    roleSlugs: ['engineering-leadership', 'hardware-pcb-engineering', 'field-applications-engineer'],
    commonProblems: [
      'Kickoff lives in chat threads and personal drives — no shared project home',
      'Electrical, mechanical, and firmware join late with conflicting assumptions',
      'New hires cannot reconstruct why the product exists from file names alone',
    ],
    developCapability: {
      title: 'Connected team workspace & project hub',
      description:
        'Altium Develop gives the whole product team one cloud project hub: permissions, browser 3D context, and a living home for intent — not a zip of .PrjPcb files emailed around.',
    },
    tutorialIds: ['cat-123', 'cat-101', 'cat-092', 'cat-167', 'cat-119'],
    learningPathId: 'path-006',
    utmContent: 'workflow_concept',
    iconName: 'Lightbulb',
  },
  {
    id: 'wf-requirements',
    slug: 'requirements',
    order: 2,
    title: 'Requirements',
    shortLabel: 'Requirements',
    summary:
      'Turn PRDs, customer feedback, and tickets into traceable hardware requirements that stay linked through design and test.',
    responsibleRoles: [
      'Regulatory & Compliance Engineer',
      'Engineering Manager & CTO',
      'Hardware & PCB Engineer',
    ],
    roleSlugs: ['compliance-sustainability', 'engineering-leadership', 'hardware-pcb-engineering'],
    commonProblems: [
      'Specs live in PDFs; constraints never reach nets, clearances, or test points',
      'Jira / ticket intent is lost when schematic ownership changes',
      'Compliance asks for evidence after layout is already frozen',
    ],
    developCapability: {
      title: 'AI-assisted requirements & traceability',
      description:
        'Extract constraints from documents, keep requirement threads visible to non-CAD stakeholders, and preserve an audit trail from customer ask → verified hardware.',
    },
    tutorialIds: ['cat-090', 'cat-186', 'cat-187', 'cat-190'],
    learningPathId: 'path-009',
    utmContent: 'workflow_requirements',
    iconName: 'FileText',
  },
  {
    id: 'wf-system-design',
    slug: 'system-design',
    order: 3,
    title: 'System Design',
    shortLabel: 'System Design',
    summary:
      'Partition the product across electrical, mechanical, and firmware — architecture first, board details second.',
    responsibleRoles: [
      'Embedded & Systems Engineer',
      'Hardware & PCB Engineer',
      'Manufacturing & Quality Engineer',
    ],
    roleSlugs: ['product-applications', 'hardware-pcb-engineering', 'manufacturing-quality'],
    commonProblems: [
      'Enclosure and PCB collide after layout because MCAD never saw the stack',
      'Modular architecture decisions are tribal knowledge, not shared models',
      'Partners and suppliers cannot review system intent without a seat in CAD',
    ],
    developCapability: {
      title: 'Multidisciplinary co-creation & ECAD–MCAD sync',
      description:
        'Connect electrical architecture with mechanical collaboration and partner visibility so system-level trade-offs happen before copper is committed.',
    },
    tutorialIds: ['cat-184', 'cat-066', 'cat-140', 'cat-199'],
    learningPathId: 'path-007',
    utmContent: 'workflow_system_design',
    iconName: 'Network',
  },
  {
    id: 'wf-pcb-design',
    slug: 'pcb-design',
    order: 4,
    title: 'PCB Design',
    shortLabel: 'PCB Design',
    summary:
      'Schematic capture, board planning, placement, routing, and design rules — executed in a connected workspace the rest of the team can still see.',
    responsibleRoles: ['Hardware & PCB Engineer', 'Component Library Architect'],
    roleSlugs: ['hardware-pcb-engineering', 'component-library-architect'],
    commonProblems: [
      'Reviewers only see frozen screenshots of the schematic',
      'Placement and stack decisions are invisible to sourcing and mechanical',
      'Design rules and intent comments never reach the people who sign off',
    ],
    developCapability: {
      title: 'Connected schematic & PCB design with live context',
      description:
        'Capture schematics, plan the board, place and route with team visibility — comments, history, and browser review stay attached to the live design.',
    },
    tutorialIds: ['cat-048', 'cat-064', 'cat-231', 'cat-214', 'cat-084'],
    learningPathId: 'path-003',
    utmContent: 'workflow_pcb_design',
    iconName: 'Cpu',
  },
  {
    id: 'wf-sourcing',
    slug: 'sourcing',
    order: 5,
    title: 'Sourcing',
    shortLabel: 'Sourcing',
    summary:
      'Validate BOM risk, lead times, and alternates while design is still changeable — not after fab quotes arrive.',
    responsibleRoles: [
      'Procurement & Component Specialist',
      'Hardware & PCB Engineer',
      'Engineering Manager & CTO',
    ],
    roleSlugs: ['procurement-components', 'hardware-pcb-engineering', 'engineering-leadership'],
    commonProblems: [
      'EOL / NRND parts discovered after Gerbers are already with the fab',
      'Procurement works from a stale spreadsheet BOM',
      'Supplier feedback never loops back into the design workspace',
    ],
    developCapability: {
      title: 'Live BOM, supply-chain & supplier feedback',
      description:
        'ActiveBOM-style lifecycle and distributor insight plus fast supplier feedback inside the same project hub electrical already uses.',
    },
    tutorialIds: ['cat-125', 'cat-163', 'cat-165', 'cat-143'],
    learningPathId: 'path-008',
    utmContent: 'workflow_sourcing',
    iconName: 'ShoppingCart',
  },
  {
    id: 'wf-review',
    slug: 'review',
    order: 6,
    title: 'Review',
    shortLabel: 'Review',
    summary:
      'Design reviews, markup, history, and sprint visibility without forcing every stakeholder into desktop CAD.',
    responsibleRoles: [
      'Engineering Manager & CTO',
      'Hardware & PCB Engineer',
      'Manufacturing & Quality Engineer',
    ],
    roleSlugs: ['engineering-leadership', 'hardware-pcb-engineering', 'manufacturing-quality'],
    commonProblems: [
      'Reviews happen in email PDFs; comments never resolve against a revision',
      'Managers lack a trustworthy view of hardware sprint health',
      'Design intent is argued in meetings instead of threaded on the design',
    ],
    developCapability: {
      title: 'Browser reviews, comments & project visibility',
      description:
        'Markup, history, and management views let electrical, leadership, and partners review the same live revision — not a stale export.',
    },
    tutorialIds: ['cat-117', 'cat-188', 'cat-041', 'cat-182', 'cat-162'],
    learningPathId: 'path-010',
    utmContent: 'workflow_review',
    iconName: 'MessageSquare',
  },
  {
    id: 'wf-manufacturing',
    slug: 'manufacturing',
    order: 7,
    title: 'Manufacturing',
    shortLabel: 'Manufacturing',
    summary:
      'Release packages, partner handoff, and fabrication readiness with a clear project state — not “final_v7_really.zip.”',
    responsibleRoles: [
      'Manufacturing & Quality Engineer',
      'Hardware & PCB Engineer',
      'Procurement & Component Specialist',
    ],
    roleSlugs: ['manufacturing-quality', 'hardware-pcb-engineering', 'procurement-components'],
    commonProblems: [
      'Release state is ambiguous across email, Drive, and the fab portal',
      'External manufacturers cannot see context without CAD seats',
      'ECAD / MCAD / BOM packages drift out of sync at handoff',
    ],
    developCapability: {
      title: 'Project release & partner manufacturing handoff',
      description:
        'Controlled release workflows and safe external stakeholder access so fabs and CMs get the right package with the right revision history.',
    },
    tutorialIds: ['cat-058', 'cat-187', 'cat-199', 'cat-120'],
    learningPathId: 'path-004',
    utmContent: 'workflow_manufacturing',
    iconName: 'Factory',
  },
  {
    id: 'wf-verification',
    slug: 'verification',
    order: 8,
    title: 'Verification',
    shortLabel: 'Verification',
    summary:
      'Close the loop from requirement to test evidence, compliance threads, and post-silicon iteration without resetting collaboration.',
    responsibleRoles: [
      'Regulatory & Compliance Engineer',
      'Manufacturing & Quality Engineer',
      'Hardware & PCB Engineer',
    ],
    roleSlugs: ['compliance-sustainability', 'manufacturing-quality', 'hardware-pcb-engineering'],
    commonProblems: [
      'No clean trail from PRD line-item to board test point',
      'Post-silicon fixes spawn uncontrolled “rev spaghetti”',
      'Compliance and sustainability evidence is assembled after the fact',
    ],
    developCapability: {
      title: 'Verification trails, compliance & post-silicon iteration',
      description:
        'Keep requirement-to-test linkage, audit-ready change history, and structured post-silicon iteration inside the same Develop workspace.',
    },
    tutorialIds: ['cat-183', 'cat-190', 'cat-157', 'cat-127', 'cat-096'],
    learningPathId: 'path-009',
    utmContent: 'workflow_verification',
    iconName: 'ShieldCheck',
  },
];

export function workflowStageBySlug(slug: string | undefined | null): WorkflowStage | undefined {
  if (!slug) return undefined;
  return WORKFLOW_STAGES.find((s) => s.slug === slug);
}
