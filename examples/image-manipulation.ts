/**
 * Flag Image Manipulation Examples
 * Demonstrates all the image utilities for resizing, converting, and styling country flags
 */

import { getCountryByISO2, utils } from '../src';

// Get a country
const usa = getCountryByISO2('US');
const india = getCountryByISO2('IN');

if (!usa || !india) {
    console.error('Countries not found!');
    process.exit(1);
}

console.log('🎨 Flag Image Manipulation Examples\n');

// Example 1: Basic Resizing
console.log('1️⃣  Basic Resizing:');
console.log('   Original: 640x480');
const resized = utils.resizeFlagSvg(usa.flag.svg!, 320, 240);
console.log('   Resized to 320x240:', resized.substring(0, 100) + '...');
console.log('');

// Example 2: Maintain Aspect Ratio
console.log('2️⃣  Maintain Aspect Ratio:');
const resizedRatio = utils.resizeFlagSvgMaintainRatio(india.flag.svg!, 200, 200);
console.log('   Fit in 200x200 box maintaining ratio:', resizedRatio.substring(0, 100) + '...');
console.log('');

// Example 3: Preset Sizes
console.log('3️⃣  Using Preset Sizes:');
console.log('   Available presets:', Object.keys(utils.FLAG_SIZES));
const tiny = utils.resizeFlagWithPreset(usa.flag.svg!, 'TINY');
const large = utils.resizeFlagWithPreset(usa.flag.svg!, 'LARGE');
const icon = utils.resizeFlagWithPreset(usa.flag.svg!, 'ICON');
console.log('   TINY (16x12):', tiny.includes('width="16"'));
console.log('   LARGE (128x96):', large.includes('width="128"'));
console.log('   ICON (24x24 square):', icon.includes('width="24"'));
console.log('');

// Example 4: Convert to Data URLs
console.log('4️⃣  Convert to Data URLs:');
const dataUrl = utils.svgToDataUrl(usa.flag.svg!);
const base64Url = utils.svgToBase64DataUrl(usa.flag.svg!);
console.log('   URL encoded:', dataUrl.substring(0, 80) + '...');
console.log('   Base64 encoded:', base64Url.substring(0, 80) + '...');
console.log('');

// Example 5: Generate HTML img tags
console.log('5️⃣  Generate HTML img tags:');
const imgTag = utils.generateFlagImgTag(usa.flag.svg!, {
    width: 64,
    height: 48,
    alt: 'United States Flag',
    className: 'flag-icon',
});
console.log('   HTML:', imgTag);
console.log('');

// Example 6: Apply Shapes
console.log('6️⃣  Apply Shapes (Circle/Rounded):');
const circleFlag = utils.applyFlagShape(india.flag.svg!, 'circle', 64);
const roundedFlag = utils.applyFlagShape(usa.flag.svg!, 'rounded', 100);
console.log('   Circle flag (64x64):', circleFlag.includes('clipPath'));
console.log('   Rounded flag (100x100):', roundedFlag.includes('rx='));
console.log('');

// Example 7: Apply CSS Filters
console.log('7️⃣  Apply CSS Filters:');
const grayscale = utils.applyFlagFilter(usa.flag.svg!, { grayscale: 100 });
const brightened = utils.applyFlagFilter(usa.flag.svg!, {
    brightness: 150,
    contrast: 120,
});
const blurred = utils.applyFlagFilter(usa.flag.svg!, { blur: 2, opacity: 0.7 });
console.log('   Grayscale:', grayscale.includes('grayscale(100%)'));
console.log(
    '   Bright + Contrast:',
    brightened.includes('brightness') && brightened.includes('contrast'),
);
console.log('   Blurred + Opacity:', blurred.includes('blur') && blurred.includes('opacity'));
console.log('');

// Example 8: Emoji Conversion
console.log('8️⃣  Flag Emoji Utilities:');
const usEmoji = utils.isoToFlagEmoji('US');
const inEmoji = utils.isoToFlagEmoji('IN');
console.log('   ISO to Emoji:');
console.log('   US →', usEmoji);
console.log('   IN →', inEmoji);
const unicodeUs = utils.emojiToUnicode(usEmoji);
const unicodeIn = utils.emojiToUnicode(inEmoji);
console.log('   Emoji to Unicode:');
console.log('   🇺🇸 →', unicodeUs);
console.log('   🇮🇳 →', unicodeIn);
console.log('');

// Example 9: Combining Multiple Operations
console.log('9️⃣  Combining Multiple Operations:');
console.log('   Creating a small, circular, grayscale flag:');
let processed = utils.resizeFlagWithPreset(usa.flag.svg!, 'SMALL');
processed = utils.applyFlagShape(processed, 'circle', 32);
processed = utils.applyFlagFilter(processed, { grayscale: 100, brightness: 110 });
console.log('   Result:', processed.substring(0, 120) + '...');
console.log('');

// Example 10: Practical Use Cases
console.log('🔟 Practical Use Cases:\n');

console.log('📱 Mobile App Avatar (32x32 circle):');
const avatar = utils.applyFlagShape(
    utils.resizeFlagWithPreset(usa.flag.svg!, 'ICON'),
    'circle',
    32,
);
console.log('   ', avatar.substring(0, 80) + '...\n');

console.log('🌐 Website Country Selector (24x18):');
const selector = utils.resizeFlagSvg(india.flag.svg!, 24, 18);
console.log('   ', selector.substring(0, 80) + '...\n');

console.log('🖼️  Hero Banner (800x600):');
const banner = utils.resizeFlagWithPreset(usa.flag.svg!, 'BANNER');
console.log('   ', banner.substring(0, 80) + '...\n');

console.log('✅ All examples completed successfully!');
