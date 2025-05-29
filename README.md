# Today's Progress Card

A Vue.js component for tracking daily writing progress with weekly overview. Built with Nuxt 2 and Vuetify 2.

## 🚀 Live Demo

Visit the demo page at `http://localhost:3000` after running the development server to see the component in action.

## 📋 Features

- **Circular Progress Ring**: Visual progress indicator with percentage calculation
- **Weekly Overview**: Seven-day pill display showing completion status
- **Interactive Target Setting**: Click the three-dot menu to update daily targets
- **Responsive Design**: Gracefully scales from 320px to desktop widths
- **Hover Tooltips**: Encouraging messages when progress is below 100%
- **Real-time Updates**: Dynamic progress calculation and visual feedback

## 🛠️ Tech Stack

- **Nuxt 2** - Vue.js framework in SPA mode
- **Vuetify 2** - Material Design component library
- **Jest** - Unit testing framework
- **JavaScript** - ES6+ with optional TypeScript support

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd todays-progress-card

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode

# Production
npm run build        # Build for production
npm run start        # Start production server
npm run generate     # Generate static files
```

## 🧪 Testing

The project includes comprehensive unit tests for the ProgressCard component:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test -- --coverage

# Run tests in watch mode during development
npm run test:watch
```

### Test Coverage

- Progress percentage calculation and clamping
- Day completion logic
- Tooltip behavior
- Target dialog functionality
- Props validation
- Edge cases and error handling

## 🎯 Component Usage

### Basic Implementation

```vue
<template>
  <ProgressCard
    :history="weeklyData"
    :daily-target="1000"
    :active-day="currentDay"
    :on-update-target="handleTargetUpdate"
  />
</template>

<script>
import ProgressCard from '~/components/ProgressCard.vue'

export default {
  components: {
    ProgressCard
  },
  data() {
    return {
      weeklyData: [1200, 800, 600, 0, 0, 0, 0], // Mon-Sun
      currentDay: 1 // Tuesday (0-indexed)
    }
  },
  methods: {
    handleTargetUpdate(newTarget) {
      console.log('New daily target:', newTarget)
      // Handle target update logic here
    }
  }
}
</script>
```

### Props API

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `history` | `Number[7]` | ✅ | Words written for each day (Mon=0 to Sun=6) |
| `dailyTarget` | `Number` | ✅ | Current daily goal (must be > 0) |
| `activeDay` | `Number` | ✅ | Current day index (0-6, where Mon=0) |
| `onUpdateTarget` | `Function` | ✅ | Callback fired when user saves new target |

### Key Features Implementation

#### 1. Progress Calculation
```javascript
// Automatically calculates and clamps percentage to 100%
progressPercentage = Math.min((todayWords / dailyTarget) * 100, 100)
```

#### 2. Day Completion Status
```javascript
// Days are marked complete when words >= dailyTarget
isCompleted(dayIndex) {
  return this.history[dayIndex] >= this.dailyTarget
}
```

#### 3. Responsive Design
- Minimum width: 320px
- Graceful scaling for mobile devices
- Horizontal scrolling for day pills on very small screens

#### 4. Interactive Elements
- **Three-dot menu**: Opens target setting dialog
- **Hover tooltips**: Show encouragement when progress < 100%
- **Active day highlighting**: Visual indicator with outline ring

## 🎨 Styling & Theming

The component uses Vuetify's theming system. Primary color (teal) can be customized in `nuxt.config.js`:

```javascript
vuetify: {
  theme: {
    themes: {
      light: {
        primary: '#00897B', // Customize this color
        // ... other theme colors
      }
    }
  }
}
```

## 📱 Responsive Behavior

- **Desktop (>600px)**: Full layout with optimal spacing
- **Tablet (400-600px)**: Condensed layout with maintained functionality  
- **Mobile (320-400px)**: Compact pills and smaller progress ring
- **Minimum (320px)**: Minimal viable layout with horizontal scrolling

## 🔧 Configuration

### Nuxt Configuration

Key settings in `nuxt.config.js`:
- **Mode**: `'spa'` for single-page application
- **Target**: `'static'` for JAMstack deployment
- **Vuetify**: Material Design components and theming

### Environment Setup

```bash
# Verify Node.js version
node --version  # Should be v14+

# Check Vuetify installation
npm list vuetify  # Should show v2.x

# Validate Jest configuration
npm run test -- --version
```

## 🐛 Troubleshooting

### Common Issues

**Console warnings during development:**
- Ensure all required props are provided
- Check that `history` array has exactly 7 elements
- Verify `activeDay` is between 0-6

**Tests failing:**
- Run `npm install` to ensure all dependencies are installed
- Check Jest configuration in `jest.config.js`
- Verify test environment setup

**Responsive issues:**
- Test at 320px minimum width
- Check CSS media queries in component
- Verify Vuetify breakpoint classes

### Development Tips

1. **Hot Reload**: Changes to components auto-refresh in browser
2. **Vue DevTools**: Install browser extension for debugging
3. **Console Logging**: Target updates are logged for demonstration
4. **Error Boundaries**: Component includes prop validation

## 📈 Performance Considerations

- **Computed Properties**: Progress calculations are cached and reactive
- **Event Handling**: Debounced input for smooth interactions
- **Memory Usage**: No localStorage/sessionStorage dependencies
- **Bundle Size**: Optimized imports and tree-shaking ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Run tests: `npm run test`
4. Commit changes: `git commit -am 'Add new feature'`
5. Push to branch: `git push origin feature/new-feature`
6. Submit a Pull Request

## 📄 License

This project is created as a pilot task demonstration. All rights reserved.

---

**Built with ❤️ using Vue.js ecosystem**

For questions or support, please check the demo page and console logs for debugging information.