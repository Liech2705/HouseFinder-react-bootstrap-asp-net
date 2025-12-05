// Simple URL-safe encoding/decoding utility
// This encodes IDs into a format that's not easily guessable

const SECRET_KEY = 'HouseFinder2025'; // Change this to your own secret

/**
 * Encode houseId and roomId into a single encrypted token
 * @param {number|string} houseId
 * @param {number|string} roomId
 * @returns {string} Encoded token
 */
export const encodeBookingParams = (houseId, roomId) => {
    const data = `${houseId}|${roomId}`;

    // Simple XOR + Base64 encoding
    let encoded = '';
    for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
        encoded += String.fromCharCode(charCode);
    }

    // Convert to Base64 for URL safety
    return btoa(encoded).replace(/[+/=]/g, match => ({
        '+': '-',
        '/': '_',
        '=': '.'
    }[match]));
};

/**
 * Decode the encrypted token back to houseId and roomId
 * @param {string} token Encoded token from URL
 * @returns {{houseId: string, roomId: string} | null} Decoded IDs or null if invalid
 */
export const decodeBookingParams = (token) => {
    try {
        // Reverse URL-safe Base64
        const base64 = token.replace(/[-_.]/g, match => ({
            '-': '+',
            '_': '/',
            '.': '='
        }[match]));

        const encoded = atob(base64);

        // XOR decode
        let decoded = '';
        for (let i = 0; i < encoded.length; i++) {
            const charCode = encoded.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
            decoded += String.fromCharCode(charCode);
        }

        const [houseId, roomId] = decoded.split('|');

        if (!houseId || !roomId) return null;

        return { houseId, roomId };
    } catch (err) {
        console.error('Decoding error:', err);
        return null;
    }
};
