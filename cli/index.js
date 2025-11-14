#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const program = new Command();

// Device configurations matching the web app
const DEVICE_CONFIGS = {
  PHONE: { width: 1080, height: 1920, folder: 'phone' },
  TABLET: { width: 1600, height: 2560, folder: 'tablet' },
  TABLET_10_INCH: { width: 1920, height: 1200, folder: '10inch' },
  CHROMEBOOK: { width: 2560, height: 1600, folder: 'chromebook' },
  ANDROID_TV: { width: 1280, height: 720, folder: 'xr' },
  WEAR_OS: { width: 384, height: 384, folder: 'xr' },
  ANDROID_AUTO: { width: 1920, height: 1080, folder: 'xr' },
};

program
  .name('playshotgen')
  .description('CLI tool for generating Google Play Store screenshots')
  .version('1.0.0');

program
  .command('process')
  .description('Process images for Play Store screenshots')
  .option('-i, --input <path>', 'Input image file or directory', './input')
  .option('-o, --output <path>', 'Output directory', './output')
  .option('-d, --devices <devices>', 'Comma-separated list of devices (phone,tablet,10inch,chromebook,xr)', 'phone,tablet,10inch,chromebook')
  .option('--padding <type>', 'Padding type: blur, solid, transparent', 'transparent')
  .option('--padding-color <color>', 'Padding color for solid padding', '#000000')
  .action(async (options) => {
    try {
      console.log('🚀 PlayShotGen CLI - Processing images...');
      
      const inputPath = path.resolve(options.input);
      const outputPath = path.resolve(options.output);
      const devices = options.devices.split(',').map(d => d.trim().toUpperCase());
      
      // Create output directory
      await fs.mkdir(outputPath, { recursive: true });
      
      // Get input files
      const inputFiles = [];
      const inputStat = await fs.stat(inputPath);
      
      if (inputStat.isDirectory()) {
        const files = await fs.readdir(inputPath);
        for (const file of files) {
          if (file.match(/\.(jpg|jpeg|png)$/i)) {
            inputFiles.push(path.join(inputPath, file));
          }
        }
      } else {
        inputFiles.push(inputPath);
      }
      
      console.log(`📁 Found ${inputFiles.length} image(s)`);
      console.log(`🎯 Target devices: ${devices.join(', ')}`);
      
      // Process each image for each device
      let processedCount = 0;
      const totalCount = inputFiles.length * devices.length;
      
      for (const inputFile of inputFiles) {
        const imageBuffer = await fs.readFile(inputFile);
        const fileName = path.basename(inputFile, path.extname(inputFile));
        
        for (const deviceKey of devices) {
          const device = DEVICE_CONFIGS[deviceKey];
          if (!device) {
            console.warn(`⚠️  Unknown device: ${deviceKey}`);
            continue;
          }
          
          // Create device folder
          const deviceFolder = path.join(outputPath, device.folder);
          await fs.mkdir(deviceFolder, { recursive: true });
          
          // Process image
          const outputFile = path.join(deviceFolder, `${fileName}.png`);
          
          await sharp(imageBuffer)
            .resize(device.width, device.height, {
              fit: 'inside',
              background: options.padding === 'transparent' ? { r: 0, g: 0, b: 0, alpha: 0 } : 
                         options.padding === 'solid' ? options.paddingColor : 
                         { r: 42, g: 42, b: 42 }
            })
            .png()
            .toFile(outputFile);
          
          processedCount++;
          const progress = Math.round((processedCount / totalCount) * 100);
          console.log(`📸 ${progress}% - ${inputFile} -> ${outputFile}`);
        }
      }
      
      console.log('✅ Processing complete!');
      console.log(`📂 Output saved to: ${outputPath}`);
      
    } catch (error) {
      console.error('❌ Error processing images:', error.message);
      process.exit(1);
    }
  });

program
  .command('devices')
  .description('List available devices and their dimensions')
  .action(() => {
    console.log('📱 Available devices:');
    Object.entries(DEVICE_CONFIGS).forEach(([key, config]) => {
      console.log(`  ${key.toLowerCase().padEnd(12)} - ${config.width}x${config.height} (${config.folder})`);
    });
  });

program.parse();