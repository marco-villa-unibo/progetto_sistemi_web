<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'


import { getToken } from "../utils/auth"


const orders = ref<any[]>([])
const searchUserId = ref('')

const access_token = getToken()
axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`


async function fetchOrders() {
  try {
    const response = await axios.get('/api/v1/order')
    orders.value = response.data
  } catch (error) {
    console.error('Errore durante il recupero degli ordini:', error)
  }
}


const filteredOrders = computed(() => {
  return orders.value
    .filter(order => searchUserId.value === '' || order.UserId.toString().includes(searchUserId.value))
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
})

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div style="padding: 20px;">
    <h2>📦 Lista Ordini</h2>
    <input
      v-model="searchUserId"
      placeholder="Cerca per User ID"
      style="padding: 8px; margin-bottom: 20px; width: 200px;"
    />

    <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f0f0f0;">
          <th>ID Ordine</th>
          <th>User ID</th>
          <th>Data Ordine</th>
          <th>Importo Totale</th>
          <th>Stato</th>
          <th>Pagamento</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in filteredOrders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.UserId }}</td>
          <td>{{ new Date(order.orderDate).toLocaleString() }}</td>
          <td>{{ order.totalAmount }}€</td>
          <td>{{ order.orderStatus }}</td>
          <td>{{ order.paymentMethod }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="filteredOrders.length === 0" style="margin-top: 20px;">Nessun ordine trovato.</div>
  </div>
</template>
