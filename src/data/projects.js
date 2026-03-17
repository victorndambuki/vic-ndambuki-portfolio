// ═══════════════════════════════════════════════════════════════
// PROJECTS
// ───────────────────────────────────────────────────────────────
// To add a project, paste this template and fill it in:
//
// {
//   title: 'Your Project Name',
//   tags: ['laser'],           ← 'laser', '3d', or 'design'
//   description: 'Write 2-3 sentences.',
//   details: [
//     'Material: write here',
//     'Key feature: write here',
//   ],
//   model: 'filename.glb',     ← file in public/models/ (or null)
//   image: 'filename.jpg',     ← file in public/images/ (or null)
// },
// ═══════════════════════════════════════════════════════════════

export const projects = [
  {
    title: 'Metallic Phone Stand',
    tags: ['Laser Cutting'],
    description:
      'Custom-designed phone stand precision laser-cut from mild steel. Functional design with aesthetic appeal, featuring a slot for passing through a charging cable.',
    details: [
      'Material: 1.5mm mild steel sheet',
      'Finish: Matte black powder coat',
      'No assembly required',
    ],
    model: 'phone_stand.glb',
    image: null,
  },

  // ── Add new projects below ───────────────────────────────────
  {
    title: 'Vintage Model Car',
    tags: ['Laser Cutting'],
    description:
      'This project explores vintage vehicle body design through a small-scale model constructed from thin sheet materials. The panels were designed and assembled to replicate classic early-automobile proportions while demonstrating how simple folded surfaces can create a structured vehicle body.',
    details: [
      'Material: 1.0 mm mild steel sheet',
      'Panels assembly required',
    ],
    model: 'vintage_car_optimized.glb',
    image: 'vintage_car.jpg',
  },

{
    title: 'Ceiling Light Lampshade',
    tags: ['3D Printing'],
    description:
      'Custom lampshade design for a ceiling light 3D printed from PETG or ASA.',
    details: [
      'Material: PETG / ASA',
          ],
    model: 'ceiling_light_lampshade.glb',
  },

  {
    title: 'Piezo-electric Gas Lighter',
    tags: ['Design'],
    description:
      'Design of a piezo-electric gas lighter from scratch.',
    details: [
      'Material: stainless steel, plastic, rubber',
          ],
    model: 'gas_lighter.glb',
    image: 'gas_lighter1.jpg',
  },
  
]

// ═══════════════════════════════════════════════════════════════
// SKILLS
// ═══════════════════════════════════════════════════════════════

export const skills = [
  {
    title: 'CAD Design',
    icon: '✏',
    description: 'Proficiency in SolidWorks 3D modelling, technical drawing, and design for manufacture.',
    tools: ['SolidWorks', 'AutoCAD', 'ZWCAD', 'Keyshot', 'Technical Drawing'],
  },
  {
    title: 'Laser Cutting',
    icon: '◈',
    description: 'Precision cutting and engraving of metals and wood with design optimisation for material yield.',
    tools: ['Mild Steel', 'Aluminium', 'Stainless Steel', 'Plywood', 'Acrylic'],
  },
  {
    title: '3D Printing',
    icon: '⬡',
    description: 'Complex geometry fabrication, rapid prototyping, and functional part production.',
    tools: ['FDM Printing', 'PLA / PETG / ABS', 'OrcaSlicer', 'Creality Print'],
  },
]

// ═══════════════════════════════════════════════════════════════
// SOFTWARE STRIP
// ═══════════════════════════════════════════════════════════════

export const softwareList = [
  'SolidWorks', 'AutoCAD', 'ZWCAD', 'Cypcut', 'LightBurn', 'OrcaSlicer', 'Creality Print',
]
