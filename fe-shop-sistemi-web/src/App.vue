<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getToken, removeToken } from "./generated-sources/shop/apis/AuthApi"
import { useRouter } from 'vue-router'
import axios from "axios";

const router = useRouter()

const token = ref<string | null>(null)
const isSidebarOpen = ref(false)

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



const checkToken = () => {
  token.value = getToken()
  axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  if (!token.value) {
    removeToken()
    router.push('/login')
  } else {
    // Dispatch an event to notify other components about the token change
    if (role.value == "CUSTOMER") {
      console.log("Customer role detected")
        axios.get('/api/v1/health/customer').then(() => {
          console.log("Customer health check successful")
        }).catch(() => {
          console.log("Error in customer health check")
            removeToken()
            router.push('/login')
        })
    } else if (role.value == "EMPLOYEE") {
        console.log("Employee role detected")
        axios.get('/api/v1/health/employee').then(() => {
          console.log("Employee health check successful")
        }).catch(() => {
          console.log("Error in employee health check")
            removeToken()
            router.push('/login')
        })
    } else if (role.value == "ADMIN") {
      console.log("Admin role detected")
    axios.get('/api/v1/health/admin').then(() => {
      console.log("Admin health check successful")
        }).catch(() => {
          console.log("Error in admin health check")
            removeToken()
            router.push('/login')
        })
    }
    window.dispatchEvent(new Event('token-changed'))
  }
}


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
      <div class="header-content" style="display: flex; justify-content: space-between; align-items: center; width: 100%; height: 70px; background-color: rgb(68 68 68); padding: 0 20px; box-sizing: border-box;">
        <!-- Sinistra: Nome utente -->
        <div style="display: flex; flex-direction: row; align-items: center;">
          <div style="display: flex; gap: 15px; align-items: center;">
            <RouterLink to="/"><img src="./assets/DALL·E-2025-03-22-16.32 (3).png" alt="Logo" class="logo-img" style="width: 60px; height: 60px; border-radius: 50%;"></RouterLink>
          </div>
          <div v-if="token" @click="toggleSidebar" class="username-section editButton  centerIcon">
            <p class="hide">Ciao, {{ username }}</p>
            <p class="hideDesktop">☰</p>
          </div>
          <div v-else class="editButton">
            <RouterLink to="/login" tag="button" class="rootButton fontButton fontLogin">Login</RouterLink>
          </div>
        </div>
      
        <!-- Destra: Carrello -->
        <div v-if="token" class="editButton centerIcon">
          <RouterLink to="/cart" tag="button" class="rootButton fontButton">
            <P>🛒</P>
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
        <li v-if="token"><RouterLink to="/MyOrders" @click="closeSidebar">I miei Ordini</RouterLink></li>
        <li v-if="token && role !== 'CUSTOMER'"><RouterLink to="/Orders" @click="closeSidebar">Gestione Ordini</RouterLink></li>
        <li><RouterLink to="/" @click="closeSidebar">Prodotti</RouterLink></li>
        <li><button @click="logout" style="background:none; border:none; color:white; cursor:pointer;">Logout</button></li>
      </ul>
    </aside>

    <!-- CONTENUTO -->
    <RouterView />
  </div>
</template>

<style scoped>

.hideDesktop{
  display: none;
}
.editButton {
  background-color: #4CAF50; /* Verde */
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border: black;
  color: black;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.rootButton {
  color:black; 
  font-size: 20px;
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

@media (max-width: 768px) {
  .fontLogin{
    display: flex;
    font-size: medium;
    justify-content: center;
    align-items: center;
  }
  .editButton {
    font-size: 16px;
    padding: 8px 12px;
    width: 15% !important;
    height: 70%;
    
    display: flex;
    justify-content: center;

  }

  .sidebar {
  position: fixed;
  top: 0;
  right: 0;
  transform: translateX(100%);
  width: 250px;
  height: 100%;
  background-color: #444;
  color: white;
  padding: 1rem;
  transition: transform 0.3s ease-in-out;
  z-index: 1001;
  overflow-y: auto;
}

.sidebar.open {
  transform: translateX(0%);
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
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
  display: none;
}

.overlay.open {
  display: block;
}

  .header-content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    height: auto;
    padding: 10px;
    gap: 10px;
  }

  .header-content > div {
    width: 100%;

  }

  .logo-img {
    width: 50px;
    height: 50px;
  }

  .username-section {
    font-size: 18px;
  }

  .hide {
    display: none;
  }

  .hideDesktop{
    display: block;
  
  }

  .centerIcon{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    padding: 0px;
  }
}

</style>