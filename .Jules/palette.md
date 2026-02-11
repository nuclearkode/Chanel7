## 2024-05-23 - Accessible Labels for Icon-Only Buttons and Dynamic Inputs

**Learning:** In dynamic lists (like ingredient lists or comparison games), inputs and icon-only buttons often lack context. While visual proximity provides context for sighted users, screen readers need explicit labels. `aria-label` is crucial for inputs where visual labels are repetitive or omitted, and `<span className="sr-only">` is a robust pattern for icon-only buttons in this codebase.

**Action:** When creating or auditing list-based forms:
1. Ensure every icon-only button has a screen-reader-only text label (using `sr-only`).
2. Ensure every input in a grid/list row has a unique `aria-label` if it lacks a dedicated `<label>`.
