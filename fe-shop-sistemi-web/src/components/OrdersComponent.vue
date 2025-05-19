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
  <div class="orders-wrapper">
    <h2 class="orders-title">📦 Lista Ordini</h2>

    <div class="search-bar">
      <input
        v-model="searchUserId"
        placeholder="🔍 Cerca per User ID"
        class="search-input"
      />
    </div>

    <div class="table-wrapper">
      <table class="orders-table">
        <thead>
          <tr>
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
            <td>
              <span :class="['badge', order.orderStatus.toLowerCase()]">
                {{ order.orderStatus }}
              </span>
            </td>
            <td>{{ order.paymentMethod }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="filteredOrders.length === 0" class="no-orders">
      Nessun ordine trovato.
    </div>
  </div>
</template>

<style scoped>
:root {
  --bg: #ffffff;
  --text: #1e1e1e;
  --border: #dddddd;
  --accent: #4caf50;
  --danger: #e53935;
  --warning: #ffb300;
  --info: #2196f3;
  --input-bg: #f5f5f5;
}

[data-theme="dark"] {
  --bg: #1e1e1e;
  --text: #f5f5f5;
  --border: #333333;
  --input-bg: #2a2a2a;
}

.orders-wrapper {
  padding: 2rem;
  background-color: var(--bg);
  color: var(--text);
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  transition: background-color 0.3s ease;
}

.orders-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.search-bar {
  margin-bottom: 1rem;
}

.search-input {
  padding: 0.6rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background-color: var(--input-bg);
  color: var(--text);
  width: 250px;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease-in-out;
}

.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.table-wrapper {
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.orders-table th,
.orders-table td {
  padding: 1rem;
  border: 1px solid var(--border);
  text-align: left;
  font-size: 0.95rem;
}

.orders-table thead {
  background-color: var(--input-bg);
}

.orders-table tbody tr:hover {
  background-color: rgba(76, 175, 80, 0.05);
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
}

.badge.pending {
  background-color: var(--warning);
  color: white;
}

.badge.completed {
  background-color: var(--accent);
  color: white;
}

.badge.cancelled {
  background-color: var(--danger);
  color: white;
}

.no-orders {
  margin-top: 2rem;
  font-style: italic;
  opacity: 0.7;
}
</style>