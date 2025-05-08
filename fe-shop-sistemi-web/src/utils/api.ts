import { getToken, removeToken } from './auth'
import { useRouter } from 'vue-router'

/**
 * Funzione wrapper per la Fetch API che aggiunge automaticamente l'header di autorizzazione.
 * @param url L'URL della risorsa da recuperare.
 * @param options Opzioni aggiuntive da passare a fetch().
 * @returns Una Promise che si risolve con i dati JSON della risposta.
 * @throws Un errore se la richiesta fallisce (status non OK).
 */
async function fetchData<T = any>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...options.headers,
  })

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const requestOptions: RequestInit = {
    ...options,
    headers,
  }

  const response = await fetch(url, requestOptions)

  if (!response.ok) {
    if (response.status === 401) {
      // Token scaduto o non valido: esegui il logout e reindirizza al login
      console.error('Token scaduto o non valido: Reindirizzamento al login')
      const router = useRouter()
      removeToken() // Rimuovi il token
      router.push('/login')
    }
    throw new Error(`Errore HTTP: ${response.status} - ${await response.text()}`)
  }

  try {
    const data: T = await response.json()
    return data
  } catch (error) {
    // Gestisci errori di parsing JSON
    console.error("Errore durante l'analisi della risposta JSON:", error)
    throw new Error('Risposta del server non è un JSON valido')
  }
}

export default fetchData
