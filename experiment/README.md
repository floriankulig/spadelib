# ♠️ Component Libraries Development Experiment

> Comparative Study: Angular Material vs. Spade for component customization efficiency

## Quick Start

```bash
npm install
ng serve
```

Open http://localhost:4200 and follow the instructions.

## Experiment Overview

This experiment compares two frontend component library approaches for typical customization tasks in consulting environments:

- **Angular Material**: Traditional component library with theming system
- **Spade**: Copy-paste component library with full code ownership

### Experiment Structure (~45-60 minutes total)

The experiment consists of **3 tasks** that you can complete in any order:

1. **Button Component** (~15 min) - New variant, color changes, icon support
2. **Input Field** (~20 min) - Character counter, visual feedback, validation
3. **Dropdown** (~25 min) - Search functionality, multi-select with chips

## Participant Instructions

### 1. Setup (2-3 minutes)

- Ensure `ng serve` is running
- Open your preferred IDE (VS Code recommended)
- Prepare a document for time tracking

### 2. Experiment Flow

1. **Read instructions** → Navigate to `/instructions`
2. **Choose a task** → Start with any task you prefer
3. **Both implementations** → Work on both Material and Spade approaches
4. **Document time** → Note start/end times for each implementation
5. **Provide feedback** → Complete `/feedback` at the end

### 3. Important Guidelines

- **Time tracking**: Document start/end times manually per implementation
- **Both approaches**: Work on each task using both Material and Spade
- **Functionality over perfection**: Pixel-perfect design is not required
- **Respect time limits**: Incomplete solutions are acceptable
- **Use tab system**: Switch between "🎨 Angular Material" and "⚡ Spade" tabs

### 4. What to Document

**Quantitative Data:**

- Implementation time per approach
- Number of files changed
- Difficulty rating (1-5 scale)

**Qualitative Insights:**

- Specific challenges encountered
- Developer experience differences
- Preferences and reasoning

## Task Details

### Task 1: Button Component Adaptation

**Goal**: Adapt to corporate design for automotive client

- Change primary color (#1E3A8A)
- Implement new "outline" variant
- Icon-only button with accessibility

### Task 2: Input Field Enhancement

**Goal**: Enhanced input validation for forms

- Character counter with limit display
- Visual feedback for validation status
- Error/success states

### Task 3: Dropdown Enhancement

**Goal**: Extended selection capabilities

- Live search functionality
- Multi-select with chip display
- Keyboard navigation

## Technical Architecture

### Project Structure

```
src/app/
├── setup/
│   ├── instructions/          # Experiment instructions
│   ├── task-layout/          # Side-by-side layout component
│   └── task-feedback/        # Feedback form
├── task-button/              # Task 1: Button customizations
├── task-input/               # Task 2: Input enhancements
├── task-dropdown/            # Task 3: Dropdown features
├── tokens/                   # Design token system
│   ├── design-tokens.scss   # Global tokens
│   └── categories/          # Categorized tokens
└── styles/                  # Base styles & utilities
```

### Spade Components

Spade components are already available in the codebase:

- **Location**: `src/app/components/spade-*/`
- **Fully customizable**: Direct access to HTML, SCSS, TypeScript
- **Design token system**: CSS custom properties for consistent theming
- **Accessibility-first**: WCAG 2.1 AA compliant implementation

### Angular Material

Material components are used via standard Angular Material imports:

- **Theming**: Customizations via `styles.scss` and task-specific SCSS files
- **Overrides**: CSS overrides for design adaptations
- **Components**: Standard Material components (MatButton, MatInput, etc.)

## Implementation Guidelines

### For Spade Components:

- **Direct editing**: Modify files in `./spade-*/` folders
- **Design tokens**: Use CSS custom properties from `design-tokens.scss`
- **Component structure**: HTML, SCSS, and TypeScript are fully accessible

### For Angular Material:

- **Theme customizations**: Use `styles.scss` for global changes
- **CSS overrides**: Task-specific SCSS files for local adaptations
- **Material theming**: Work with Angular Material's theming API

## Technical Requirements

- **Angular**: 20+
- **Node.js**: 18+
- **Angular CLI**: 20+
- **Browser**: Modern browsers (Chrome, Firefox, Safari, Edge)

## Support

For technical issues:

1. Check that `ng serve` runs without errors
2. Verify all dependencies are installed (`npm install`)
3. Check browser console for errors
4. Restart dev server if necessary

For experiment questions, contact the research team or use the `/instructions` page.

## For Researchers

### Data Collection

Participants will provide:

- **Time metrics**: Implementation time per approach and task
- **Qualitative feedback**: Markdown-based responses
- **Code snapshots**: Modified project as zip export

### Success Metrics

**Quantitative:**

- Implementation time (minutes)
- Lines of code changed
- Completion rate (%)
- Error rate

**Qualitative:**

- Subjective difficulty (1-5)
- Developer experience rating
- Preferences with reasoning
- Identified pain points

### Experiment Validity

- **Identical requirements** for both approaches
- **Standardized environment** (same Angular version, setup)
- **Controlled baseline** with pre-built components
- **Clear time boundaries** per task

---

**Research Context**: This experiment is part of a bachelor thesis investigating optimal component library architectures for project business in consulting environments at Capgemini.
