import bcrypt from 'bcrypt';

export function createEnumObjectFromType<T extends string>(o: { [P in T]: P }) {
  return o;
}

export function sanitizeFilename(filename: string): string {
  // Rimuovi caratteri speciali e spazi multipli
  const sanitized = filename
    .replace(/[^a-zA-Z0-9\s.-]/g, '')
    .replace(/\s+/g, ' ');

  // Sostituisci gli spazi con underscore
  const underscored = sanitized.replace(/ /g, '_');

  return underscored;
}

export async function passwordHasher(password: string): Promise<string> {
  const SALT_ROUNDS = 10;

  return await bcrypt.hash(password, SALT_ROUNDS);
}
