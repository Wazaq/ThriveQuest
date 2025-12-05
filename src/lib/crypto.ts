// src/lib/crypto.ts
// Cloudflare Workers-compatible password hashing using Web Crypto API

export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Generate random salt
    const salt = crypto.getRandomValues(new Uint8Array(16));

    // Use PBKDF2 for password hashing (similar security to bcrypt)
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        data,
        'PBKDF2',
        false,
        ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );

    // Combine salt + hash for storage
    const hashArray = new Uint8Array(derivedBits);
    const combined = new Uint8Array(salt.length + hashArray.length);
    combined.set(salt);
    combined.set(hashArray, salt.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);

        // Decode stored hash
        const combined = Uint8Array.from(atob(hashedPassword), c => c.charCodeAt(0));

        // Extract salt (first 16 bytes)
        const salt = combined.slice(0, 16);
        const storedHash = combined.slice(16);

        // Hash the provided password with the stored salt
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            data,
            'PBKDF2',
            false,
            ['deriveBits']
        );

        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            256
        );

        const newHash = new Uint8Array(derivedBits);

        // Compare hashes
        if (newHash.length !== storedHash.length) return false;

        let match = true;
        for (let i = 0; i < newHash.length; i++) {
            if (newHash[i] !== storedHash[i]) match = false;
        }

        return match;
    } catch (error) {
        return false;
    }
}
