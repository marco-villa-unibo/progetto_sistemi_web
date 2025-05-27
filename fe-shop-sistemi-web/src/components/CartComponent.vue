<template>
  <div class="cart-wrapper">
    <div class="cart-card" style="overflow: auto;">
        <div style="display: flex; justify-content: center; align-items: center;">
            <h2 style="color: black;">🛒 Carrello</h2>
        </div>

      <div v-if="loading">Caricamento carrello...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="items.length === 0">Il carrello è vuoto.</div>

      <ul v-else class="cart-list">
        <li v-for="item in items" :key="item.id" class="cart-item">
          <img v-if="item.product?.imageUrl" :src="item.product.imageUrl" alt="Immagine prodotto" class="product-image" />
          <div class="product-info">
            <h4>{{ item.product?.title || 'Prodotto sconosciuto' }}</h4>
            <p>📝 {{ item.product?.pDescription }}</p>
            <p>💶 Prezzo: €{{ item.product?.price }}</p>
            <p>📦 Quantità: {{ item.quantity }}</p>
          
            <div class="cart-actions">
              <button @click="increaseQuantity(item)">➕</button>
              <button @click="decreaseQuantity(item)">➖</button>
              <button @click="removeItem(item)">❌</button>
            </div>
          </div>
        </li>
      </ul>
      <div v-if="items.length > 0" class="cart-total">
        <h3>Totale: €{{ totalPrice.toFixed(2) }}</h3>
      </div>
      <button class="primary" @click="showForm = true" v-if="items.length > 0">🧾 Procedi al Checkout</button>
    </div>

    <div v-if="showForm" class="form-card">
      <h3>Checkout</h3>
      <form @submit.prevent="submitOrder">
        <input v-model="shipping.name" placeholder="Nome completo" required />
        <input v-model="shipping.address" placeholder="Indirizzo" required />
        <input v-model="shipping.city" placeholder="Città" required />
        <input v-model="shipping.postalCode" placeholder="CAP" required />
        <input placeholder="Indirizzo di spedizione" required />
        <input placeholder="Indirizzo di fatturazione" required />

        <select v-model="paymentMethod" required>
          <option value="" disabled>Metodo di pagamento</option>
          <option value="card">Carta di credito</option>
          <option value="paypal">PayPal</option>
        </select>

        <div class="form-buttons">
          <button type="submit" class="primary" :disabled="submitting">
            {{ submitting ? 'Elaborazione...' : 'Conferma ordine' }}
          </button>
          <button type="button" class="secondary" @click="showForm = false">Annulla</button>
        </div>
      </form>

      <div v-if="successMessage" class="success">{{ successMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { getToken } from "../utils/auth"
import { computed } from 'vue'

const totalPrice = computed(() => {
  return items.value.reduce((acc, item) => {
    const price = item.product?.price || 0
    const quantity = item.quantity || 0
    return acc + price * quantity
  }, 0)
})

const showForm = ref(false)


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

const increaseQuantity = async (item: CartItem) => {
  try {
    const response = await axios.put(`/api/v1/cart/items/${item.id}`, {
      quantity: item.quantity + 1
    })
    item.quantity += 1
  } catch (error) {
    console.error('Errore nell\'aumentare la quantità:', error)
  }
}

const decreaseQuantity = async (item: CartItem) => {
  if (item.quantity <= 1) {
    await removeItem(item)
    return
  }

  try {
    const response = await axios.put(`/api/v1/cart/items/${item.id}`, {
      quantity: item.quantity - 1
    })
    item.quantity -= 1
  } catch (error) {
    console.error('Errore nel diminuire la quantità:', error)
  }
}

const removeItem = async (item: CartItem) => {
  try {
    await axios.delete(`/api/v1/cart/items/${item.id}`)
    items.value = items.value.filter(i => i.id !== item.id)
  } catch (error) {
    console.error('Errore nella rimozione del prodotto:', error)
  }
}

const fetchCart = async () => {
  loading.value = true
  try {
    const token = getToken()
    if (!token) throw new Error('Token mancante.')

    const response = await axios.get('/api/v1/cart', {
      headers: { Authorization: `Bearer ${token}` }
    })

    let cartItems = response.data?.cartItems || []

    for (const item of cartItems) {
      if (!item.product || item.product.quantity === 0) {
        await axios.delete(`/api/v1/cart/items/${item.id}`)
      }
    }

    items.value = cartItems.filter((item: CartItem) => item.product && item.product.quantity > 0)

    items.value.forEach(item => {
      if (item.product) {
        const rawPath = item.product.imageUrl
        const cleanPath = rawPath.replace(/^public[\\/]+/, '').replace(/\\/g, '/')
        item.product.imageUrl = `http://localhost:8080/${cleanPath}`
      }
    })

  } catch (e) {
    console.error('Errore durante il recupero del carrello:', e)
    error.value = 'Impossibile caricare il carrello.'
    items.value = []
  } finally {
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
        paymentMethod: paymentMethod.value
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
:root {
  --green: #5cb85c;
  --green-dark: #3d8b3d;
  --orange: #ffa726;
  --light-bg: #fefcf6;
  --white: #ffffff;
  --text-dark: #333;
  --border-radius: 1rem;
  --transition: all 0.3s ease;
}

.cart-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.cart-actions button {
  padding: 0.4rem 0.7rem;
  border-radius: 0.4rem;
  border: none;
  background-color: #e0e0e0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.cart-actions button:hover {
  background-color: #d5d5d5;
}

.cart-items {
  background: var(--light-bg);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin: 1rem auto;
  max-width: 600px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
  font-family: 'Segoe UI', sans-serif;
  color: var(--text-dark);
}

h3 {
  color: var(--green-dark);
  margin-bottom: 1rem;
}

.cart-item {
  display: flex;
  flex-direction: column;
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  margin-bottom: 1.2rem;
  overflow: hidden;
  transition: var(--transition);
}

.cart-item:hover {
  transform: scale(1.01);
}

.product-image {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-bottom: 1px solid #eee;
  background: #f8f8f8;
}

.product-info {
  padding: 1rem;
}

.cart-total {
  text-align: right;
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 1rem;
  color: #2e7d32;
}

.product-info h4 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}

.checkout-form {
  margin-top: 2rem;
  background-color: var(--white);
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.checkout-form input,
.checkout-form select {
  width: 100%;
  padding: 0.7rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.6rem;
  font-size: 1rem;
  transition: var(--transition);
}

.checkout-form input:focus,
.checkout-form select:focus {
  outline: none;
  border-color: var(--green);
  box-shadow: 0 0 5px rgba(92, 184, 92, 0.4);
}

.checkout-form button {
  background-color: var(--green);
  color: var(--white);
  font-weight: bold;
  border: none;
  border-radius: 0.6rem;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  transition: var(--transition);
  width: 100%;
}

.checkout-form button:hover {
  background-color: var(--green-dark);
}

.success {
  background: #e6f7e6;
  color: var(--green-dark);
  padding: 1rem;
  border-radius: 0.6rem;
  margin-top: 1rem;
  text-align: center;
  font-weight: bold;
}

.error {
  background: #ffe6e6;
  color: #c00;
  padding: 1rem;
  border-radius: 0.6rem;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .cart-item {
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }

  .product-image {
    width: 120px;
    height: 120px;
  }

  .product-info {
    flex: 1;
  }
  .cart-card {
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 128, 0, 0.15);
    padding: 2rem;
    width: 50%;
  }

  .form-card{
    width: 40%;
  }
}

@media (max-width: 768px) {
  .cart-card {
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 128, 0, 0.15);
    padding: 2rem;
    width: 100%;
  }

  .form-card{
    width: 90%;
  }
}


.cart-wrapper {
  display: flex;
  justify-content: center;
  padding: 2rem;
  position: relative;
  font-family: 'Segoe UI', sans-serif;
  width: 100%;
    height: 100%;
}


.cart-list {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.cart-item {
  display: flex;
  background-color: #f9f9f9;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
  gap: 1rem;
  align-items: center;
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: 0.5rem;
  background-color: #f0f0f0;
}

.product-info {
  flex: 1;
  font-size: 0.95rem;
  color: #333;
}

input,
select {
  width: 100%;
  padding: 0.7rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.6rem;
}

button {
  border: none;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border-radius: 0.6rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

button.primary {
  background-color: #4caf50;
  color: white;
}

button.primary:hover {
  background-color: #388e3c;
}

button.secondary {
  background-color: #e0e0e0;
  color: #333;
}

button.secondary:hover {
  background-color: #bdbdbd;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.form-card {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  z-index: 10;
}

.success {
  background-color: #e6f7e6;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 0.6rem;
  margin-top: 1rem;
  text-align: center;
  font-weight: bold;
}

.error {
  background-color: #ffe6e6;
  color: #c00;
  padding: 1rem;
  border-radius: 0.6rem;
  margin-top: 1rem;
}
.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>
