# EVE Online App 🚀

A comprehensive inventory and market management tool for EVE Online players, built with Vue 3, TypeScript, and modern web technologies.

## ✨ Features

- **🏠 Dashboard**: Central hub with quick access to all features
- **🔧 Workshop**: Blueprint management and manufacturing planning
- **🏭 Foundry**: Industrial operations and production oversight
- **👥 Barracks**: Character management and skill planning
- **📚 Archive**: Data storage and historical records
- **⚙️ Bridge**: System configuration and advanced settings

## 🎯 Key Capabilities

### Advanced Search & Filtering
- Real-time item search with smart matching
- Hierarchical market group filtering
- Configurable search modes (starts with / contains)
- Visual feedback and keyboard navigation

### Modern UI/UX
- Sleek dark theme with EVE-inspired design
- Responsive layout for all screen sizes
- Smooth animations and micro-interactions
- Accessible design with full keyboard support

### Performance Optimized
- Lazy loading and virtual scrolling
- Smart caching and data synchronization
- Debounced search for optimal performance
- Efficient component architecture

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:5173` to see the application in action.

## 📖 Documentation

For comprehensive documentation including user flows, technical details, and design system information, see:

**[📋 Full Documentation](./DOCUMENTATION.md)**

## 🛠️ Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Font Awesome
- **State Management**: Pinia
- **Routing**: Vue Router
- **API Client**: OpenAPI Generated Client
- **Database**: Dexie (IndexedDB)

## 📁 Project Structure

```
src/
├── api-client/          # Generated API client
├── assets/              # Static assets
├── config/              # Configuration files
├── directives/          # Vue directives
├── interfaces/          # TypeScript interfaces
├── services/            # Business logic services
├── stores/              # Pinia state stores
├── ui/                  # UI components and views
│   ├── components/      # Reusable components
│   ├── layouts/         # Layout components
│   ├── style/           # Styling and design system
│   └── views/           # Page components
└── scripts/             # Build and utility scripts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎮 EVE Online

This application is designed for EVE Online players and utilizes EVE Online's ESI API. EVE Online is a trademark of CCP hf.

---

*Built with ❤️ for the EVE Online community*
