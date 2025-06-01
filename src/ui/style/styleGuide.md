# EVE App Style Guide

This document outlines the design system for EVE App, providing a comprehensive reference for visual styling, component patterns, and interaction design.

## Color System

### Base Colors

```css
/* Core Colors */
--white: #ffffffff;
--platinum: #e1e0dcff;
--silver: #b0ada7ff;
--gray: #7e7a72ff;
--jet: #302e2bff;
--eerie-black: #201f1dff;
--mid-night: color-mix(in srgb, var(--eerie-black) 50%, var(--night) 50%);
--night: #0b0a0aff;

/* Accent Colors */
--flame: #eb5e28ff;        /* Primary accent - active/selected states */
--burnt-sienna: #ed6d3cff; /* Supporting accent */
--turquoise: #40e0d0;      /* Secondary accent - hover states */

/* Derived Colors */
--turquoise-glow: rgba(64, 224, 208, 0.15);
--turquoise-bg: rgba(64, 224, 208, 0.05);

/* Translucent Colors */
--translucent-white-02: hsla(0, 0%, 100%, 0.02);
--translucent-white-03: #ffffff08;
--translucent-white-04: #ffffff0a;
--translucent-white-05: #ffffff0b;
--translucent-white-1: #ffffff1a;
--translucent-white-2: #ffffff2a;
--translucent-white-3: #ffffff3a;
```

### Color Usage

#### Text Colors
- Primary text: `var(--platinum)`
- Secondary text: `var(--gray)`
- Active/selected text: `var(--flame)`
- Hover text: `var(--platinum)`

#### Background Colors
- App background: `var(--eerie-black)`
- Component background: `var(--eerie-black)` or `var(--jet)`
- Secondary background: `var(--jet)`
- Tertiary background: `var(--night)`

#### Border Colors
- Default borders: `var(--translucent-white-3)`
- Hover borders: `var(--turquoise)`
- Active borders: `var(--flame)`

#### Interaction Colors
- Hover states: `var(--turquoise)` for borders/outlines
- Active/selected states: `var(--flame)` for text and indicators

## Typography

### Font Family
```css
font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
```

### Font Sizes
- Base font size: 0.7rem (for components)
- H1: 2rem, 700 weight
- H2: 1.5rem, 600 weight
- H3: 1.25rem, 500 weight
- H4: 1rem, 400 weight
- H5: 0.875rem, 400 weight
- H6: 0.75rem, 400 weight

### Text Effects
```css
/* Selected/Active Text */
color: var(--flame);
text-shadow: 0 0 0.5px currentColor; /* Creates emphasis without layout shift */
```

## Layout

### Spacing Scale
- 0.25rem (4px)
- 0.5rem (8px)
- 0.75rem (12px)
- 1rem (16px)
- 1.25rem (20px)
- 1.5rem (24px)
- 2rem (32px)

### Layout Constants
```css
--top-bar-height: 3.5rem;
--sidebar-width-compressed: 3.5rem;
```

### Container Patterns
- Component containers: Gap of `0.5rem` between elements
- Secondary containers: Padding of `1rem`
- Input fields: Padding of `0.25rem 0.75rem`
- Buttons: Padding of `0.25rem 1rem`

## Interactivity

### State Management

#### Default State
```css
.element {
  background-color: var(--eerie-black);
  color: var(--gray);
  border: 1px solid var(--translucent-white-3);
  border-radius: 0.5rem;
  transition: all 0.15s ease;
  position: relative;
}
```

#### Hover State (Using Pseudo-elements)
```css
.element::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 0px solid transparent;
  box-shadow: 0 0 0 0 transparent;
  pointer-events: none;
  border-radius: 0.5rem;
  transition: border-color 0.15s ease, border-width 0.15s ease, box-shadow 0.15s ease;
}

.element:hover {
  color: var(--platinum);
}

.element:hover::after {
  border: 1px solid var(--turquoise);
}
```

#### Active/Pressed State
```css
.element:active::after {
  box-shadow: 0 0 3px 3px var(--turquoise) inset;
}
```

#### Selected State
```css
.element.selected {
  background-color: rgba(255, 255, 255, 0.05);
}

.element.selected > .text {
  color: var(--flame);
  text-shadow: 0 0 0.5px currentColor;
}
```

#### Disabled State
```css
.element.disabled {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
}
```

#### Focus State
```css
.element:focus-visible {
  outline: 2px solid var(--flame);
  outline-offset: -2px;
  position: relative;
  z-index: 1;
}
```

### Transitions and Animations

#### Standard Transitions
- Quick interactions: `transition: all 0.15s ease;`
- Standard animations: `transition: all 0.3s ease-in-out;`
- Property-specific: `transition: color 0.15s ease, border-color 0.15s ease;`

#### Animation Timing Functions
- Default: `ease` or `ease-in-out`
- Natural movement: `cubic-bezier(0.25, 0.1, 0.25, 1.0)`
- Bouncy/elastic: `cubic-bezier(0.68, 0, 0.265, 1.2)`

#### Animation Patterns
```css
/* Expanding/collapsing elements */
.expandable {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s cubic-bezier(0.68, 0, 0.265, 1.2);
}

.expandable.expanded {
  max-height: 1000px; /* Use appropriate value */
}

/* Fade in on page load */
.fade-in {
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.fade-in {
  @starting-style {
    opacity: 0;
  }
}
```

## Component Patterns

### Common Component Elements

#### Buttons
```css
button {
  background-color: var(--eerie-black);
  color: var(--gray);
  border: 1px solid var(--translucent-white-3);
  border-radius: 0.5rem;
  padding: 0.25rem 1rem;
  font-size: 0.7rem;
  transition: all 0.15s ease;
  position: relative;
  cursor: pointer;
  user-select: none;
}

button::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 0px solid transparent;
  pointer-events: none;
  border-radius: 0.5rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

button:hover {
  color: var(--platinum);
}

button:hover::after {
  border: 1px solid var(--turquoise);
}

button:active::after {
  box-shadow: 0 0 3px 3px var(--turquoise) inset;
}
```

#### Form Inputs
```css
input, select {
  width: 100%;
  padding: 0.25rem 0.75rem;
  box-sizing: border-box;
  border: 1px solid var(--translucent-white-3);
  border-radius: 0.5rem;
  height: 2rem;
  background-color: var(--eerie-black);
  color: var(--gray);
  font-size: 0.7rem;
  outline: none;
  transition: all 0.15s ease;
}

input:hover, select:hover {
  color: var(--platinum);
  border-color: var(--turquoise);
}

input:focus, select:focus {
  outline: none;
  border-color: var(--flame);
  color: var(--flame);
  text-shadow: 0 0 0.5px currentColor;
}

/* For inputs with content */
input:not(:placeholder-shown) {
  color: var(--flame);
  text-shadow: 0 0 0.5px currentColor;
}

select:not(:invalid) {
  color: var(--flame);
  text-shadow: 0 0 0.5px currentColor;
}
```

#### Dropdowns & Popups
```css
.dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: var(--eerie-black);
  border: 1px solid var(--translucent-white-3);
  border-radius: 0.5rem;
  padding: 0;
  margin: 0;
  max-height: 250px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.dropdown-item {
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
  color: var(--gray);
  font-size: 0.7rem;
  position: relative;
  border-bottom: 1px solid var(--translucent-white-3);
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 0px solid transparent;
  pointer-events: none;
  transition: border-color 0.15s ease;
}

.dropdown-item.highlighted {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--flame);
  text-shadow: 0 0 0.5px currentColor;
}

.dropdown-item:hover:not(.highlighted)::after {
  border: 1px solid var(--turquoise);
}
```

#### Custom Scrollbars
```css
.scrollable {
  scrollbar-width: thin;
  scrollbar-color: var(--flame) var(--eerie-black);
}

.scrollable::-webkit-scrollbar {
  width: 6px;
}

.scrollable::-webkit-scrollbar-track {
  background: var(--eerie-black);
}

.scrollable::-webkit-scrollbar-thumb {
  background-color: var(--translucent-white-2);
  border-radius: 6px;
}

.scrollable::-webkit-scrollbar-thumb:hover {
  background-color: var(--flame);
}
```

### Navigation Patterns

#### Sidebar
```css
.sidebar {
  width: var(--sidebar-width-compressed);
  transition: width 0.3s cubic-bezier(0.68, 0, 0.265, 1.2);
  background-color: #ffffff05;
  border-right: 1px solid var(--jet);
  box-shadow: 0 0 3px 1px var(--night);
}

.sidebar.expanded {
  width: 12rem;
}

/* Navigation links */
.nav-link {
  color: var(--platinum);
  text-decoration: none;
  height: 3rem;
  border-bottom: 1px solid var(--jet);
  width: 100%;
  transition: all 0.125s cubic-bezier(0.25, 0.1, 0.25, 1.0);
  position: relative;
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

/* Selected nav link with special effects */
.nav-link.selected::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -2.8rem;
  width: 100px;
  height: 100px;
  background-color: var(--eerie-black);
  z-index: -1;
  opacity: 1;
}
```

#### Tree Navigation (for filters)
```css
.tree-group {
  display: flex;
  flex-direction: column;
  margin-left: 0.75rem;
  font-size: 0.7rem;
  border-left: 1px solid var(--translucent-white-1);
  position: relative;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  padding: 0.5rem 0.75rem;
  background-color: var(--jet);
  border-bottom: 1px solid var(--translucent-white-1);
  position: relative;
  transition: all 0.15s cubic-bezier(0.68, 0, 0.265, 1.2);
}

.node-header:hover {
  color: var(--flame);
  border-color: var(--turquoise);
  background-color: var(--eerie-black);
  text-shadow: 0 0 0.5px currentColor;
}

.node-header:hover::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background-color: var(--flame);
}
```

### Component Specific Patterns

#### Toggle/Switch
```css
.switch-outer {
  width: calc(var(--sidebar-width-compressed) / 2);
  height: calc(var(--sidebar-width-compressed) / 4);
  background-color: var(--eerie-black);
  border-radius: 1.5rem;
  border: 1px solid var(--translucent-white-3);
  padding: 1px;
}

.switch-inner {
  width: calc(var(--sidebar-width-compressed) / 4);
  height: 100%;
  background-color: var(--flame);
  border-radius: 1.5rem;
  transition: transform 0.15s ease;
}

.switch-inner-active {
  transform: translateX(calc(var(--sidebar-width-compressed) / 4 - 4px));
}
```

#### Button Group
```css
.button-group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: max-content;
  background-color: var(--eerie-black);
  border: 1px solid var(--translucent-white-3);
  border-radius: 0.5rem;
  overflow: hidden;
  user-select: none;
}

.option {
  text-wrap: nowrap;
  white-space: nowrap;
  padding: 0.25rem 1rem;
  flex: 1;
  cursor: pointer;
  border: 0;
  border-right: 1px solid var(--translucent-white-3);
  background-color: transparent;
  transition: all 0.15s ease;
  font-size: 0.7rem;
  color: var(--gray);
  position: relative;
}

.option:last-child {
  border-right: 0;
}
```

#### Message/Notification
```css
.message {
  padding: 0.75rem;
  background-color: var(--turquoise-bg);
  border-left: 4px solid var(--turquoise);
  border-radius: 0.25rem;
  margin-top: 1rem;
  color: var(--silver);
  transition: all 0.3s ease;
}

.message.error {
  background-color: rgba(244, 67, 54, 0.1);
  border-left-color: #f44336;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  color: var(--translucent-white-7);
}
```

## Accessibility Considerations

- Ensure focus states are clearly visible
- Use appropriate ARIA attributes on interactive elements
- Maintain adequate color contrast (4.5:1 for normal text)
- Use text-shadow instead of font-weight for emphasis to avoid layout shifts
- Ensure interactive elements have appropriate sizing for touch targets

## Responsive Design

- Use relative units (rem) for sizing and spacing
- Implement appropriate breakpoints for different screen sizes
- Ensure layouts adapt gracefully to different viewport sizes
- Consider mobile-first approach for component design

## CSS Best Practices

- Use CSS variables for consistent theming
- Adopt pseudo-elements for hover/active states
- Implement consistent transition durations and timing functions
- Follow naming conventions for CSS classes (eg. 'me-' prefix for components)
- Consider component states in all designs
