# 📄 Product Requirements Document (PRD)

## 🧭 Overview

**Product Name**: PlayShotGen  
**Purpose**: Streamline the generation of Google Play Store–compliant screenshots across multiple Android device categories from user-uploaded images.  
**Target Users**: Android developers, app publishers, agencies managing Play Store listings.

---

## 🎯 Goals

- Enable bulk upload of app screenshots.
- Automatically resize and format images for:
  - Phone
  - Tablet
  - 10-inch Tablet
  - Chromebook
  - Android XR (TV, Wear OS, Auto)
- Provide downloadable, Play Console–ready image packages.

---

## 📥 Inputs

### Input Field 1: Phone + Tablet
- Accepts bulk upload of screenshots.
- Supported formats: `.png`, `.jpg`, `.jpeg`
- Max file size: 10MB per image
- Max upload count: 20 images

### Input Field 2: 10-inch Tablet + Chromebook
- Same constraints as above

---

## 🖼️ Output Specifications

| Device Type     | Dimensions (px) | Aspect Ratio | Notes |
|-----------------|------------------|--------------|-------|
| Phone           | 1080 × 1920      | 16:9         | Portrait |
| Tablet          | 1600 × 2560      | 16:10        | Portrait |
| 10-inch Tablet  | 1920 × 1200      | 16:10        | Landscape |
| Chromebook      | 2560 × 1600      | 16:10        | Landscape |
| Android TV      | 1280 × 720       | 16:9         | Landscape |
| Wear OS         | 384 × 384        | 1:1          | Square |
| Android Auto    | 1920 × 1080      | 16:9         | Landscape |

---

## 🔧 Features

### 1. Upload & Preview
- Drag-and-drop or file picker
- Thumbnail preview
- Validation: format, size, count

### 2. Image Processing
- Resize to target dimensions
- Aspect ratio correction via:
  - Smart cropping
  - Padding (blurred or solid background)
- Optional: Add device frame overlays

### 3. Output Packaging
- Folder structure:
  ```
  /output/
    /phone/
    /tablet/
    /10inch/
    /chromebook/
    /xr/
  ```
- Auto-zip for download
- Optional manifest file for Play Console

### 4. UI/UX
- Responsive layout
- Progress bar for uploads and processing
- Success/failure notifications
- Download button for final zip

---

## 🧱 Architecture

| Layer     | Stack                     |
|-----------|---------------------------|
| Frontend  | React + Tailwind + Dropzone |
| Backend   | Node.js + Express + Sharp |
| Storage   | Local or S3 (configurable) |
| Deployment| Docker + Dokploy-ready     |

---

## 🧪 Edge Cases

- Non-standard aspect ratios → fallback to padding
- Corrupted image → skip with error message
- Duplicate filenames → auto-rename with suffix

---

## 📦 Deliverables

- MVP with Phone, Tablet, 10-inch Tablet, Chromebook support
- CLI version for offline use (optional)
- Documentation for usage and deployment
- Future-proofed for Android XR support

---

## 🔮 Future Enhancements

- Direct Play Console API integration
- User presets and branding overlays
- Multi-language UI
- Account system for saved uploads


