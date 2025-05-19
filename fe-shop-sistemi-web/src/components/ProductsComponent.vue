<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from "axios"
import { getToken } from "../utils/auth"
import { reactive, watch, toRefs } from 'vue'
import { CartItemFromJSON } from '@/generated-sources/shop'

// Reattivi
const searchQuery = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const Products = ref<any[]>([])  // Ora vuoto, verrà popolato via API

const token = ref<string | null>(null)

const showId = ref<number | null>(null)
const show = ref(false)
const quantity = ref<number>(0)
const productCartId = ref<number>(0)
const edit = ref<boolean>(false)

const initialCartQuantity = ref<number>(0)

// Filtraggio e ordinamento
const filteredProducts = computed(() => {
  return [...Products.value]
    .filter(product =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .sort((a, b) => sortOrder.value === 'asc' ? a.price - b.price : b.price - a.price)
})

// Recupero token
const checkToken = () => {
  token.value = getToken()
}

// Decodifica del ruolo da JWT
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


async function fetchCart() {
  try {
    const token = getToken()
    if (!token) throw new Error('Token mancante.')

    const response = await axios.get('/api/v1/cart', {
      headers: { Authorization: `Bearer ${token}` }
    })

    return response.data.cartItems || []
  } catch (error) {
    console.error('Errore caricamento carrello:', error)
    return []
  }
}


async function selectItems(id: number) {
  showId.value = id
  show.value = true

  const cartItems = await fetchCart()
  const cartItem = cartItems.find((item: any) => item.ProductId === id)
  quantity.value = cartItem ? cartItem.quantity : 0
  productCartId.value = cartItem ? cartItem.id : 0
  initialCartQuantity.value = cartItem ? cartItem.quantity : 0
  console.log("ID prodotto:", id)
}

function closeDetails() {
    if (edit.value == true){
        editProduct()
    }
  show.value = false
  showId.value = null
}

function editProduct() {
    edit.value = !edit.value

}

function remove() {
  quantity.value -= 1
}

function add() {
  quantity.value += 1
}

const access_token = getToken()
axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

async function fetchProducts() {
  try {
    const response = await axios.get('/api/v1/product')
    Products.value = response.data.map((p: any) => ({
      id: p.id,
      name: p.title,
      description: p.pDescription,
      price: p.price,
      quantity: p.quantity,
      category: p.category,
      image: p.imageUrl.replace(/public/g, "http://localhost:8080/"), // Assumendo che serva da lì
    }));
  } catch (error) {
    console.error("Errore nel caricamento prodotti:", error);
  }
}
async function addToCart() {
  try {
    const response = await axios.put('/api/v1/cart/items/' + showId.value, {
      quantity: quantity.value
    })
    console.log("Prodotto aggiunto al carrello:", response.data)
    showNotification("Prodotto aggiornato nel carrello!", 'success')
  } catch (error) {
    try {
      const response = await axios.post('/api/v1/cart/items', {
        ProductId: showId.value,
        quantity: quantity.value
      })
      console.log("Prodotto aggiunto al carrello:", response.data)
      showNotification("Prodotto aggiunto al carrello!", 'success')
      closeDetails()
    } catch (error) {
      console.error("Errore nell'aggiunta al carrello:", error)
      showNotification("Errore nell'aggiunta al carrello!", 'error')
    }
  }
}

async function removeFromCart() {
  try {
    console.log(productCartId.value)
    const response = await axios.delete(`/api/v1/cart/items/${productCartId.value}`)
    console.log("Prodotto rimosso dal carrello:", response.data)
    showNotification("Prodotto rimosso dal carrello!", 'success')
    closeDetails()
  } catch (error) {
    console.error("Errore nella rimozione dal carrello:", error)
    showNotification("Errore nella rimozione dal carrello!", 'error')
  }
}

const notification = ref<{ message: string, type: 'success' | 'error' } | null>(null)

function showNotification(message: string, type: 'success' | 'error') {
  notification.value = { message, type }
  setTimeout(() => {
    notification.value = null
  }, 3000)
}


async function saveProduct(id: number) {
    console.log("Salva prodotto");
    if (Products.value.find(p => p.id === id)?.name != form.title) {
        Products.value.find(p => p.id === id).name = form.title
    }
    if (Products.value.find(p => p.id === id)?.description != form.pDescription) {
        Products.value.find(p => p.id === id).description = form.pDescription
    }
    if (Products.value.find(p => p.id === id)?.price != form.price) {
        console.log(form.price)
        Products.value.find(p => p.id === id).price = form.price
    }
    if (Products.value.find(p => p.id === id)?.quantity != form.quantity) {
        console.log(form.quantity)
        Products.value.find(p => p.id === id).quantity = form.quantity
    }
    const response = await axios.put(`/api/v1/product/${id}`, {
        title: Products.value.find(p => p.id === id)?.name,
        pDescription: Products.value.find(p => p.id === id)?.description,
        price: Products.value.find(p => p.id === id)?.price,
        category: Products.value.find(p => p.id === id)?.category,
        quantity: Products.value.find(p => p.id === id)?.quantity
    }, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
    console.log("Prodotto salvato:", response.data);
    // Aggiorna la lista dei prodotti
    const index = Products.value.findIndex(p => p.id === id);
    if (index !== -1) {
        Products.value[index] = {
        ...Products.value[index],
        ...response.data,
        };
    }
    fetchProducts(); 
    closeDetails(); 
    edit.value = false; 
    show.value = false; 
    showId.value = null;
    quantity.value = 0;
    console.log("Prodotto salvato");
    console.log(Products.value.find(p => p.id === id));

}

interface ProductForm {
  title: string
  pDescription: string
  category: string
  price: number
  quantity: number
}

const form = reactive<ProductForm>({
  title: '',
  pDescription: '',
  category: '',
  price: 0,
  quantity: 0
})

function deleteProduct(id: number) {
    const response = axios.delete(`/api/v1/product/${id}`);
    fetchProducts();
    closeDetails();
    fetchProducts()
};


onMounted(() => {
  checkToken()
  fetchProducts()
  window.addEventListener('token-changed', checkToken)
})
</script>

<template>
    <div style="width: 100%; text-align: center; margin: 20px 0;">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cerca un prodotto..."
          style="padding: 10px; width: 50%; border: 1px solid #ccc; border-radius: 4px;"
        />
        <select v-model="sortOrder" style="margin-left: 10px; padding: 10px;">
          <option value="asc">Prezzo crescente</option>
          <option value="desc">Prezzo decrescente</option>
        </select>
      </div>  
  <div style="width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    overflow: auto;" class="font">
    

    <div v-for="product in filteredProducts" :key="product.id" style="width:25%; overflow: auto">
      <button class="card" style="margin:10px; padding: 10px;" @click="selectItems(product.id)">
        <div class="nameSpace">{{ product.name }}</div>
        <div class="imageSpace">
          <img :src="product.image" height="150px" width="150px" />
        </div>
        <div>Price: {{ product.price }}€</div>
        <div>
          <i class="fa fa-cart-plus" style="font-size:25px;"></i>
        </div>
      </button>
    </div>

    
    <div v-if="show" class="details-popup font" style="border: 4px solid green"> 
        <button class="close-btn" @click="closeDetails()"><i class="fa fa-window-close" aria-hidden="true">X</i></button>
        <div v-if="showId !== null && edit == false" style="height: 100%;">
          <div style="padding:10px">
            <div style="font-size: xx-large;"><strong>{{ Products.find(p => p.id === showId)?.name }}</strong></div>
          </div>
          <div style="display: flex;    height: 90%;    flex-direction: row;    /* align-content: center; */    align-items: center;    justify-content: center;">
            <div style="padding-bottom: 20px;width: 40%;">
                <img :src="Products.find(p => p.id === showId)?.image" style="box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 4px;" height="100%" width="100%" />
            </div>
            <div style="width: 40%; height: 70%; display: flex; flex-direction: column; align-items: center;">
              <div style="width: 100%;display: flex; flex-direction: row; align-items: center; padding:20px">
                  <div style="width: 70%; height: 100%; display: flex;align-items: flex-start; justify-content: center;">
                      <b style="font-size: x-large;">Descrizione:</b>
                  </div>
                  <div style="width: 70%; display: flex;">
                      <p>{{ Products.find(p => p.id === showId)?.description }}</p>
                  </div>
              </div>
              <div style="width: 100%;display: flex; flex-direction: row; align-items: center; padding:20px">
                  <div style="width: 70%; height: 100%; display: flex;align-items: flex-start; justify-content: center;">
                      <p><b style="font-size: x-large;">Prezzo:</b></p>
                  </div>
                  <div style="width: 70%; display: flex;">
                      <p> {{ Products.find(p => p.id === showId)?.price }}€</p>
                  </div>
              </div>
              <div style="display: flex; flex-direction:row;  justify-content: center;">
                  <div style="padding-right:10px">
                      <button @click="remove()"  :disabled="quantity <= 0">
                          <i class="fa fa-minus">‌-</i>
                      </button>
                  </div>
                  <div>
                      {{quantity}}
                  </div>
                  <div style="padding-left:10px">
                      <button @click="add()">
                          <i class="fa fa-plus">‌+</i>
                      </button>
                  </div>
              </div>
              <div style="padding-left:10px">
                  <button @click="addToCart()" class="editButton" :disabled="quantity == 0">
                      ‌Aggiungi al carrelo
                  </button>
                  <button @click="removeFromCart()" class="editButton" :disabled="initialCartQuantity === 0">
                      Rimuovi dal carrello
                  </button>
              </div>
              <div v-if="token && role !== 'CUSTOMER'">
                  <button @click="editProduct()" class="editButton">Edit Product</button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="showId !== null && edit == true && token && role !== 'CUSTOMER'">
            <div style="width: 100%;display: flex; flex-direction: column; align-items: center;">
                <table>
                    <tbody>
                    <tr>
                        <td>Titolo:</td>
                        <td>
                            <textarea id="title" v-model="form.title"> {{ Products.find(p => p.id === showId)?.name }}</textarea>
                        </td>
                    </tr>
                    <tr>
                        <td>Descrizione:</td>
                        <td>
                            <textarea id="description" v-model="form.pDescription">{{ Products.find(p => p.id === showId)?.description }}</textarea>
                        </td>
                    </tr>
                    <tr>
                        <td>Nuovo Prezzo:</td>
                        <td>
                            <input type="number" v-model.number="form.price"></input>€
                        </td>
                    </tr>
                    <tr>
                        <td>Vecchio Prezzo:</td>
                        <td>
                            <p @value="Products.find(p => p.id === showId)?.price" type="number">{{ Products.find(p => p.id === showId)?.price }}€</p>
                        </td>
                    </tr>
                    <tr>
                        <td>Nuova Quantità:</td>
                        <td>
                            <input type="number" v-model.number="form.quantity"></input>€
                        </td>
                    </tr>
                    <tr>
                        <td>Vecchia Quantità:</td>
                        <td>
                            <p @value="Products.find(p => p.id === showId)?.quantity" type="number">{{ Products.find(p => p.id === showId)?.quantity }}</p>
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
            <div style="padding-bottom:20px; ">
                <img :src="Products.find(p => p.id === showId)?.image" style="box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 4px;" height="42%" width="42%" />
            </div>
            <div>
                <button @click="saveProduct(showId)"> salva </button>
                <button @click="editProduct()"> annulla </button>
                <button @click="deleteProduct(showId)"> elimina prodotto </button>
            </div>
        </div>
    </div>
              <div v-if="notification" :style="{
  backgroundColor: notification.type === 'success' ? '#4CAF50' : '#f44336',
  color: 'white',
  padding: '10px',
  position: 'fixed',
  top: '20px',
  right: '20px',
  borderRadius: '5px',
  zIndex: 1000
}">
  {{ notification.message }}
</div>
  </div>
</template>

<style>

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
}

.editButton:disabled {
  background-color: #ccc; /* Verde */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  cursor: not-allowed;
}
.card {
  background-color: #fff;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  background-color: white;
  width: -webkit-fill-available;
}

.imageSpace {
  display: flex;
  justify-content: center;
  padding-bottom: 7px;
}

.nameSpace {
  padding-bottom: 7px;
}

/* Stile per il popup */
.details-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 80%;
  background-color: white;
  box-shadow: 0px 2px 100px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 20px;
  text-align: center;
}

.font{
    color: black;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: red;
    color: white;
    border: none;
    padding: 5px 10px;
    font-size: 20px;
    cursor: pointer;
  }
</style>