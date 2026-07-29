import { CommandShortcut } from '../types';

export const ALTIUM_SHORTCUTS: CommandShortcut[] = [
  // Schematic Context
  { key: 'P -> W', action: 'Place Wire', context: 'Schematic' },
  { key: 'P -> P', action: 'Place Pin', context: 'Schematic' },
  { key: 'P -> N', action: 'Place Net Label', context: 'Schematic' },
  { key: 'P -> R', action: 'Place Resistor / Component', context: 'Schematic' },
  { key: 'P -> J', action: 'Place Junction', context: 'Schematic' },
  { key: 'P -> O', action: 'Place Power Port', context: 'Schematic' },
  { key: 'P -> H', action: 'Place Sheet Symbol (Hierarchical)', context: 'Schematic' },
  { key: 'T -> A', action: 'Annotate Schematics Quietly', context: 'Schematic' },
  { key: 'C -> C', action: 'Compile Project & Check ERC Errors', context: 'Schematic' },
  { key: 'D -> U', action: 'Update PCB Document (Push ECO)', context: 'Schematic' },
  { key: 'Tab', action: 'Edit Object Properties Before Placing', context: 'Schematic' },
  { key: 'Spacebar', action: 'Rotate Object 90 Degrees Counter-Clockwise', context: 'Schematic' },
  { key: 'X', action: 'Flip Object Horizontally', context: 'Schematic' },
  { key: 'Y', action: 'Flip Object Vertically', context: 'Schematic' },
  { key: 'Shift + Drag', action: 'Duplicate Component & Wire Wire Net', context: 'Schematic' },

  // PCB Context
  { key: 'Ctrl + W', action: 'Interactive Trace Routing Mode', context: 'PCB' },
  { key: 'P -> G', action: 'Place Polygon Pour', context: 'PCB' },
  { key: 'P -> V', action: 'Place Via', context: 'PCB' },
  { key: 'P -> T', action: 'Place Track Manually', context: 'PCB' },
  { key: 'T -> D', action: 'Run Design Rule Check (DRC)', context: 'PCB' },
  { key: 'T -> V', action: 'Add Ground Stitching Vias Array', context: 'PCB' },
  { key: 'T -> M', action: 'Measure Distance Between Two Points', context: 'PCB' },
  { key: 'D -> S -> D', action: 'Define Board Shape from Selected Lines', context: 'PCB' },
  { key: 'D -> R', action: 'Open Design Rules Configuration Panel', context: 'PCB' },
  { key: '2', action: 'Switch to 2D PCB Layout Mode', context: 'PCB' },
  { key: '3', action: 'Switch to 3D Real-Time Render Mode', context: 'PCB' },
  { key: 'L', action: 'View Board Layers & Colors Panel', context: 'PCB' },
  { key: 'Shift + S', action: 'Cycle Single Layer Display Mode', context: 'PCB' },
  { key: 'Shift + C', action: 'Clear Current Selection & Net Highlighting', context: 'PCB' },
  { key: 'Shift + R', action: 'Cycle Routing Conflict Modes (Push / Hug / Walkaround)', context: 'PCB' },
  { key: 'G', action: 'Cycle Snap Grid Presets (1mil, 5mil, 10mil, 0.1mm)', context: 'PCB' },
  { key: 'Q', action: 'Toggle Units between Imperial (mil) & Metric (mm)', context: 'PCB' },
  { key: 'N', action: 'Hide or Show Net Connection Lines (Ratsnest)', context: 'PCB' },
  { key: 'Shift + Spacebar', action: 'Cycle Routing Corner Angles (45° / 90° / Curved)', context: 'PCB' },
  { key: 'Ctrl + Click Net', action: 'Highlight Entire Connected Net across PCB', context: 'PCB' },

  // Altium Develop & General Context
  { key: 'TP', action: 'Open Preferences Dialog', context: 'General' },
  { key: 'Ctrl + S', action: 'Save Current Document', context: 'General' },
  { key: 'Ctrl + Shift + S', action: 'Save All Open Project Files', context: 'General' },
  { key: 'F1', action: 'Open Context-Sensitive Official Documentation', context: 'General' },
  { key: 'Ctrl + Z', action: 'Undo Last CAD Action', context: 'General' },
  { key: 'Ctrl + Y', action: 'Redo Last CAD Action', context: 'General' },
  { key: 'V -> F', action: 'Fit All Objects in Window View', context: 'General' },
  { key: 'Ctrl + Shift + F', action: 'Global Search across Entire Workspace', context: 'Develop' },
  { key: 'Alt + Click', action: 'Highlight Cross-Probe Object in Schematic & PCB', context: 'Develop' }
];
