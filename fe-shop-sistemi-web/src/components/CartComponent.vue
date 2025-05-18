<template>
  <div class="cart-items">
    <h3>🛒 Carrello</h3>

    <div v-if="loading">Caricamento carrello...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="items.length === 0">Il carrello è vuoto.</div>

    <ul v-else>
      <li v-for="item in items" :key="item.id" class="cart-item">
        <img
          v-if="item.product?.imageUrl"
          :src="item.product.imageUrl"
          alt="immagine prodotto"
          class="product-image"
        />
        <div class="product-info">
          <h4>{{ item.product?.title || 'Prodotto sconosciuto' }}</h4>
          <p>📝 {{ item.product?.pDescription }}</p>
          <p>💶 Prezzo: €{{ item.product?.price }}</p>
          <p>📦 Quantità nel carrello: {{ item.quantity }}</p>
        </div>
      </li>
    </ul>

    <form @submit.prevent="submitOrder" class="checkout-form">
      <h3>Dati di spedizione</h3>
      <input v-model="shipping.name" placeholder="Nome completo" required />
      <input v-model="shipping.address" placeholder="Indirizzo" required />
      <input v-model="shipping.city" placeholder="Città" required />
      <input v-model="shipping.postalCode" placeholder="CAP" required />
      <input  placeholder="Indirizzo di spedizione" required />
      <input  placeholder="Indirizzo di fatturazione" required />

      <h3>Metodo di pagamento (fittizio)</h3>
      <select v-model="paymentMethod" required>
        <option value="" disabled>Seleziona metodo</option>
        <option value="card">Carta di credito</option>
        <option value="paypal">PayPal</option>
      </select>

      <button type="submit" :disabled="submitting">
        {{ submitting ? 'Elaborazione...' : 'Conferma ordine' }}
      </button>
    </form>

    <div v-if="successMessage" class="success">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { getToken } from '@/generated-sources/shop/apis/AuthApi'

interface Product {
  id: number
  title: string
  pDescription: string
  category: string
  price: number
  quantity: number
  imageUrl: string
}

interface CartItem {
  id: number
  CartId: number
  ProductId: number
  quantity: number
  product?: Product
}

const items = ref<CartItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchCart = async () => {
  loading.value = true
  try {
    const token = getToken()
    if (!token) throw new Error('Token mancante.')

    const response = await axios.get('/api/v1/cart', {
      headers: { Authorization: `Bearer ${token}` }
    })

    const cartItems = response.data?.cartItems
    if (Array.isArray(cartItems)) {
      items.value = cartItems
    } else {
      items.value = []
    }
  } catch (e) {
    console.error('Errore durante il recupero del carrello:', e)
    error.value = 'Impossibile caricare il carrello.'
    items.value = []
  } finally {
    items.value.forEach(item => {
      if (item.product) {
         const rawPath = item.product.imageUrl

      const cleanPath = rawPath.replace(/^public[\\/]+/, '').replace(/\\/g, '/')

      item.product.imageUrl = `http://localhost:8080/${cleanPath}`
}
    })
    loading.value = false
  }
}
const shipping = ref({
  name: '',
  address: '',
  city: '',
  postalCode: ''
})

const paymentMethod = ref('')
const submitting = ref(false)
const successMessage = ref('')
const loadingUser = ref(false)
const userError = ref<string | null>(null)

const getUserIdFromToken = (): number | null => {
  const token = getToken()
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.userId || null
  } catch {
    return null
  }
}

interface UserData {
  username: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  id: number
  token: string
}

const fetchUserData = async (userId: number) => {
  loadingUser.value = true
  userError.value = null
  try {
    const token = getToken()
    if (!token) throw new Error('Token mancante.')
    
    const response = await axios.get(`/api/v1/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const user: UserData = response.data

    shipping.value.name = `${user.firstName} ${user.lastName}`
    
    if (user.address) {
      const splitAddr = user.address.split(' - ')
      shipping.value.address = splitAddr[0] || ''
      shipping.value.city = splitAddr[1] || ''
    }


  } catch (e) {
    userError.value = 'Impossibile caricare i dati utente.'
    console.error(e)
  } finally {
    loadingUser.value = false
  }
}

const access_token = getToken()
axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

const submitOrder = async () => {
  submitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      const response = await axios.post('/api/v1/order', {
        shippingAddress: "string",
        billingAddress: "string",
        paymentMethod: "string"
      })
      console.log("Ordine confermato:", response.data)
    } catch (error) {
      console.error("Errore nell'elaborazione dell'ordine:", error)
    }
    successMessage.value = 'Ordine effettuato con successo! 🎉'
    items.value = []
    await axios.delete('/api/v1/cart')
  } catch (err) {
    console.error('Errore nel checkout:', err)
  } finally {
    submitting.value = false
  }
}


onMounted(() => {
    const userId = getUserIdFromToken()
    if (userId) {
        fetchUserData(userId) 
        console.log(userId)
    } else {
        userError.value = 'ID utente non trovato nel token.'
        console.log("userId non trovato")
    }
    fetchCart()
})
</script>

<style scoped>
.cart-items {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: 600px;
  margin: 2rem auto;
  background: #f9f9f9;
  overflow: auto;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border: 1px solid #eee;
  border-radius: 6px;
}

.product-info {
  flex: 1;
}

.error {
  color: red;
  font-weight: bold;
}

.checkout {
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
}

.cart-list {
  padding: 0;
  list-style: none;
  margin-bottom: 1rem;
}

.checkout-form input,
.checkout-form select {
  display: block;
  width: 100%;
  margin-bottom: 0.8rem;
  padding: 0.5rem;
  font-size: 1rem;
}

.checkout-form button {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  background-color: green;
  color: white;
  border: none;
  cursor: pointer;
}

.success {
  margin-top: 1rem;
  color: green;
  font-weight: bold;
}

.error {
  color: red;
  margin-bottom: 1rem;
}
</style>
