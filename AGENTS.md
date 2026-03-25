<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

split theme for atomic and molecule, make the file name for atomic is .atmoic and the molecule is .molecule.

🤖 Project Agent Rules
📁 Directory Responsibilities
When creating or modifying files, strictly adhere to this architecture:

assets/: Static files only (images, icons, fonts).

components/: Reusable UI elements. Keep them "dumb" or presentational where possible.

constants/: Hard-coded strings, configuration values, and API endpoints.

(pages)/: Main screen entries or route-level components. this is all of the screen and page, do not create it on other folder for it.

styles/: Global themes, CSS modules, or Styled Components definitions.

types/: TypeScript interfaces and types. Avoid any at all costs.

utils/: Pure helper functions and logic shared across the app.

🛠 Technical Standards
TypeScript First: Every new file in components, pages, or utils must have corresponding type definitions in the types/ folder or co-located if specific to one file.

Modular Logic: Do not write business logic inside pages/. Extract complex logic into utils/ or custom hooks.

Clean Imports: Use absolute paths or aliases (e.g., @/components/...) if the project configuration supports it.

Consistency: Before creating a new utility, check utils/ to see if a similar helper already exists to prevent duplication.

📝 Interaction Guidelines
Context Awareness: Always check constants/ before hard-coding values like colors or API routes.

Refactoring: If a component grows beyond 200 lines, suggest breaking it down into smaller sub-components within the components/ directory.

<!-- END:nextjs-agent-rules -->
