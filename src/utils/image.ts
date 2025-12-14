/**
 * Flag image manipulation utilities
 * Provides functions to convert, resize, and format flag images
 */

/**
 * Convert flag emoji to Unicode codepoints
 */
export function emojiToUnicode(emoji: string): string {
    return Array.from(emoji)
        .map((char) => char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0'))
        .filter(Boolean)
        .join('-');
}

/**
 * Convert ISO2 code to flag emoji
 */
export function isoToFlagEmoji(iso2: string): string {
    const codePoints = iso2
        .toUpperCase()
        .split('')
        .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

/**
 * Generate SVG flag with custom dimensions
 */
export function resizeFlagSvg(svgContent: string, width: number, height: number): string {
    // Extract viewBox if present, otherwise use original dimensions
    const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
    const widthMatch = svgContent.match(/width="([^"]+)"/);
    const heightMatch = svgContent.match(/height="([^"]+)"/);

    let viewBox: string;
    if (viewBoxMatch) {
        viewBox = viewBoxMatch[1];
    } else if (widthMatch && heightMatch) {
        viewBox = `0 0 ${widthMatch[1]} ${heightMatch[1]}`;
    } else {
        // Default viewBox for flag aspect ratio (4:3)
        viewBox = '0 0 640 480';
    }

    // Replace the SVG opening tag with new dimensions
    const newSvg = svgContent.replace(
        /<svg[^>]*>/,
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${width}" height="${height}">`,
    );

    return newSvg;
}

/**
 * Generate SVG flag maintaining aspect ratio
 */
export function resizeFlagSvgMaintainRatio(
    svgContent: string,
    maxWidth: number,
    maxHeight: number,
): string {
    const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
    const widthMatch = svgContent.match(/width="([^"]+)"/);
    const heightMatch = svgContent.match(/height="([^"]+)"/);

    let originalWidth = 640;
    let originalHeight = 480;

    if (viewBoxMatch) {
        const parts = viewBoxMatch[1].split(' ');
        originalWidth = parseFloat(parts[2]);
        originalHeight = parseFloat(parts[3]);
    } else if (widthMatch && heightMatch) {
        originalWidth = parseFloat(widthMatch[1]);
        originalHeight = parseFloat(heightMatch[1]);
    }

    // Calculate aspect ratio
    const aspectRatio = originalWidth / originalHeight;
    let newWidth = maxWidth;
    let newHeight = maxWidth / aspectRatio;

    if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = maxHeight * aspectRatio;
    }

    return resizeFlagSvg(svgContent, Math.round(newWidth), Math.round(newHeight));
}

/**
 * Convert SVG to data URL for use in img src
 */
export function svgToDataUrl(svgContent: string): string {
    const encoded = encodeURIComponent(svgContent).replace(/'/g, '%27').replace(/"/g, '%22');
    return `data:image/svg+xml,${encoded}`;
}

/**
 * Convert SVG to base64 data URL
 */
export function svgToBase64DataUrl(svgContent: string): string {
    if (typeof Buffer !== 'undefined') {
        // Node.js environment
        return `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;
    } else if (typeof btoa !== 'undefined') {
        // Browser environment
        return `data:image/svg+xml;base64,${btoa(svgContent)}`;
    } else {
        // Fallback to URL encoding
        return svgToDataUrl(svgContent);
    }
}

/**
 * Generate flag image HTML tag with custom size
 */
export function generateFlagImgTag(
    svgContent: string,
    options: {
        width?: number;
        height?: number;
        alt?: string;
        className?: string;
        maintainRatio?: boolean;
    } = {},
): string {
    const { width = 64, height = 48, alt = 'Flag', className = '', maintainRatio = true } = options;

    let resizedSvg: string;
    if (maintainRatio) {
        resizedSvg = resizeFlagSvgMaintainRatio(svgContent, width, height);
    } else {
        resizedSvg = resizeFlagSvg(svgContent, width, height);
    }

    const dataUrl = svgToDataUrl(resizedSvg);
    const classAttr = className ? ` class="${className}"` : '';

    return `<img src="${dataUrl}" alt="${alt}" width="${width}" height="${height}"${classAttr} />`;
}

/**
 * Common flag size presets
 */
export const FLAG_SIZES = {
    TINY: { width: 16, height: 12 },
    SMALL: { width: 32, height: 24 },
    MEDIUM: { width: 64, height: 48 },
    LARGE: { width: 128, height: 96 },
    XLARGE: { width: 256, height: 192 },
    ICON: { width: 24, height: 24 }, // Square for icons
    THUMBNAIL: { width: 100, height: 75 },
    BANNER: { width: 800, height: 600 },
} as const;

/**
 * Generate flag with preset size
 */
export function resizeFlagWithPreset(svgContent: string, preset: keyof typeof FLAG_SIZES): string {
    const size = FLAG_SIZES[preset];
    return resizeFlagSvg(svgContent, size.width, size.height);
}

/**
 * Apply CSS filter effects to SVG flag
 */
export function applyFlagFilter(
    svgContent: string,
    filter: {
        grayscale?: number; // 0-100
        brightness?: number; // 0-200
        contrast?: number; // 0-200
        opacity?: number; // 0-1
        blur?: number; // pixels
    },
): string {
    const filters: string[] = [];

    if (filter.grayscale !== undefined) {
        filters.push(`grayscale(${filter.grayscale}%)`);
    }
    if (filter.brightness !== undefined) {
        filters.push(`brightness(${filter.brightness}%)`);
    }
    if (filter.contrast !== undefined) {
        filters.push(`contrast(${filter.contrast}%)`);
    }
    if (filter.opacity !== undefined) {
        filters.push(`opacity(${filter.opacity})`);
    }
    if (filter.blur !== undefined) {
        filters.push(`blur(${filter.blur}px)`);
    }

    if (filters.length === 0) {
        return svgContent;
    }

    const filterStyle = `filter: ${filters.join(' ')};`;
    return svgContent.replace(/<svg/, `<svg style="${filterStyle}"`);
}

/**
 * Convert flag to circular/rounded shape
 */
export function applyFlagShape(
    svgContent: string,
    shape: 'circle' | 'rounded' | 'square',
    size: number = 64,
): string {
    let clipPath: string;

    switch (shape) {
        case 'circle':
            clipPath = `<clipPath id="circle-clip"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" /></clipPath>`;
            break;
        case 'rounded': {
            const radius = size * 0.1; // 10% border radius
            clipPath = `<clipPath id="rounded-clip"><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" /></clipPath>`;
            break;
        }
        default:
            clipPath = '';
    }

    if (clipPath) {
        // Wrap the content in a group with clip-path
        const content = svgContent
            .replace(/<svg[^>]*>/, '')
            .replace(/<\/svg>/, '')
            .trim();
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
            <defs>${clipPath}</defs>
            <g clip-path="url(#${shape}-clip)" transform="scale(${size / 640} ${size / 480})">
                ${content}
            </g>
        </svg>`;
    }

    return resizeFlagSvg(svgContent, size, size);
}
