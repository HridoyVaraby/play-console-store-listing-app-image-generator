# PlayShotGen

Professional screenshot generator for Google Play Store listings.

## Overview

PlayShotGen simplifies the creation of Google Play Store-compliant screenshots for various Android device types from your uploaded images. It's designed to save developers time and effort by automating the process of generating essential app store assets.

## Features

- **Bulk Upload**: Upload multiple images at once (max 10MB each).
- **Multiple Device Support**: 
  - Phone (1080×1920, 16:9 Portrait)
  - Tablet (1600×2560, 16:10 Portrait) 
  - 10-inch Tablet (1920×1200, 16:10 Landscape)
  - Chromebook (2560×1600, 16:10 Landscape)
- **Smart Processing**: Automatic aspect ratio correction with smart cropping and padding.
- **Image Gallery**: Preview all generated screenshots organized by device type.
- **Individual Downloads**: Download each screenshot separately.
- **Image Preview**: Full-screen preview modal for detailed inspection.
- **Batch Download**: Download all processed images as a single ZIP file.
- **Edge Case Handling**: 
  - Corrupted image detection.
  - Duplicate filename auto-rename.
  - Aspect ratio fallback to padding.

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

3. Open http://localhost:5173 in your browser

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

## File Structure

```
/output/
  /phone/
  /tablet/
  /10inch/
  /chromebook/
```

## Technical Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Image Processing**: Canvas API
- **Build Tool**: Vite
- **Containerization**: Docker

## About Varabit

PlayShotGen is developed and maintained by **Varabit**, a software company dedicated to creating high-quality tools and solutions.

For more information, visit our website: [varabit.com](https://varabit.com)

## License

MIT License

---
© 2025 Varabit. All Rights Reserved.