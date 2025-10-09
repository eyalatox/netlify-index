# MCP Index

A modern React Next.js application for browsing Model Context Protocol packages, built based on the provided Figma mockup.

## Features

- **Package Discovery**: Browse and search through a comprehensive collection of MCP packages
- **Detailed Package Pages**: View detailed information about each package including documentation, installation instructions, and metadata
- **Responsive Design**: Optimized for both desktop and mobile viewing
- **Clean UI**: Modern, clean interface following the provided Figma design

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **Static Export**: Optimized for Netlify deployment

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MCP-Index
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This application is optimized for deployment on Netlify with static site generation.

### 🚀 Netlify Deployment (Recommended)

#### Option 1: Connect GitHub Repository
1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com) and sign in
3. Click "New site from Git"
4. Connect your GitHub account and select this repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - **Node version**: `18.17.0` (or higher)
6. Click "Deploy site"

#### Option 2: Manual Deploy
1. Build the project locally:
   ```bash
   npm run build
   ```
2. Drag and drop the `out` folder to [Netlify Drop](https://app.netlify.com/drop)

### Configuration Files

The following files are pre-configured for optimal Netlify deployment:

- **`netlify.toml`**: Build settings, redirects, and headers
- **`public/_headers`**: Additional performance and security headers
- **`next.config.js`**: Static export configuration
- **`.env.example`**: Environment variables template

### Build Optimization Features

✅ **Static Site Generation**: All pages pre-rendered for fast loading  
✅ **Optimized Images**: Unoptimized for static hosting compatibility  
✅ **Clean URLs**: Trailing slashes for consistent routing  
✅ **Security Headers**: XSS protection, frame options, content type  
✅ **Caching**: Long-term caching for static assets  
✅ **Redirects**: Proper handling of dynamic routes and 404s  

### Environment Variables (Optional)

If you need environment variables:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Update the values in `.env.local`
3. In Netlify, go to Site settings > Environment variables to add production variables

### Custom Domain (Optional)

To use a custom domain with Netlify:

1. Go to Site settings > Domain management
2. Add your custom domain
3. Configure DNS settings as instructed by Netlify
4. SSL certificate will be automatically provided

### Performance Tips

- All routes are pre-rendered at build time
- Static assets are cached with long expiration
- Images are optimized for web delivery
- CSS and JS are minified and compressed

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. The static files will be generated in the `out` directory
3. Upload the contents of the `out` directory to your hosting provider

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Inter font
│   ├── page.tsx           # Home page with search and package listings
│   └── package/
│       └── [name]/
│           └── page.tsx   # Dynamic package detail pages
├── components/            # Reusable components (future expansion)
└── styles/
    └── globals.css       # Global styles
```

## Features Implemented

### Home Page
- Header with navigation and branding
- Hero section with search functionality
- Package statistics display
- Popular categories grid
- Package listings with metadata

### Package Pages
- Detailed package information
- Installation instructions
- README content display
- Package metadata sidebar
- Links to repository and homepage
- Maintainer information
- FAQ section

## Configuration

- **Next.js Config**: Configured for static export (`next.config.js`)
- **Netlify Config**: Optimized routing and deployment settings (`netlify.toml`)
- **TypeScript**: Strict type checking enabled
- **Tailwind CSS**: Custom styling with responsive design

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT License
