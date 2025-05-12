<script setup lang="ts">
import ProductsForm from '../components/newProductForm.vue'
var isEdit:Boolean =  false
</script>


<template>
    <div>
      <h1>{{ isEdit ? 'Modifica prodotto' : 'Crea nuovo prodotto' }}</h1>
      <ProductForm
        :modelValue="product"
        @submit="handleSubmit"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import ProductForm from '@/components/ProductForm.vue'
  import { useRoute, useRouter } from 'vue-router'
  
  const route = useRoute()
  const router = useRouter()
  

  const isEdit = route.params.id !== undefined
  const product = ref(
    isEdit
      ? {
          id: Number(route.params.id),
          title: 'Penna',
          pDescription: 'Penna multicolore BIC',
          category: 'ORTOFRUTTA',
          price: 9.99,
          quantity: 10,
          imageUrl: 'https://via.placeholder.com/150'
        }
      : {
          title: '',
          pDescription: '',
          category: '',
          price: 0,
          quantity: 0,
          imageUrl: ''
        }
  )
  

  function handleSubmit(newProduct: any) {
    if (isEdit) {
      console.log('Aggiorna prodotto:', newProduct)
    } else {
      console.log('Crea nuovo prodotto:', newProduct)
    }
  
    router.push('/prodotti')
  }
  </script>