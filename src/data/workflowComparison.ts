/** Process comparison — disconnected practices vs Altium Develop workflows.
 * Compares collaboration patterns, not competing brands.
 */

export interface WorkflowComparisonRow {
  theme: string;
  disconnected: string;
  develop: string;
}

export const WORKFLOW_COMPARISON_ROWS: WorkflowComparisonRow[] = [
  {
    theme: 'Requirements',
    disconnected: 'Requirements live in spreadsheets and slide decks, often detached from the design.',
    develop: 'Requirements stay linked to design objects so intent travels with the hardware.',
  },
  {
    theme: 'Design reviews',
    disconnected: 'Reviews happen over email threads and static PDF exports.',
    develop: 'Comments stay in design context with shared visibility for every stakeholder.',
  },
  {
    theme: 'Procurement',
    disconnected: 'Procurement is consulted late, after the BOM is already frozen.',
    develop: 'BOM risk and supply signals are reviewed during design, not after release.',
  },
  {
    theme: 'Progress reporting',
    disconnected: 'Status is assembled manually from chat updates and local file names.',
    develop: 'Shared project visibility gives managers and peers a live readiness picture.',
  },
  {
    theme: 'Manufacturing feedback',
    disconnected: 'Manufacturing feedback arrives after release, when changes are expensive.',
    develop: 'Early DFM collaboration brings fab and assembly insight into the design loop.',
  },
];
