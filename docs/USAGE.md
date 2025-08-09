# Spade UI - Usage Guide

## Quick Start

### 1. Copy Components

Copy the component files you need from `src/lib/components/` to your Angular project:

```bash
# Example: Copy button component
cp -r spade-ui/src/lib/components/button/ your-project/src/app/components/ui/
```

### 2. Copy Design Tokens

Copy and customize the design tokens:

```bash
cp spade-ui/src/lib/tokens/design-tokens.scss your-project/src/styles/
cp spade-ui/src/lib/styles/base.scss your-project/src/styles/
```

### 3. Import in Your Component

```typescript
import { SpadeButtonComponent } from './components/ui/button/button.component';

@Component({
  imports: [SpadeButtonComponent]
})
```

### 4. Customize Design Tokens

Edit `design-tokens.scss` to match your brand:

```scss
:root {
  --spade-color-primary-600: #your-brand-color;
  --spade-font-family: "Your Font", sans-serif;
}
```

## Component API

### Button

```html
<spade-button variant="primary|secondary|outline|ghost|danger" size="sm|md|lg" [disabled]="boolean" [loading]="boolean" [fullWidth]="boolean" (spadeClick)="handler($event)"> Button Text </spade-button>
```

### Input

```html
<spade-input label="Field Label" placeholder="Placeholder text" type="text|email|password|number|tel|url" size="sm|md|lg" [required]="boolean" [disabled]="boolean" [maxLength]="number" [showCharacterCount]="boolean" [(ngModel)]="value" (spadeInput)="handler($event)"> </spade-input>
```

### Dropdown

```html
<spade-dropdown label="Select Label" placeholder="Choose..." [options]="optionsArray" [multiple]="boolean" [searchable]="boolean" [disabled]="boolean" [(ngModel)]="selectedValue" (spadeChange)="handler($event)"> </spade-dropdown>
```

## Accessibility

All components include:

- Proper ARIA attributes
- Keyboard navigation support
- Screen reader announcements
- Focus management
- Semantic HTML structure

## Customization

### Theming

Modify CSS custom properties in `design-tokens.scss`:

```scss
:root {
  // Your custom colors
  --spade-color-primary-600: #0066cc;

  // Your custom typography
  --spade-font-family: "Inter", sans-serif;

  // Your custom spacing
  --spade-spacing-4: 1.25rem;
}
```

### Component Styles

Since you own the code, you can directly modify component SCSS files for deeper customization.

## TypeScript Support

All components are fully typed with TypeScript interfaces for better IDE support and type safety.

````

### File: `README.md`

```markdown
# Spade UI - MVP

Angular-optimized Component Library for Project Business

## 🎯 Purpose

Spade UI solves the customization challenges in project business by providing copy-paste components that you fully own and can customize without restrictions.

## ✨ Features

- **Own Your Code**: Components are copied to your project, not installed as dependencies
- **Design Token System**: Easy theming through CSS custom properties
- **Accessibility First**: WCAG 2.1 AA compliant with proper ARIA attributes
- **TypeScript**: Full type safety and IDE support
- **Zero Dependencies**: No external UI library dependencies
- **Angular 18**: Built with latest Angular features

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/your-org/spade-ui.git
cd spade-ui
````

2. Install dependencies:

```bash
npm install
```

3. Run the demo:

```bash
ng serve
```

4. Copy components to your project as needed (see `docs/USAGE.md`)

## 📦 Components

### Currently Available (MVP)

- ✅ **Button**: Multiple variants, sizes, loading states
- ✅ **Input**: Validation, character count, error states
- ✅ **Dropdown**: Single/multi-select, search, custom templates

### Planned (Post-MVP)

- 🔲 Modal/Dialog
- 🔲 Table/DataGrid
- 🔲 Form System
- 🔲 Navigation
- 🔲 Card
- 🔲 Tabs

## 🎨 Design Tokens

Customize the look instantly by modifying CSS variables:

```scss
:root {
  --spade-color-primary-600: #your-brand-color;
  --spade-font-family: "Your Font", sans-serif;
  --spade-radius-md: 8px;
}
```

## ♿ Accessibility

All components include:

- Semantic HTML structure
- ARIA attributes
- Keyboard navigation
- Screen reader support
- Focus management

## 📄 License

MIT - Use freely in your projects

## 🤝 Contributing

This is an MVP for evaluation. Full contribution guidelines will be added after validation phase.
