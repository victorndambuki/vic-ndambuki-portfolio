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
    tags: ['laser'],
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
