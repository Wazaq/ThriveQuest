// src/lib/jwt.ts
// Cloudflare Workers-compatible JWT signing and verification using Web Crypto API

interface JWTPayload {
	userId: number;
	email: string;
	exp?: number;
}

function base64UrlEncode(data: Uint8Array): string {
	const base64 = btoa(String.fromCharCode(...data));
	return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlDecode(str: string): Uint8Array {
	str = str.replace(/-/g, '+').replace(/_/g, '/');
	while (str.length % 4) {
		str += '=';
	}
	return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

async function importKey(secret: string): Promise<CryptoKey> {
	const encoder = new TextEncoder();
	const keyData = encoder.encode(secret);

	return await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, [
		'sign',
		'verify'
	]);
}

export async function signJWT(
	payload: Omit<JWTPayload, 'exp'>,
	secret: string,
	expiresIn: string = '7d'
): Promise<string> {
	// Parse expiresIn (supports '7d', '1h', etc.)
	const match = expiresIn.match(/^(\d+)([dhm])$/);
	if (!match) throw new Error('Invalid expiresIn format');

	const [, amount, unit] = match;
	const multipliers = { d: 86400, h: 3600, m: 60 };
	const expirationSeconds = parseInt(amount) * multipliers[unit as keyof typeof multipliers];

	const now = Math.floor(Date.now() / 1000);
	const fullPayload: JWTPayload = {
		...payload,
		exp: now + expirationSeconds
	};

	// Create header
	const header = { alg: 'HS256', typ: 'JWT' };
	const encoder = new TextEncoder();

	// Encode header and payload
	const encodedHeader = base64UrlEncode(encoder.encode(JSON.stringify(header)));
	const encodedPayload = base64UrlEncode(encoder.encode(JSON.stringify(fullPayload)));

	// Create signature
	const key = await importKey(secret);
	const dataToSign = `${encodedHeader}.${encodedPayload}`;
	const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(dataToSign));

	const encodedSignature = base64UrlEncode(new Uint8Array(signature));

	return `${dataToSign}.${encodedSignature}`;
}

export async function verifyJWT(token: string, secret: string): Promise<JWTPayload | null> {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) return null;

		const [encodedHeader, encodedPayload, encodedSignature] = parts;

		// Verify signature
		const key = await importKey(secret);
		const encoder = new TextEncoder();
		const dataToVerify = `${encodedHeader}.${encodedPayload}`;

		const signature = base64UrlDecode(encodedSignature);
		const isValid = await crypto.subtle.verify(
			'HMAC',
			key,
			signature,
			encoder.encode(dataToVerify)
		);

		if (!isValid) return null;

		// Decode and check expiration
		const payloadStr = new TextDecoder().decode(base64UrlDecode(encodedPayload));
		const payload: JWTPayload = JSON.parse(payloadStr);

		const now = Math.floor(Date.now() / 1000);
		if (payload.exp && payload.exp < now) {
			return null; // Token expired
		}

		return payload;
	} catch (error) {
		return null;
	}
}
