/**
 * Recupera il token JWT dal local storage.
 * @returns Il token JWT, o null se non trovato.
 */
export function getToken(): string | null {
  const token = localStorage.getItem('token')
  return token || null
}

/**
 * Verifica se il token JWT è presente.
 * @returns True se il token è presente, false altrimenti.
 */
export function hasToken(): boolean {
  return getToken() !== null
}

/**
 * Rimuove il token JWT dal local storage.
 * @returns void
 */
export function removeToken(): void {
  localStorage.removeItem('token')
}



export function setToken(token: string) {
    localStorage.setItem('token', token)
  }
