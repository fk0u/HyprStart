# Mistake Registry - HyprStart

## 1. Nested Buttons in React/HTML
- **Mistake**: Wrapping nested `<button>` inside `<button>` (e.g. edit triggers inside shortcut grid links).
- **Consequence**: Hydration warnings and potential rendering inconsistencies.
- **Resolution**: Convert parent wrapper to `div` or change children elements to simple icons with specific pointer events and stopPropagation handlers.

## 2. Chrome Extension Static Build API Route Blocks
- **Mistake**: Using server-side dynamic route handlers (`/api/suggest`) inside Next.js with static exports (`output: 'export'`).
- **Consequence**: Next.js build compilation fail.
- **Resolution**: Use client-side JSONP (injecting dynamically loaded `<script>` components querying JSONP API endpoints) to bypass CORS and remove backend server dependencies entirely.

## 3. Synchronous setState inside React Effects
- **Mistake**: Setting state values synchronously inside `useEffect` bodies for loading/initial values.
- **Consequence**: Linter warning `react-hooks/set-state-in-effect` and double render performance lag.
- **Resolution**: Initialize states directly using functional state initializers (`useState(() => value)`).
