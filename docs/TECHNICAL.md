# Technical Documentation

## Architecture Overview

The EVE Online App is built using modern web technologies with a focus on performance, maintainability, and user experience.

## Technology Stack

### Frontend Framework
- **Vue 3**: Latest version with Composition API
- **TypeScript**: Full type safety throughout the application
- **Vite**: Fast build tool and development server
- **Vue Router**: Client-side routing
- **Pinia**: State management

### UI/UX Libraries
- **Font Awesome**: Icon system
- **Tippy.js**: Tooltips and popovers
- **Custom CSS**: Tailored design system

### Data Management
- **Dexie**: IndexedDB wrapper for local storage
- **OpenAPI Generated Client**: Type-safe API integration
- **ESI API**: EVE Online's official API

## Project Structure

```
src/
├── api-client/              # Generated API client
│   ├── api/                 # API endpoint classes
│   ├── models/              # TypeScript interfaces
│   └── docs/                # API documentation
├── assets/                  # Static assets
├── config/                  # Configuration files
│   ├── adminActions.ts      # Admin functionality
│   ├── icons.ts             # Icon mappings
│   ├── router.ts            # Route definitions
│   └── tooltips.ts          # Tooltip configurations
├── directives/              # Vue directives
│   └── v-img-loaded.ts      # Image loading directive
├── interfaces/              # TypeScript interfaces
├── scripts/                 # Build scripts
│   ├── generate-api.js      # API client generation
│   └── generate-api-cli.js  # CLI version
├── services/                # Business logic
│   ├── apiService.ts        # API abstraction layer
│   ├── db.ts                # Database operations
│   └── esiService.ts        # EVE API integration
├── stores/                  # Pinia stores
│   ├── useGroupTreeStore.ts # Market group management
│   ├── useLayoutStore.ts    # UI layout state
│   ├── useMainStateStore.ts # Global application state
│   ├── useStagingStore.ts   # Item selection state
│   └── useWorkshopStore.ts  # Workshop functionality
└── ui/                      # User interface
    ├── components/          # Reusable components
    ├── layouts/             # Layout components
    ├── style/               # Styling system
    └── views/               # Page components
```

## Component Architecture

### Layout System
```
MainLayout.vue
├── Sidebar.vue
│   └── NavLink.vue
├── SearchControls.vue
│   └── MeCombobox.vue
├── FilterHousing.vue
│   └── MarketGroupFilter.vue
├── Staging.vue
│   └── InvTypeSlip.vue
└── LayoutControls.vue
```

### Reusable Components
- **MeCombobox**: Advanced searchable dropdown
- **MeButtonGroup**: Grouped button controls
- **MeSwitch**: Toggle switches
- **InvTypeSlip**: Item display cards
- **MarketGroupFilter**: Hierarchical filtering

### Component Features
- **Scoped Styling**: Each component has isolated CSS
- **TypeScript Props**: Fully typed component interfaces
- **Composable Logic**: Reusable composition functions
- **Event System**: Proper parent-child communication

## State Management

### Pinia Stores

#### Main State Store
```typescript
interface MainState {
  isLoading: boolean;
  searchTerm: string;
  selectedItems: InvType[];
  error: string | null;
}
```

#### Layout Store
```typescript
interface LayoutState {
  sidebarExpanded: boolean;
  showSearchControls: boolean;
  showFilterPanel: boolean;
  isMobile: boolean;
}
```

#### Group Tree Store
```typescript
interface GroupTreeState {
  marketGroups: MarketGroup[];
  selectedGroups: number[];
  expandedGroups: Set<number>;
  loading: boolean;
}
```

### Store Features
- **Reactive Updates**: Automatic UI updates on state changes
- **Persistent Storage**: State persisted to localStorage
- **Computed Properties**: Derived state calculations
- **Actions**: Async operations and mutations

## Data Flow

### API Integration
1. **ESI API**: EVE Online's official API for game data
2. **Generated Client**: OpenAPI-generated TypeScript client
3. **Service Layer**: Abstraction over raw API calls
4. **Store Actions**: Business logic and state updates
5. **Component Reactivity**: UI updates automatically

### Local Storage
1. **Dexie Database**: IndexedDB for structured data
2. **Caching Strategy**: Intelligent data caching
3. **Offline Support**: Basic offline functionality
4. **Sync Management**: Conflict resolution

## Styling System

### CSS Architecture
- **CSS Variables**: Dynamic theming system
- **Scoped Styles**: Component-isolated styling
- **Utility Classes**: Common utility patterns
- **Responsive Design**: Mobile-first approach

### Design Tokens
```css
:root {
  /* Core Colors */
  --white: #ffffffff;
  --platinum: #e1e0dcff;
  --silver: #b0ada7ff;
  --gray: #7e7a72ff;
  --jet: #302e2bff;
  --eerie-black: #201f1dff;
  --night: #0b0a0aff;
  
  /* Accent Colors */
  --flame: #eb5e28ff;
  --burnt-sienna: #ed6d3cff;
  --turquoise: #40e0d0;
  
  /* Spacing */
  --sidebar-width-compressed: 3.5rem;
  --top-drawer-height: 320px;
}
```

### Animation System
- **Smooth Transitions**: Hardware-accelerated animations
- **Cubic Bezier Easing**: Natural motion curves
- **Performance Optimized**: Transform-based animations
- **Reduced Motion**: Respects user preferences

## Performance Optimizations

### Build Optimizations
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Dynamic imports for routes
- **Asset Optimization**: Compressed images and fonts
- **Bundle Analysis**: Size monitoring and optimization

### Runtime Optimizations
- **Virtual Scrolling**: Efficient large list rendering
- **Debounced Search**: Optimized search performance
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Cached computed values

### Memory Management
- **Component Cleanup**: Proper lifecycle management
- **Event Listeners**: Automatic cleanup on unmount
- **Store Management**: Efficient state updates
- **Image Loading**: Optimized asset loading

## Development Workflow

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Generate API client
npm run generate-api

# Build for production
npm run build
```

### Code Quality
- **TypeScript**: Full type checking
- **ESLint**: Code linting and formatting
- **Vue Official**: Vue 3 specific linting rules
- **Prettier**: Code formatting

### Testing Strategy
- **Unit Tests**: Component and function testing
- **Integration Tests**: Store and service testing
- **E2E Tests**: Full user flow testing
- **Performance Tests**: Load and stress testing

## Deployment

### Build Process
1. **Type Checking**: Full TypeScript compilation
2. **Asset Optimization**: Image and CSS optimization
3. **Bundle Generation**: Optimized JavaScript bundles
4. **Static Generation**: Pre-rendered static assets

### Production Considerations
- **CDN Deployment**: Static asset distribution
- **Caching Strategy**: Efficient browser caching
- **Error Monitoring**: Production error tracking
- **Performance Monitoring**: Real-user metrics

## Security Considerations

### Data Protection
- **No Sensitive Data**: No passwords or keys stored
- **API Keys**: Handled server-side only
- **CORS**: Proper cross-origin configuration
- **Input Validation**: All user inputs validated

### Best Practices
- **Content Security Policy**: XSS protection
- **Secure Headers**: Standard security headers
- **Dependencies**: Regular security updates
- **Code Review**: Security-focused reviews

## Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration
- **Advanced Analytics**: Usage tracking and insights
- **Mobile App**: Native mobile application
- **API Extensions**: Additional EVE API endpoints

### Technical Improvements
- **Service Workers**: Enhanced offline support
- **Web Workers**: Background processing
- **WebAssembly**: Performance-critical operations
- **Progressive Web App**: Full PWA capabilities

This technical documentation provides a comprehensive overview of the application's architecture, implementation details, and development practices.
