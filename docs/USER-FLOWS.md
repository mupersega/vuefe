# User Flows Documentation

## Overview

This document outlines the primary user flows in the EVE Online App, with detailed step-by-step processes and corresponding UI screenshots.

## 1. Application Overview Flow

### Initial Load
![Homepage Overview](./images/01-homepage-overview.png)

**Steps:**
1. User opens the application in their browser
2. Application loads with the Home dashboard active
3. Navigation sidebar is visible on the left with all major sections
4. Search controls are available at the top
5. Filter panel controls are accessible via top-right buttons

**Key UI Elements:**
- **Navigation Sidebar**: Collapsible menu with EVE-themed icons
- **Search Bar**: Real-time search with configurable matching modes
- **Filter Controls**: Toggle buttons for advanced filtering options
- **Main Content Area**: Dynamic content based on selected section

---

## 2. Navigation Flow

### Workshop Section
![Workshop View](./images/02-workshop-view.png)

**Steps:**
1. User clicks on the Workshop icon (compass/drafting tool) in the sidebar
2. Page transitions smoothly to the Workshop view
3. Active state is highlighted in the navigation
4. Workshop-specific tools and content are displayed

### Foundry Section
![Foundry View](./images/03-foundry-view.png)

**Steps:**
1. User clicks on the Foundry icon (industry building) in the sidebar
2. Application navigates to the industrial operations view
3. Foundry-specific interface elements are loaded
4. Navigation state updates to show current location

### Barracks Section
![Barracks View](./images/04-barracks-view.png)

**Steps:**
1. User clicks on the Barracks icon (users/people) in the sidebar
2. Character management interface is displayed
3. Tools for managing characters and skills are available
4. Navigation clearly indicates the active section

**Navigation Features:**
- **Visual Feedback**: Active section is highlighted with flame accent
- **Smooth Transitions**: Animations between sections
- **State Persistence**: Previous selections are remembered
- **Responsive Design**: Navigation adapts to screen size

---

## 3. Search and Filter Flow

### Search Activation
![Search Active](./images/05-search-active.png)

**Steps:**
1. User clicks in the search input field at the top
2. Search field activates with visual feedback (color change)
3. User types search terms (e.g., "ship")
4. Real-time filtering occurs as user types
5. Results are displayed in the main content area

**Search Features:**
- **Smart Matching**: Toggle between "starts with" and "contains" modes
- **Visual Indicators**: 
  - Input field changes color when active
  - "Aa..." indicator shows current search mode
- **Real-time Results**: Instant filtering without needing to press Enter
- **Clear Function**: Easy way to clear search terms

### Filter Panel Usage

**Steps:**
1. User clicks the filter button in the top-right controls
2. Filter panel slides in from the left
3. Market group dropdown becomes available
4. User can select specific categories to filter by
5. Tree controls allow expanding/collapsing all groups

**Filter Options:**
- **Market Groups**: Hierarchical category system
- **Expand/Collapse**: Bulk operations on filter tree
- **Visual Indicators**: Shows active filters and counts
- **Persistent State**: Filter selections are maintained

---

## 4. Item Management Flow

### Item Selection Process

**Steps:**
1. User searches for items using the search bar
2. Items appear in the main staging area
3. User clicks on items to select them
4. Selected items are highlighted with flame accent
5. Selection counter appears on selected items
6. Items can be managed in bulk or individually

### Staging Area Interaction

**Features:**
- **Visual Selection**: Clear indication of selected items
- **Quantity Management**: Adjust amounts for each item
- **Batch Operations**: Work with multiple items simultaneously
- **Drag and Drop**: Intuitive item manipulation
- **Clear Instructions**: Helpful tooltips and guidance text

---

## 5. Layout Customization Flow

### Control Panel Usage

**Steps:**
1. User notices the control buttons in the top-right corner
2. Filter button toggles the left filter panel
3. Search button toggles the top search controls
4. Settings button provides additional configuration options

**Customization Options:**
- **Panel Visibility**: Show/hide filter and search panels
- **Sidebar State**: Expand/collapse navigation sidebar
- **Responsive Behavior**: Automatic adjustments for different screen sizes
- **Persistent Preferences**: Settings are saved across sessions

---

## 6. Responsive Design Flow

### Mobile/Tablet Adaptation

**Automatic Adjustments:**
- Navigation sidebar becomes more compact
- Search controls adapt to smaller screens
- Filter panels overlay instead of side-by-side
- Touch-friendly button sizes and spacing
- Optimized typography for smaller screens

### Desktop Optimization

**Enhanced Features:**
- Full sidebar with text labels
- Side-by-side panel layout
- Keyboard shortcuts and navigation
- Hover effects and detailed tooltips
- Multi-column layouts where appropriate

---

## User Experience Principles

### Performance
- **Fast Loading**: Optimized assets and lazy loading
- **Smooth Animations**: Hardware-accelerated transitions
- **Responsive Search**: Debounced input for optimal performance
- **Efficient Rendering**: Virtual scrolling for large datasets

### Accessibility
- **Keyboard Navigation**: Full keyboard support throughout
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **High Contrast**: Clear visual distinctions
- **Focus Management**: Logical tab order and focus indicators

### Visual Design
- **EVE Theme**: Dark space aesthetic with flame accents
- **Consistent Iconography**: Font Awesome icons throughout
- **Color System**: Carefully chosen palette for usability
- **Typography**: Readable fonts with proper hierarchy

---

## Technical Implementation

### State Management
- **Pinia Stores**: Centralized state management
- **Reactive Updates**: Real-time UI updates
- **Persistent Storage**: Local storage for user preferences
- **API Integration**: Seamless data synchronization

### Component Architecture
- **Modular Design**: Reusable components
- **Vue 3 Features**: Composition API and modern Vue patterns
- **TypeScript**: Type safety throughout the application
- **Custom Directives**: Enhanced functionality

This documentation provides a comprehensive overview of how users interact with the EVE Online App, ensuring a smooth and intuitive experience for all EVE Online players.
