export const ViewMode = {
  Raw: 'raw',
  Markdown: 'markdown',
} as const

export type ViewMode = typeof ViewMode[keyof typeof ViewMode]

