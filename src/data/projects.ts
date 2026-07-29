import { HardwareProject } from '../types';

export const HARDWARE_PROJECTS: HardwareProject[] = [
  {
    id: 'proj-arduino',
    slug: 'arduino-uno-rev3-hardware',
    title: 'Arduino UNO Rev3 Hardware Clone',
    subtitle: 'Complete ATmega328P microcontroller design with USB auto-reset & shield headers',
    description: 'Build an open-source Arduino UNO hardware design from schematic capture to Gerber manufacturing release. Includes ATmega328P circuit, 16MHz crystal oscillator, CH340 USB transceiver, power auto-selector, and female shield headers.',
    difficulty: 'Intermediate',
    estimatedTime: '8 Hours',
    category: 'Microcontroller Board',
    schematicStatus: '100% Completed',
    pcbStatus: '100% Completed',
    bomStatus: 'ActiveBOM Verified',
    tutorialIds: ['tut-002', 'tut-005', 'tut-006', 'tut-007', 'tut-015'],
    downloadUrl: 'https://eduengteam.com/projects/arduino-uno-altium.zip',
    githubUrl: 'https://github.com/eduengteam/altium-arduino-uno-project'
  },
  {
    id: 'proj-esp32',
    slug: 'esp32-iot-development-board',
    title: 'ESP32 IoT Wireless Dev Board',
    subtitle: '2.4GHz Wi-Fi/BLE module board with LiPo battery charger & USB-C interface',
    description: 'Design a compact high-performance ESP32 development board. Features 50-ohm microstrip trace routing, 2.4GHz PCB antenna keepout zones, USB-C Power Delivery controller, and TP4056 lithium battery charger circuit.',
    difficulty: 'Advanced',
    estimatedTime: '12 Hours',
    category: 'IoT & Wireless',
    schematicStatus: '100% Completed',
    pcbStatus: '100% Completed',
    bomStatus: 'ActiveBOM Verified',
    tutorialIds: ['tut-001', 'tut-003', 'tut-004', 'tut-012', 'tut-014'],
    downloadUrl: 'https://eduengteam.com/projects/esp32-devboard-altium.zip'
  },
  {
    id: 'proj-buck',
    slug: 'dc-dc-buck-converter-power-module',
    title: 'High-Efficiency DC-DC Buck Regulator',
    subtitle: '12V to 5V 3A DC-DC switching regulator module with thermal heatsink copper pour',
    description: 'Learn switching power supply layout techniques. Minimal current loop routing, TPS5430 regulator IC, feedback noise isolation, and thermal via matrix for heat dissipation under heavy 3A loads.',
    difficulty: 'Advanced',
    estimatedTime: '6 Hours',
    category: 'Power Supply',
    schematicStatus: '100% Completed',
    pcbStatus: '100% Completed',
    bomStatus: 'ActiveBOM Verified',
    tutorialIds: ['tut-008'],
    downloadUrl: 'https://eduengteam.com/projects/buck-converter-altium.zip'
  },
  {
    id: 'proj-relay',
    slug: 'industrial-4channel-relay-board',
    title: 'Industrial 4-Channel Optoisolated Relay Board',
    subtitle: '250V AC 10A isolated relay drive board with optical isolation & flyback diodes',
    description: 'Design safe AC power relay boards. High-voltage isolation clearances, optical isolators (PC817), flyback diodes, status LEDs, and heavy copper high-current trace dimensions.',
    difficulty: 'Intermediate',
    estimatedTime: '5 Hours',
    category: 'Industrial Automation',
    schematicStatus: '100% Completed',
    pcbStatus: '100% Completed',
    bomStatus: 'ActiveBOM Verified',
    tutorialIds: ['tut-001', 'tut-007'],
    downloadUrl: 'https://eduengteam.com/projects/relay-board-altium.zip'
  }
];
