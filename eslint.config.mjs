import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'react/no-array-index-key': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    // Archivos generados por Payload
    ignores: ['.next/', '.next-demo/', 'node_modules/', 'src/payload-types.ts', 'src/app/(payload)/', 'src/migrations/'],
  },
]

export default eslintConfig
