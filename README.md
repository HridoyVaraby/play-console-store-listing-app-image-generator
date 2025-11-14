# PlayShotGen

Professional screenshot generator for Google Play Store listings.

## Overview

PlayShotGen streamlines the generation of Google Play Store-compliant screenshots across multiple Android device categories from user-uploaded images.

## Features

- **Bulk Upload**: Upload up to 20 images at once (max 10MB each)
- **Multiple Device Support**: 
  - Phone (1080×1920, 16:9 Portrait)
  - Tablet (1600×2560, 16:10 Portrait) 
  - 10-inch Tablet (1920×1200, 16:10 Landscape)
  - Chromebook (2560×1600, 16:10 Landscape)
  - Android TV (1280×720, 16:9 Landscape)
  - Wear OS (384×384, 1:1 Square)
  - Android Auto (1920×1080, 16:9 Landscape)
- **Smart Processing**: Automatic aspect ratio correction with smart cropping and padding
- **Device Frame Overlays**: Optional device frames for XR devices (TV, Wear OS, Auto)
- **Image Gallery**: Preview all generated screenshots organized by device type
- **Individual Downloads**: Download each screenshot separately or all at once
- **Image Preview**: Full-screen preview modal for detailed inspection
- **Batch Download**: Download all processed images as a single ZIP file
- **Edge Case Handling**: 
  - Corrupted image detection
  - Duplicate filename auto-rename
  - Aspect ratio fallback to padding

## Quick Start

### Web Application

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser

### CLI Version (Offline Use)

1. Navigate to CLI directory:
```bash
cd cli
```

2. Install CLI dependencies:
```bash
npm install
```

3. Link CLI globally:
```bash
npm link
```

4. Use the CLI:
```bash
# Process single image
playshotgen process -i input.jpg -o ./output

# Process directory with specific devices
playshotgen process -i ./input -o ./output -d phone,tablet,chromebook

# List available devices
playshotgen devices
```

## Deployment

### Production Build

Build the application for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

### Docker Deployment

#### Production Deployment
1. Build Docker image:
```bash
docker build -t playshotgen .
```

2. Run with Docker Compose:
```bash
docker-compose up -d
```

3. Access at http://localhost:3000

#### Development with Docker
For development with hot-reload:
```bash
docker-compose -f docker-compose.dev.yml up
```

### Dokploy Deployment

The application is ready for Dokploy deployment with the included `docker-compose.yml` file.

## File Structure

```
/output/
  /phone/
  /tablet/
  /10inch/
  /chromebook/
  /xr/
```

## Technical Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Image Processing**: Canvas API + Sharp (CLI)
- **Build Tool**: Vite
- **Containerization**: Docker

## License

MIT License