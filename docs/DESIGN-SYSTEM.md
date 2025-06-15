# Design System Documentation

## Overview

The EVE Online App design system is inspired by the futuristic, space-themed aesthetic of EVE Online, featuring a dark theme with strategic use of flame accents and smooth interactions.

## Color Palette

### Primary Colors
```css
--white: #ffffffff;          /* Pure white for high contrast text */
--platinum: #e1e0dcff;       /* Primary text color */
--silver: #b0ada7ff;         /* Secondary text */
--gray: #7e7a72ff;           /* Muted text and icons */
--jet: #302e2bff;            /* Dark backgrounds */
--eerie-black: #201f1dff;    /* Darker backgrounds */
--night: #0b0a0aff;          /* Darkest backgrounds */
```

### Accent Colors
```css
--flame: #eb5e28ff;          /* Primary accent - active states */
--burnt-sienna: #ed6d3cff;   /* Secondary accent - hover states */
--turquoise: #40e0d0;        /* Tertiary accent - special highlights */
```

### Translucent Colors
```css
--translucent-white-02: hsla(0, 0%, 100%, 0.02);  /* Subtle overlays */
--translucent-white-03: #ffffff08;                 /* Light backgrounds */
--translucent-white-1: #ffffff1a;                  /* Borders */
--translucent-white-2: #ffffff2a;                  /* Hover states */
--translucent-white-3: #ffffff3a;                  /* Active states */
```

## Typography

### Font Stack
```css
font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
```

### Font Sizes
- **0.6rem**: Small labels and counters
- **0.7rem**: Body text and controls
- **0.875rem**: Secondary headings
- **1rem**: Primary headings
- **1.25rem**: Section headings
- **1.5rem**: Page titles
- **2rem**: Main titles

### Font Weights
- **400**: Normal text
- **500**: Medium emphasis
- **600**: Strong emphasis
- **700**: Bold headings

## Spacing System

### Base Units
```css
--sidebar-width-compressed: 3.5rem;    /* Compact sidebar width */
--top-drawer-height: 320px;            /* Search/filter panel height */
```

### Spacing Scale
- **0.125rem**: 2px - Micro spacing
- **0.25rem**: 4px - Small spacing
- **0.5rem**: 8px - Medium spacing
- **0.75rem**: 12px - Standard spacing
- **1rem**: 16px - Large spacing
- **1.5rem**: 24px - Extra large spacing
- **2rem**: 32px - Section spacing

## Component Styles

### Buttons

#### Primary Button
```css
.control-button {
  background-color: var(--jet);
  color: var(--platinum);
  border: 1px solid var(--translucent-white-3);
  border-radius: 0.35rem;
  transition: all 0.125s cubic-bezier(0.25, 0.1, 0.25, 1.0);
}

.control-button:hover {
  color: var(--white);
  background-color: var(--jet);
}

.control-button.selected {
  color: var(--flame);
  background-color: var(--translucent-white-02);
}
```

#### Secondary Button
```css
.me-button-group .option {
  background-color: transparent;
  color: var(--gray);
  border: 1px solid var(--translucent-white-3);
  transition: all 0.15s ease;
}

.me-button-group .option:hover {
  color: var(--platinum);
}

.me-button-group .option.selected {
  color: var(--flame);
  text-shadow: 0 0 0.5px currentColor;
}
```

### Input Fields

#### Text Input
```css
.combobox-input {
  background-color: var(--eerie-black);
  color: var(--gray);
  border: 1px solid var(--translucent-white-3);
  border-radius: 0.5rem;
  padding: 0.25rem 0.75rem;
  transition: all 0.15s ease;
}

.combobox-input:hover {
  color: var(--platinum);
  border-color: turquoise;
}

.combobox-input:focus {
  color: var(--flame);
  border-color: var(--flame);
  text-shadow: 0 0 0.5px currentColor;
}
```

#### Select Dropdown
```css
.filter-select {
  background-color: var(--eerie-black);
  color: var(--gray);
  border: 1px solid var(--translucent-white-3);
  border-radius: 0.5rem;
  font-size: 0.7rem;
}

.filter-select:not(:invalid) {
  color: var(--flame);
  text-shadow: 0 0 0.5px currentColor;
}
```

### Navigation

#### Sidebar Navigation
```css
.nav-link {
  color: var(--platinum);
  border-bottom: 1px solid var(--jet);
  transition: all 0.125s cubic-bezier(0.25, 0.1, 0.25, 1.0);
}

.nav-link:hover {
  color: var(--white);
  background-color: var(--jet);
  border-left: 2px solid var(--flame);
}

.nav-link.selected {
  color: var(--flame);
  background-color: var(--translucent-white-02);
  border-left: 2px solid var(--flame);
}
```

### Cards and Panels

#### Item Cards
```css
.inv-type-slip {
  background-color: var(--jet);
  border: 1px solid var(--translucent-white-1);
  border-radius: 0.5rem;
  transition: all 0.15s ease;
}

.inv-type-slip:hover {
  color: var(--platinum);
}

.inv-type-slip:hover::after {
  border: 1px solid var(--turquoise);
}

.inv-type-slip--selected {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: var(--flame);
  box-shadow: 0 2px 8px rgba(235, 94, 40, 0.3);
}
```

#### Filter Panels
```css
.filter-selection-container {
  background-color: var(--jet);
  border-left: 1px solid var(--translucent-white-3);
  box-shadow: 0 0 3px 1px var(--night);
}

.market-group {
  background-color: var(--translucent-white-03);
  border-left: 1px solid var(--translucent-white-1);
}
```

## Animation System

### Easing Functions
```css
/* Standard easing for most interactions */
cubic-bezier(0.25, 0.1, 0.25, 1.0)

/* Smooth easing for layout changes */
cubic-bezier(0.25, 1.1, 0.5, 1)

/* Bouncy easing for special effects */
cubic-bezier(0.68, 0, 0.265, 1.2)

/* Fast easing for micro-interactions */
cubic-bezier(0.25, 0.46, 0.45, 0.94)
```

### Transition Durations
- **0.05s**: Instant feedback
- **0.15s**: Standard transitions
- **0.2s**: Medium transitions
- **0.3s**: Layout changes
- **0.5s**: Major state changes

### Animation Patterns

#### Hover Effects
```css
.element {
  transition: all 0.15s ease;
}

.element:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
```

#### State Changes
```css
.element {
  transition: transform 0.3s cubic-bezier(0.25, 1.1, 0.5, 1);
}

.element.active {
  transform: scale(1.05);
}
```

## Iconography

### Icon System
- **Library**: Font Awesome 6
- **Style**: Solid icons for primary actions
- **Size**: Consistent sizing across components
- **Color**: Inherits from parent text color

### Icon Usage
```html
<!-- Navigation icons -->
<svg class="svg-inline--fa fa-house" />
<svg class="svg-inline--fa fa-compass-drafting" />
<svg class="svg-inline--fa fa-industry" />

<!-- Control icons -->
<svg class="svg-inline--fa fa-filter" />
<svg class="svg-inline--fa fa-magnifying-glass" />
<svg class="svg-inline--fa fa-gear" />
```

## Layout System

### Grid System
```css
.items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
  gap: 0.5rem;
}
```

### Flexbox Patterns
```css
.flex-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.flex-space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### Responsive Breakpoints
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

## Accessibility

### Focus Management
```css
.focusable:focus-visible {
  outline: 2px solid var(--flame);
  outline-offset: 2px;
}
```

### Screen Reader Support
```html
<button aria-label="Expand all groups">
  <svg aria-hidden="true" />
</button>
```

### Color Contrast
- **Text on dark backgrounds**: Minimum 4.5:1 ratio
- **Interactive elements**: Clear visual distinction
- **Focus indicators**: High contrast outline

## Best Practices

### CSS Organization
1. **Variables first**: Define custom properties
2. **Base styles**: Reset and typography
3. **Component styles**: Scoped to components
4. **Utilities**: Helper classes last

### Performance
1. **Hardware acceleration**: Use transform properties
2. **Minimize reflows**: Avoid layout-triggering properties
3. **Batch animations**: Group related animations
4. **Reduce complexity**: Simplify selectors

### Maintainability
1. **Consistent naming**: Use semantic class names
2. **Reusable patterns**: Create component mixins
3. **Documentation**: Comment complex calculations
4. **Testing**: Verify cross-browser compatibility

This design system ensures consistency, accessibility, and maintainability across the entire EVE Online App while providing a rich, immersive user experience that reflects the game's aesthetic.
