export const ViewMode = {
  Raw: 'raw',
  Markdown: 'markdown',
} as const

export type ViewMode = typeof ViewMode[keyof typeof ViewMode]

export const SaveStatus = {
  Saved: 'saved',
  Saving: 'saving',
  Unsaved: 'unsaved',
} as const

export type SaveStatus = typeof SaveStatus[keyof typeof SaveStatus]

