<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { getToken } from "../utils/auth"

const orders = ref<any[]>([])
const searchOrderId = ref('')

const editedStatuses = ref<Record<number, string>>({})
const originalStatuses = ref<Record<number, string>>({})
const showActions = ref<Record<number, boolean>>({})

function startEdit(orderId: number, currentStatus: string) {
  originalStatuses.value[orderId] = currentStatus
  currentStatus= editedStatuses.value[orderId]
  showActions.value[orderId] = true
}

function cancelEdit(orderId: number) {
  editedStatuses.value[orderId] = originalStatuses.value[orderId]
  showActions.value[orderId] = false
}

async function saveStatus(orderId: number) {
  const newStatus = editedStatuses.value[orderId]
  try {
    await axios.patch(`/api/v1/order/${orderId}/status`, { orderStatus: newStatus })
    const order = orders.value.find(o => o.id === orderId)
    if (order) order.orderStatus = newStatus
    showActions.value[orderId] = false
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dello stato:', error)
  }
}

const access_token = getToken()
axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

async function fetchOrders() {
  try {
    const response = await axios.get('/api/v1/order/all')
    orders.value = response.data

    orders.value.forEach(order => {
      editedStatuses.value[order.id] = order.orderStatus
      originalStatuses.value[order.id] = order.orderStatus
      showActions.value[order.id] = false
    })
  } catch (error) {
    console.error('Errore durante il recupero degli ordini:', error)
  }
}

const filteredOrders = computed(() => {
  return orders.value
    .filter(order => searchOrderId.value === '' || order.id.toString().includes(searchOrderId.value))
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
})

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="order-manager-wrapper">
    <div class="card">
      <h2 style="margin-bottom: 1rem; color:black">📦 Lista Ordini</h2>
      <input
        v-model="searchOrderId"
        placeholder="🔍 Cerca per ID ordine"
        class="search-input"
      />

      <div class="order-list desktop-only">
        <table class="orders-table">
          <thead>
            <tr>
              <th>ID Ordine</th>
              <th>Data Ordine</th>
              <th>Importo Totale</th>
              <th>Stato</th>
              <th>Pagamento</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ new Date(order.orderDate).toLocaleString() }}</td>
              <td>{{ order.totalAmount }}€</td>
              <td>
                  <select
                    v-model="editedStatuses[order.id]"
                    @change="startEdit(order.id, order.orderStatus)"
                    class="status-select"
                  >
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                  </select>
                  <div v-if="showActions[order.id]" class="action-buttons">
                    <button class="save-btn" @click="saveStatus(order.id)">Salva</button>
                    <button class="cancel-btn" @click="cancelEdit(order.id)">Annulla</button>
                  </div>
                </td>
              <td>{{ order.paymentMethod }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mobile-only">
        <div v-for="order in filteredOrders" :key="order.id" class="order-card">
          <p><strong>ID Ordine:</strong> {{ order.id }}</p>
          <p><strong>Data:</strong> {{ new Date(order.orderDate).toLocaleString() }}</p>
          <p><strong>Importo:</strong> {{ order.totalAmount }}€</p>
          <p>
  <strong>Stato:</strong>
  <select
    v-model="editedStatuses[order.id]"
    @change="startEdit(order.id, order.orderStatus)"
    class="status-select"
  >
    <option value="CANCELLED">CANCELLED</option>
    <option value="PENDING">PENDING</option>
    <option value="DELIVERED">DELIVERED</option>
    <option value="PROCESSING">PROCESSING</option>
    <option value="SHIPPED">SHIPPED</option>
  </select>
  <div v-if="showActions[order.id]" class="action-buttons mobile-buttons">
    <button class="save-btn" @click="saveStatus(order.id)">Salva</button>
    <button class="cancel-btn" @click="cancelEdit(order.id)">Annulla</button>
  </div>
</p>
          <p><strong>Pagamento:</strong> {{ order.paymentMethod }}</p>
        </div>
      </div>

      <div v-if="filteredOrders.length === 0" class="no-orders">
        Nessun ordine trovato.
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-manager-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  height: 100%;
}

.status-select {
  padding: 0.4rem;
  font-size: 0.85rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-top: 0.25rem;
  background-color: #fff;
}

.action-buttons {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
}

.save-btn, .cancel-btn {
  padding: 0.3rem 0.75rem;
  font-size: 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  color: white;
}

.save-btn {
  background-color: #4caf50;
}

.cancel-btn {
  background-color: #e53935;
}

.mobile-buttons {
  flex-direction: column;
  gap: 0.25rem;
}

.card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 128, 0, 0.15);
  padding: 2rem;
  width: 70%;
  font-family: 'Segoe UI', sans-serif;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.search-input {
  margin-bottom: 1rem;
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  width: 100%;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.95rem;
  color: black;
}

.orders-table th,
.orders-table td {
  padding: 1rem;
  border: 1px solid #ddd;
  text-align: left;
}

.orders-table thead {
  background-color: #f5f5f5;
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
  color: white;
}

.badge.pending {
  background-color: #ffb300;
}

.badge.completed {
  background-color: #4caf50;
}

.badge.cancelled {
  background-color: #e53935;
}

.no-orders {
  margin-top: 2rem;
  font-style: italic;
  color: #888;
  text-align: center;
}

.order-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: black;
}

.desktop-only {
  display: block;
  overflow: auto;
}

.mobile-only {
  display: none;
}


@media (max-width: 768px) {
  .order-manager-wrapper {
    padding: 0.5rem;
  }

  .card {
    width: 100%;
    padding: 1rem;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
    width: 100%;
    overflow: auto;
  }
}
</style>