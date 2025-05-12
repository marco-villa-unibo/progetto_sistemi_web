<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getToken, removeToken } from "./generated-sources/shop/apis/AuthApi"
import { useRouter } from 'vue-router';
const router = useRouter();


const token = ref<string | null>(null)

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
  router.push('/Products')
}
</script>

<template>
  <div style="display: flex; flex-direction: column;
    align-items: center; height:100% !Important">
    <div style="height: 50px; width: 100%">
      <RouterLink to="/login" tag="button">Login</RouterLink>  
      <RouterLink v-if="token && role !== 'CUSTOMER'" to="/CreateProduct" tag="button">Crea Prodotto</RouterLink>  
      <RouterLink v-if="token" to="/Profile" tag="button">Profilo</RouterLink>  
      <RouterLink to="/products" tag="button">Products</RouterLink>
      <RouterLink v-if="token && role !== 'CUSTOMER' && role !== 'EMPLOYEE'" to="/Users" tag="button">Utenti</RouterLink>  
      <button @click="logout" >Logout</button>
    </div>
    <RouterView />
  </div>
</template>

<style scoped>
.header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  .header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  .header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
