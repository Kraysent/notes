export const markdownTypography = {
  base: "text-base leading-relaxed",

  h1: "text-4xl font-bold leading-tight mt-0 mb-4",
  h2: "text-3xl font-semibold leading-tight mt-8 mb-3",
  h3: "text-2xl font-semibold leading-snug mt-6 mb-2",
  h4: "text-xl font-semibold leading-normal mt-4 mb-2",
  h5: "text-lg font-semibold leading-normal mt-4 mb-2",
  h6: "text-base font-semibold leading-normal mt-3 mb-1",

  paragraph: "text-base leading-relaxed mb-4",

  list: "text-base leading-relaxed my-4 pl-6",
  listItem: "text-base leading-relaxed my-1",

  blockquote:
    "text-base leading-relaxed my-4 pl-4 border-l-4 border-l-white/20",

  table: "text-base leading-relaxed my-4",
  tableCell: "text-base leading-relaxed py-2 px-4",
  tableHeader: "text-base leading-relaxed py-2 px-4 font-semibold",

  codeInline: "text-sm font-mono",
  codeBlock: "text-sm font-mono leading-relaxed",
} as const;
