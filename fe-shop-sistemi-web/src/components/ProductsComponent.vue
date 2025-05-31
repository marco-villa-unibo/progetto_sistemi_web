<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from "axios"
import { getToken } from "../utils/auth"
import { reactive, watch, toRefs } from 'vue'

const searchQuery = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const Products = ref<any[]>([])

const token = ref<string | null>(null)

const showId = ref<number | null>(null)
const show = ref(false)
const quantity = ref<number>(0)
const productCartId = ref<number>(0)
const edit = ref<boolean>(false)

const initialCartQuantity = ref<number>(0)

const filteredProducts = computed(() => {
  return [...Products.value]
    .filter(product =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .sort((a, b) => sortOrder.value === 'asc' ? a.price - b.price : b.price - a.price)
})

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
      image: p.imageUrl.replace(/public/g, "http://localhost:8080/"),
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

  const product = Products.value.find(p => p.id === id)
  if (!product) return

  const updatedProduct = {
    title: form.title?.trim() || product.name,
    pDescription: form.pDescription?.trim() || product.description,
    price: form.price !== null && form.price !== undefined && !isNaN(form.price) ? form.price : product.price,
    quantity: form.quantity !== null && form.quantity !== undefined && !isNaN(form.quantity) ? form.quantity : product.quantity,
    category: product.category 
  }

  try {
    const response = await axios.put(`/api/v1/product/${id}`, updatedProduct, 
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    console.log("Prodotto salvato:", response.data)

    const index = Products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      Products.value[index] = {
        ...Products.value[index],
        ...updatedProduct
      }
    }

    fetchProducts()
    closeDetails()
    edit.value = false
    show.value = false
    showId.value = null
    quantity.value = 0
  } catch (error) {
    console.error("Errore durante il salvataggio del prodotto:", error)
    showNotification("Errore nel salvataggio del prodotto!", 'error')
  }
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

function editProduct() {
  const product = Products.value.find(p => p.id === showId.value)
  if (product) {
    form.title = product.name
    form.pDescription = product.description
    form.price = product.price
    form.quantity = product.quantity
    form.category = product.category
  }
  edit.value = !edit.value
}

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
    <div class="headerSearch">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cerca un prodotto..."
          style="padding: 10px; width: 50%; border: 1px solid #ccc; border-radius: 4px;"
        />
        <select v-model="sortOrder" class="priceSort">
          <option value="asc">Prezzo crescente</option>
          <option value="desc">Prezzo decrescente</option>
        </select>
      </div>  
      <div style="width: 100%; display: flex; flex-wrap: wrap; flex-direction: row; justify-content: center; overflow: auto;" class="font">
        <div v-for="product in filteredProducts" :key="product.id" class="product-card" style="overflow: auto">
          <button class="card" style="margin:10px; padding: 10px;" @click="selectItems(product.id)">
          <div class="nameSpace">{{ product.name }}</div>
          <div class="innerCard">
             <div class="imageSpace">
              <img :src="product.image" class="product-img" />
            </div>
            <div><b>Price:</b> {{ product.price }}€</div>
            <div>
              <i class="fa fa-cart-plus" style="font-size:25px;"></i>
            </div>
          </div>
          </button>
        </div>
        <div v-if="show" class="details-popup font" style="border: 4px solid green"> 
          <button class="closeBtn" @click="closeDetails()"><i class="fa fa-window-close" aria-hidden="true">X</i></button>
          <div v-if="showId !== null && edit == false" style="height: 100%;">
            <div style="padding:10px">
              <div style="font-size: xx-large;"><strong>{{ Products.find(p => p.id === showId)?.name }}</strong></div>
            </div>
            <div class="showDetail">
              <div style="padding-bottom: 20px;width: 40%;">
                <img :src="Products.find(p => p.id === showId)?.image" style="box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2); border-radius: 4px;" height="100%" width="100%" />
              </div>
              <div class="bodyProductDetail">
                <div class="descriptionItem">
                    <div style="width: 70%; height: 100%; display: flex;align-items: flex-start; justify-content: center;">
                        <b class="fontTitleDescription">Descrizione:</b>
                    </div>
                    <div style="width: 70%; display: flex;">
                        <p>{{ Products.find(p => p.id === showId)?.description }}</p>
                    </div>
                </div>
                <div class="descriptionItem">
                    <div style="width: 70%; height: 100%; display: flex;align-items: flex-start; justify-content: center;">
                        <p><b class="fontTitleDescription">Prezzo:</b></p>
                    </div>
                    <div style="width: 70%; display: flex; justify-content: center;">
                        <p> {{ Products.find(p => p.id === showId)?.price }}€</p>
                    </div>
                </div>
                <div v-if="token" style="display: flex; flex-direction:row;  justify-content: center;">
                    <div style="padding-right:10px">
                        <button @click="remove()"  :disabled="quantity <= 0">
                            <i class="fa fa-minus">➖</i>
                        </button>
                    </div>
                    <div>
                        {{quantity}}
                    </div>
                    <div style="padding-left:10px">
                        <button @click="add()">
                            <i class="fa fa-plus">➕</i>
                        </button>
                    </div>
                </div>
                <div v-if="token" class="buttonsSection">
                    <button @click="addToCart()" class="button-color-add editButton" :disabled="quantity == 0">
                        ‌Aggiungi al carrelo
                    </button>
                    <button @click="removeFromCart()" class="button-color-remove editButton" :disabled="initialCartQuantity === 0">
                        Rimuovi dal carrello
                    </button>
                </div>
                <div v-if="token && role !== 'CUSTOMER'">
                    <button @click="editProduct()" class="editButton button-color-add">Edit Product</button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="showId !== null && edit == true && token && role !== 'CUSTOMER'">
            <div style="width: 100%; max-width: 600px; margin: auto;">
              <h2 style="text-align: center; margin-bottom: 1rem;">Modifica Prodotto</h2>
                <form style="display: flex; flex-direction: column;">
                  <div style="display: flex; flex-direction: column;" class="form-group">
                    <label for="title"><strong>Titolo</strong></label>
                    <textarea id="title" v-model="form.title" :placeholder="Products.find(p => p.id === showId)?.name" style="padding: 0.5rem; font-size: 1rem; width: auto; max-height:75px; max-width: 100%;">
                    </textarea>
                  </div>

                  <div style="display: flex; flex-direction: column;" >
                    <div class="form-group">
                      <label for="description"><strong>Descrizione</strong></label>
                      <textarea
                          id="description"
                          v-model="form.pDescription"
                          :placeholder="Products.find(p => p.id === showId)?.description" style=" width: auto; max-height:111px; max-width: 100%;">
                      </textarea>
                    </div>
                    <div style="padding: 1rem; max-width: 500px; margin: 0 auto;">
                      <form style="display: flex; flex-direction: column;">

                        <div class="form-group">
                          <label for="price" style="font-weight: bold;">Nuovo Prezzo</label>
                          <small style="display: block; color: gray;">Attuale: {{ Products.find(p => p.id === showId)?.price }} €</small>
                          <input
                              type="number"
                              id="price"
                              v-model.number="form.price"
                              :placeholder="Products.find(p => p.id === showId)?.price"
                              style="padding: 0.6rem; font-size: 1rem; width: 100%; border-radius: 6px; border: 1px solid #ccc;"
                          />
                        </div>

                        <div class="form-group">
                          <label for="quantity" style="font-weight: bold;">Nuova Quantità</label>
                          <small style="display: block; color: gray;">Attuale: {{ Products.find(p => p.id === showId)?.quantity }}</small>
                          <input
                              type="number"
                              id="quantity"
                              v-model.number="form.quantity"
                              :placeholder="Products.find(p => p.id === showId)?.quantity"
                              style="padding: 0.6rem; font-size: 1rem; width: 100%; border-radius: 6px; border: 1px solid #ccc;"
                          />
                        </div>
                      </form>

                      <div style="display: flex; justify-content: center; margin: 1rem 0;">
                        <img
                          :src="Products.find(p => p.id === showId)?.image"
                          alt="Immagine prodotto"
                          style="
                              max-width: 80%;
                              width: 250px;
                              border-radius: 10px;
                              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                              object-fit: contain;
                          "
                        />
                      </div>

                      <div style="display: flex; justify-content: space-between;">
                        <button @click="saveProduct(showId)" style="flex: 1; padding: 0.75rem; background: #4CAF50; color: white; border: none; border-radius: 6px;">Salva</button>
                        <button @click="editProduct()" style="flex: 1; padding: 0.75rem; background: #ccc; color: black; border: none; border-radius: 6px;">Annulla</button>
                        <button @click="deleteProduct(showId)" style="flex: 1; padding: 0.75rem; background: #f44336; color: white; border: none; border-radius: 6px;">Elimina</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            <div v-if="notification" :style="{ backgroundColor: notification.type === 'success' ? '#4CAF50' : '#f44336', color: 'white', padding: '10px', position: 'fixed', top: '20px', right: '20px', borderRadius: '5px', zIndex: 1000 }">
              {{ notification.message }}
            </div>
          </div>
        </div>
      </div>
</template>

<style>

.fontTitleDescription {
  font-size: x-large;
}

.bodyProductDetail {
  width: 40%; 
  height: 70%; 
  display: flex; 
  flex-direction: column; 
  align-items: center;
}

.product-img {
  width: 150px;
  height: 150px;
  object-fit: contain;
  border-radius: 6px;
  background-color: #fff;
}

.priceSort {
  margin-left: 10px; 
  padding: 10px;
}

.headerSearch {
  width: 100%; 
  text-align: center; 
  margin: 20px 0;
}

.showDetail {
  display: flex;
  height: 90%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.descriptionItem {
  width: 100%;
  display: flex; 
  flex-direction: row; 
  align-items: center; 
  padding:20px
}

.buttonsSection{
  padding-left:10px
}

.editButton {
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

.innerCard{
    display: flex;
    flex-direction: row;
    width: 80%;
    align-items: center;
    justify-content: space-between;
}

.button-color-remove{
  background-color: red;
}

.button-color-add{
  background-color: #4CAF50;
}

.editButton:disabled {
  background-color: #ccc;
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
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

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

.closeBtn {
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

  



  body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  margin: 0;
}

.card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 128, 0, 0.15);
  padding: 16px;
  margin: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 128, 0, 0.25);
}

.card img {
  border-radius: 8px;
  max-width: 100%;
  height: auto;
}

.imageSpace {
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
}

.nameSpace {
  font-weight: bold;
  font-size: 18px;
  padding-bottom: 10px;
  color: #2f4f4f;
}

input[type="text"], select {
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 12px 16px;
  font-size: 16px;
  transition: border 0.3s;
}

input[type="text"]:focus, select:focus {
  border-color: #4CAF50;
  outline: none;
}

.button-color-add:hover {
  background-color: #388e3c;
}

.button-color-remove:hover {
  background-color: #991010;
}

.editButton:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Popup */
.details-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  max-width: 1000px;
  height: 80%;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  padding: 24px;
}

.closeBtn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: crimson;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 18px;
  cursor: pointer;
  line-height: 36px;
}

/* Notifica */
.notification {
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  position: fixed;
  top: 20px;
  right: 20px;
  border-radius: 8px;
  z-index: 1000;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.notification.error {
  background-color: #f44336;
}

/* Pulsanti + e - */
.quantity-button {
  background-color: #4CAF50;
  border: none;
  border-radius: 8px;
  color: white;
  padding: 8px 12px;
  margin: 0 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.quantity-button:hover {
  background-color: #357a38;
}

.product-card {
  width: 23%;
  margin: 10px;
}

@media (max-width: 1024px) {
  .product-card {
    width: 45%;
  }
}

@media (max-width: 768px) {
  .product-card {
    width: 100%;
  }
}
@media (max-width: 768px) {


  .priceSort{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    margin-left: 0px;
    padding: 3px;
  }

  .headerSearch{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 4px;
  }

  .form-group {
    padding-top: 25px !important;
    margin: 0px
  }
  .fontTitleDescription {
    font-size: 18px;
  }
  .closeBtn{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .buttonsSection{
  padding:10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.editButton{
  width: 100%;
  margin: 5px;
  padding: 10px;
  font-size: 14px !important;

}

  .descriptionItem {
  width: 100%;
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  padding:10px
}

  .hide {
    display: none;
  }
  .showDetail {
  display: flex;
  height: 90%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
  .product-card {
    width: 100%;
  }

  .details-popup {
    width: 90%;
    height: auto;
    padding: 16px;
  }

  .details-popup > div {
    flex-direction: column !important;
  }

  .details-popup img {
    width: 100% !important;
    height: auto !important;
  }

    .nameSpace {
    font-weight: bold;
    font-size: 12px;
    padding-bottom: 10px;
    color: #2f4f4f;
  }

  .bodyProductDetail {
  width: 90%; 
  height: 70%; 
  display: flex; 
  flex-direction: column; 
  align-items: center;
}
}

</style>