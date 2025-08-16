# Component Libraries Development Experiment

> Comparing Angular Material vs. spade for component customization efficiency

## Quick Start

```bash
npm install
ng serve
```

Open http://localhost:4200 and follow the instructions.

## Experiment Overview

This experiment compares two frontend component library approaches:

- **Angular Material**: Traditional component library with theming
- **spade**: Copy-paste component library with full code ownership

### Tasks (1 hr total)

1. **Button Component** (15 min) - Add outline variant, update colors, icon support
2. **Input Field** (20 min) - Character counter, visual feedback, validation
3. **Dropdown** (30 min) - Search functionality, multi-select chips

## Participant Instructions

### 1. Setup (5 minutes)

- Ensure `ng serve` is running
- Open your preferred IDE
- Download feedback templates from `/assets/templates/`

### 2. Experiment Flow

1. Read instructions at `/instructions`
2. Complete Task 1 at `/task-button`
3. Complete Task 2 at `/task-input`
4. Complete Task 3 at `/task-dropdown`
5. Fill feedback form at `/feedback`

### 3. Important Guidelines

- **Time Tracking**: Note start/end times manually
- **Both Implementations**: Work on Material AND spade for each task
- **Focus on Functionality**: Don't worry about pixel-perfect design
- **Stop After Time Limit**: Incomplete solutions are okay

### 4. Data Collection

Please track:

- Time spent on each implementation
- Subjective difficulty (1-5 scale)
- Specific challenges encountered
- Overall preferences and reasoning

## Technical Setup

### Dependencies

- Angular 20+
- Angular Material
- Angular CDK
- spade Components (copied from main library)

### Project Structure

```
src/app/
├── instructions/           # Experiment instructions
├── task-button/           # Task 1: Button customization
├── task-input/            # Task 2: Input enhancement
├── task-dropdown/         # Task 3: Dropdown features
├── feedback/              # Qualitative feedback form
└── shared/
    └── task-layout/       # Side-by-side layout component
```

### Components Location

- **Angular Material**: Each task has a `material-*` component
- **spade**: Components copied to `src/lib/components/`

## For Researchers

### Data Analysis

Participants will provide:

- Time measurements (Excel/CSV)
- Qualitative feedback (Markdown)
- Code snapshots (modified project)

### Success Metrics

- **Quantitative**: Implementation time, lines of code, completion rate
- **Qualitative**: Subjective difficulty, developer preferences, pain points

### Experiment Validity

- Identical requirements for both approaches
- Standardized environment (same Angular version, setup)
- Controlled baseline implementations
- Clear time constraints

## Support

If you encounter technical issues:

1. Check that `ng serve` is running without errors
2. Verify all dependencies are installed (`npm install`)
3. Ensure you're using Node.js 18+ and Angular CLI 20+

For experiment questions, refer to the instructions page or contact the research team.

---

**Research Context**: This experiment is part of a bachelor thesis investigating optimal component library architectures for project business in consulting environments.
