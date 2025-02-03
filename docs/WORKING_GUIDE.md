# Working Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Modern web browser
- Supabase account
- Azure account (for Computer Vision API)

### Development Setup

1. **Environment Setup**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

2. **Environment Variables**
Create `.env` file with required credentials:
```env
VITE_SUPABASE_ANON_KEY=your_key
VITE_SUPABASE_URL=your_url
VITE_GOOGLE_FONTS_API_KEY=your_key
VITE_AZURE_CV_ENDPOINT=your_endpoint
VITE_AZURE_CV_KEY=your_key
```

## 🛠️ Development Workflow

### Project Structure
```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── stores/        # State management
├── utils/         # Utility functions
├── types/         # TypeScript types
└── styles/        # Global styles
```

### Key Components

1. **Canvas Component**
   - Handles image rendering
   - Manages text layers
   - Coordinates drag & drop

2. **Text Editor**
   - Text styling controls
   - Effect management
   - Font handling

3. **Layer Manager**
   - Layer ordering
   - Visibility controls
   - Layer type management

### State Management

Using Zustand for state management:
```typescript
const useStore = create((set) => ({
  // State and actions
}));
```

### API Integration

1. **Supabase**
   - Authentication
   - File storage
   - Database operations

2. **Azure Computer Vision**
   - Background removal
   - Image processing

## 🔧 Common Tasks

### Adding New Features

1. Create necessary components
2. Add required state management
3. Implement API integration
4. Add tests
5. Update documentation

### Debugging

1. Check browser console
2. Use React DevTools
3. Verify API responses
4. Check state management

### Testing

```bash
# Run tests
npm run test

# Run with coverage
npm run test:coverage
```

## 📦 Deployment

### Build Process
```bash
# Create production build
npm run build

# Preview build
npm run preview
```

### Deployment Checklist

1. Update environment variables
2. Run build process
3. Test production build
4. Deploy to hosting platform
5. Verify deployment

## 🔍 Quality Assurance

### Code Quality
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Code review process

### Performance
- Image optimization
- Code splitting
- Lazy loading
- Caching strategies

### Security
- Input validation
- XSS prevention
- CORS configuration
- API security