export const typography = {
  // Large headings
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
  },

  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },

  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
  },

  // Body
  bodyLarge: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 24,
  },

  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },

  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },

  // Labels / metadata
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },

  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },

  // Buttons
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
} as const;