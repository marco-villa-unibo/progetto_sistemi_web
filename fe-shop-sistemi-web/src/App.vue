<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getToken, removeToken } from "./generated-sources/shop/apis/AuthApi"
import { useRouter } from 'vue-router'

const router = useRouter()

const token = ref<string | null>(null)
const isSidebarOpen = ref(false)

const checkToken = () => {
  token.value = getToken()
}

const role = computed(() => {
  if (token.value) {
    try {
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      return payload.role
    } catch (e) {
      return null
    }
  }
  return null
})

const username = computed(() => {
  if (token.value) {
    try {
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      return payload.username
    } catch (e) {
      return null
    }
  }
  return null
})

onMounted(() => {
  checkToken()
  window.addEventListener('token-changed', checkToken)
})

onUnmounted(() => {
  window.removeEventListener('token-changed', checkToken)
})

const logout = () => {
  removeToken()
  token.value = null
  window.dispatchEvent(new Event('token-changed'))
  router.push('/')
  isSidebarOpen.value = false
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}
</script>

<template>
  <div style="display: flex; flex-direction: column; align-items: center; height:100%; overflow: hidden;">
    <!-- HEADER -->
    <div style="height: 70px; width: 100%; box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);">
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; height: 70px;background-color: rgb(68 68 68); padding: 0 20px; box-sizing: border-box;">
    
        <!-- Sinistra: Nome utente -->
        <div style="display: flex; flex-direction: row;">
          <div style="display: flex; gap: 15px; align-items: center;">
            <img src="./assets/DALL·E-2025-03-22-16.32 (3).png" srcr="https://preview.ibb.co/hUAr57/bar_bg.jpg" alt="Logo" style="width: 60px; height: 60px; border-radius: 50%;">
          </div>
          <div v-if="token" style="color: black; font-size: 20px; cursor: pointer;" @click="toggleSidebar" class="editButton">
            Ciao, {{ username }}
          </div>
          <div v-else style="color: black; border: black 1px solid; font-size: 20px;" class="editButton">
            <RouterLink to="/login" tag="button" style="color: black">Login</RouterLink>
          </div>
        </div>

        <!-- Destra: Carrello e Logout -->
        <div v-if="token" style="display: flex; gap: 15px; align-items: center;" class="editButton">
          <RouterLink  to="/cart" tag="button" style="color:white; font-size: 20px;">
            🛒 Carrello
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- SIDEBAR OVERLAY -->
    <div v-if="isSidebarOpen" class="overlay" @click="closeSidebar"></div>

    <!-- SIDEBAR -->
    <aside class="sidebar" :class="{ open: isSidebarOpen }">
      <button class="close-btn" @click="closeSidebar">&times;</button>
      <ul>
        <li><RouterLink to="/Profile" @click="closeSidebar">Profilo</RouterLink></li>
        <li v-if="role !== 'CUSTOMER'"><RouterLink to="/CreateProduct" @click="closeSidebar">Crea Prodotto</RouterLink></li>
        <li v-if="role !== 'CUSTOMER' && role !== 'EMPLOYEE'"><RouterLink to="/Users" @click="closeSidebar">Gestione Utenti</RouterLink></li>
        <li v-if="token"><RouterLink to="/Orders" @click="closeSidebar">I miei Ordini</RouterLink></li>
        <li><RouterLink to="/" @click="closeSidebar">Prodotti</RouterLink></li>
        <li><button @click="logout" style="background:none; border:none; color:white; cursor:pointer;">Logout</button></li>
      </ul>
    </aside>

    <!-- CONTENUTO -->
    <RouterView />
  </div>
</template>

<style scoped>

.editButton {
  background-color: #4CAF50; /* Verde */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border: black;
}

.sidebar {
  position: fixed;
  top: 0;
  right: -250px;
  width: 250px;
  height: 100%;
  background-color: #444;
  color: white;
  padding: 1rem;
  transition: right 0.3s ease;
  z-index: 1001;
}
.sidebar.open {
  right: 0;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  margin: 1rem 0;
}
.sidebar a {
  color: white;
  text-decoration: none;
}
.sidebar .close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  float: right;
  cursor: pointer;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 1000;
}
</style>