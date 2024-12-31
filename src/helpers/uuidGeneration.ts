import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a UUID in the format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.
 * @returns {string} A UUID string.
 */
export function generateUUID(): string {
    return uuidv4();
}