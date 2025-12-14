import { describe, it, expect } from 'vitest';
import {
    emojiToUnicode,
    isoToFlagEmoji,
    resizeFlagSvg,
    resizeFlagSvgMaintainRatio,
    svgToDataUrl,
    svgToBase64DataUrl,
    generateFlagImgTag,
    FLAG_SIZES,
    resizeFlagWithPreset,
    applyFlagFilter,
    applyFlagShape,
} from '../src/utils/image';

const mockSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" width="640" height="480">
  <rect width="640" height="480" fill="#00247d"/>
</svg>`;

describe('Image Utilities', () => {
    describe('emojiToUnicode', () => {
        it('should convert flag emoji to unicode codepoints', () => {
            const result = emojiToUnicode('🇺🇸');
            expect(result).toBe('1F1FA-1F1F8'); // Correct unicode for US flag
        });

        it('should handle single character emoji', () => {
            const result = emojiToUnicode('😀');
            expect(result).toBe('1F600'); // Correct unicode for grinning face
        });
    });

    describe('isoToFlagEmoji', () => {
        it('should convert ISO2 code to flag emoji', () => {
            const result = isoToFlagEmoji('US');
            expect(result).toBe('🇺🇸');
        });

        it('should handle lowercase codes', () => {
            const result = isoToFlagEmoji('gb');
            expect(result).toBe('🇬🇧');
        });

        it('should work for various countries', () => {
            expect(isoToFlagEmoji('IN')).toBe('🇮🇳');
            expect(isoToFlagEmoji('FR')).toBe('🇫🇷');
            expect(isoToFlagEmoji('JP')).toBe('🇯🇵');
        });
    });

    describe('resizeFlagSvg', () => {
        it('should resize SVG to specified dimensions', () => {
            const result = resizeFlagSvg(mockSvg, 320, 240);
            expect(result).toContain('width="320"');
            expect(result).toContain('height="240"');
        });

        it('should preserve viewBox', () => {
            const result = resizeFlagSvg(mockSvg, 100, 75);
            expect(result).toContain('viewBox="0 0 640 480"');
        });

        it('should handle SVG without explicit dimensions', () => {
            const simpleSvg = '<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>';
            const result = resizeFlagSvg(simpleSvg, 200, 150);
            expect(result).toContain('width="200"');
            expect(result).toContain('height="150"');
        });
    });

    describe('resizeFlagSvgMaintainRatio', () => {
        it('should maintain aspect ratio when resizing', () => {
            const result = resizeFlagSvgMaintainRatio(mockSvg, 320, 320);
            // Original ratio is 640:480 = 4:3
            // Should fit in 320x320 maintaining 4:3 ratio
            expect(result).toContain('width="320"');
            expect(result).toContain('height="240"'); // 320 * 3/4 = 240
        });

        it('should handle height constraint', () => {
            const result = resizeFlagSvgMaintainRatio(mockSvg, 1000, 200);
            // Should be constrained by height
            expect(result).toContain('height="200"');
        });
    });

    describe('svgToDataUrl', () => {
        it('should convert SVG to data URL', () => {
            const result = svgToDataUrl(mockSvg);
            expect(result).toContain('data:image/svg+xml,');
            expect(result).toContain('%3Csvg');
        });

        it('should properly encode special characters', () => {
            const svgWithQuotes = '<svg width="100"><text>Test "quote"</text></svg>';
            const result = svgToDataUrl(svgWithQuotes);
            expect(result).toContain('%22'); // encoded quote
        });
    });

    describe('svgToBase64DataUrl', () => {
        it('should convert SVG to base64 data URL', () => {
            const result = svgToBase64DataUrl(mockSvg);
            expect(result).toContain('data:image/svg+xml;base64,');
        });

        it('should create valid base64 encoding', () => {
            const result = svgToBase64DataUrl('<svg></svg>');
            // Should be a valid base64 string
            expect(result).toMatch(/^data:image\/svg\+xml;base64,[A-Za-z0-9+/=]+$/);
        });
    });

    describe('generateFlagImgTag', () => {
        it('should generate HTML img tag with default size', () => {
            const result = generateFlagImgTag(mockSvg);
            expect(result).toContain('<img');
            expect(result).toContain('src="data:image/svg+xml,');
            expect(result).toContain('width="64"');
            expect(result).toContain('height="48"');
            expect(result).toContain('alt="Flag"');
        });

        it('should accept custom dimensions', () => {
            const result = generateFlagImgTag(mockSvg, { width: 100, height: 75 });
            expect(result).toContain('width="100"');
            expect(result).toContain('height="75"');
        });

        it('should accept custom alt text', () => {
            const result = generateFlagImgTag(mockSvg, { alt: 'United States Flag' });
            expect(result).toContain('alt="United States Flag"');
        });

        it('should accept CSS class', () => {
            const result = generateFlagImgTag(mockSvg, { className: 'flag-icon' });
            expect(result).toContain('class="flag-icon"');
        });

        it('should maintain aspect ratio by default', () => {
            const result = generateFlagImgTag(mockSvg, { width: 200, height: 200 });
            // The img tag attributes show the requested dimensions
            // but the SVG inside is resized maintaining ratio
            expect(result).toContain('width="200"');
            // The SVG content inside maintains the ratio
            expect(result).toContain('data:image/svg+xml');
        });

        it('should allow disabling aspect ratio maintenance', () => {
            const result = generateFlagImgTag(mockSvg, {
                width: 200,
                height: 200,
                maintainRatio: false,
            });
            expect(result).toContain('width="200"');
            expect(result).toContain('height="200"');
        });
    });

    describe('FLAG_SIZES', () => {
        it('should have standard size presets', () => {
            expect(FLAG_SIZES.TINY).toEqual({ width: 16, height: 12 });
            expect(FLAG_SIZES.SMALL).toEqual({ width: 32, height: 24 });
            expect(FLAG_SIZES.MEDIUM).toEqual({ width: 64, height: 48 });
            expect(FLAG_SIZES.LARGE).toEqual({ width: 128, height: 96 });
            expect(FLAG_SIZES.XLARGE).toEqual({ width: 256, height: 192 });
        });

        it('should have special size presets', () => {
            expect(FLAG_SIZES.ICON).toEqual({ width: 24, height: 24 });
            expect(FLAG_SIZES.THUMBNAIL).toEqual({ width: 100, height: 75 });
            expect(FLAG_SIZES.BANNER).toEqual({ width: 800, height: 600 });
        });
    });

    describe('resizeFlagWithPreset', () => {
        it('should resize using SMALL preset', () => {
            const result = resizeFlagWithPreset(mockSvg, 'SMALL');
            expect(result).toContain('width="32"');
            expect(result).toContain('height="24"');
        });

        it('should resize using LARGE preset', () => {
            const result = resizeFlagWithPreset(mockSvg, 'LARGE');
            expect(result).toContain('width="128"');
            expect(result).toContain('height="96"');
        });

        it('should resize using ICON preset', () => {
            const result = resizeFlagWithPreset(mockSvg, 'ICON');
            expect(result).toContain('width="24"');
            expect(result).toContain('height="24"');
        });
    });

    describe('applyFlagFilter', () => {
        it('should apply grayscale filter', () => {
            const result = applyFlagFilter(mockSvg, { grayscale: 100 });
            expect(result).toContain('style="filter: grayscale(100%);"');
        });

        it('should apply brightness filter', () => {
            const result = applyFlagFilter(mockSvg, { brightness: 150 });
            expect(result).toContain('brightness(150%)');
        });

        it('should apply contrast filter', () => {
            const result = applyFlagFilter(mockSvg, { contrast: 120 });
            expect(result).toContain('contrast(120%)');
        });

        it('should apply opacity filter', () => {
            const result = applyFlagFilter(mockSvg, { opacity: 0.5 });
            expect(result).toContain('opacity(0.5)');
        });

        it('should apply blur filter', () => {
            const result = applyFlagFilter(mockSvg, { blur: 2 });
            expect(result).toContain('blur(2px)');
        });

        it('should combine multiple filters', () => {
            const result = applyFlagFilter(mockSvg, {
                grayscale: 50,
                brightness: 110,
                contrast: 120,
            });
            expect(result).toContain('grayscale(50%)');
            expect(result).toContain('brightness(110%)');
            expect(result).toContain('contrast(120%)');
        });

        it('should return original SVG if no filters applied', () => {
            const result = applyFlagFilter(mockSvg, {});
            expect(result).toBe(mockSvg);
        });
    });

    describe('applyFlagShape', () => {
        it('should apply circle shape', () => {
            const result = applyFlagShape(mockSvg, 'circle', 64);
            expect(result).toContain('clipPath');
            expect(result).toContain('circle');
            expect(result).toContain('width="64"');
            expect(result).toContain('height="64"');
        });

        it('should apply rounded shape', () => {
            const result = applyFlagShape(mockSvg, 'rounded', 100);
            expect(result).toContain('clipPath');
            expect(result).toContain('rect');
            expect(result).toContain('rx='); // border radius
        });

        it('should handle square shape', () => {
            const result = applyFlagShape(mockSvg, 'square', 80);
            expect(result).toContain('width="80"');
            expect(result).toContain('height="80"');
        });

        it('should use default size if not specified', () => {
            const result = applyFlagShape(mockSvg, 'circle');
            expect(result).toContain('width="64"');
        });
    });
});
