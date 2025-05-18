<template>
  <div class="checkout">
    <h2>Checkout</h2>

    <div v-if="items.length === 0">Il carrello è vuoto.</div>

    <ul v-else class="cart-list">
      <li v-for="item in items" :key="item.id">
        <strong>{{ item.product?.title || 'Prodotto ID: ' + item.ProductId }}</strong><br />
        Quantità: {{ item.quantity }}<br />
        Prezzo: €{{ item.product?.price || 'n.d.' }}
      </li>
    </ul>

    <form @submit.prevent="submitOrder" class="checkout-form">
      <h3>Dati di spedizione</h3>
      <input v-model="shipping.name" placeholder="Nome completo" required />
      <input v-model="shipping.address" placeholder="Indirizzo" required />
      <input v-model="shipping.city" placeholder="Città" required />
      <input v-model="shipping.postalCode" placeholder="CAP" required />

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
import { ref } from 'vue'
import { getToken } from '@/generated-sources/shop/apis/AuthApi'
import axios from 'axios'

interface CartItem {
  id: number
  CartId: number
  ProductId: number
  quantity: number
  product?: {
    title: string
    price: number
  }
}

const items = ref<CartItem[]>([])
const shipping = ref({
  name: '',
  address: '',
  city: '',
  postalCode: ''
})

const paymentMethod = ref('')
const submitting = ref(false)
const successMessage = ref('')

const fetchCart = async () => {
  const token = getToken()
  if (!token) return
  const res = await axios.get('/api/v1/cart', {
    headers: { Authorization: `Bearer ${token}` }
  })
  items.value = res.data?.cartItems || []
}
fetchCart()

const submitOrder = async () => {
  submitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    successMessage.value = 'Ordine effettuato con successo! 🎉'
    items.value = []
  } catch (err) {
    console.error('Errore nel checkout:', err)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
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
</style>