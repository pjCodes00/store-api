 
     
     const nameInput= document.querySelector('.search-input')
     const searchBtn= document.querySelector('.search-btn')
     const selectCompany= document.querySelector('.company')
     const selectSort= document.querySelector('.sort')
     const limitInput= document.querySelector('.limit')
     const featuredCheckbox= document.querySelector('.featured')
     const fieldsInput= document.querySelector('.fields')
     const priceRatingInput= document.querySelector('.rating-price')
     const prevBtn= document.querySelector('.prev-btn')
     const nextBtn= document.querySelector('.next-btn')
     const pageBtns= document.querySelectorAll('.first-btn, .second-btn, .third-btn')
     const prodNum= document.querySelector('.product-number')
     const shippingCheckbox= document.querySelector('.shipping')

     let currentPage= 1
     const totalPages= 3

     async function fetchAndRenderProducts(page = 1) {
      try{
        const name= nameInput.value
      const company= selectCompany.value
      const sort= selectSort.value
      const limit= limitInput.value || 10
     const featured= featuredCheckbox.value
      const fields= fieldsInput.value
      const numericFilters= priceRatingInput.value
      const shipping= shippingCheckbox.checked

      const query= [
        `page=${page}`,
        name && `name=${name}`,
        sort && `sort=${sort}`,
        limit && `limit=${limit}`,
        featured !== undefined && `featured=${featured}`,
        fields && `fields=${fields}`,
        numericFilters && `numericFilters=${numericFilters}`,
        company && company !== 'all' && `company=${company}`,
        shipping && `shipping=${shipping}`
      ].filter(Boolean).join('&')

      const response= await fetch(`/api/v1/products?${query}`)

      const data= await response.json()
      console.log(data)
      
      const products= data.products
      renderProductsGrid(products)

      currentPage= page
      updatePaginationButtons()

     } catch(error) {
       console.log(error, 'there is an error')
     }
    }

     function renderProductsGrid(products) {
      let html='';

      prodNum.innerHTML= `${products.length} Products`

      if(products.length < 1) {
        document.querySelector('.grid-container').innerHTML= 'No Products to show.'
        return;
      }    

      products.forEach((product) => {
        const name= product.name ? product.name : ''
        const price= product.price ? '$' + product.price : ''
        const company= product.company ? product.company : ''
        const rating= product.rating ? product.rating + ' stars' : ''
        

        html+= `<div class="image-text-cont">
        <div class="image-cont">
          <img class="image" src="${product.image}">
        </div>
        <div class="details-cont1">
          <p>${name}</p>
          <p>${price}</p>
        </div>
        <div class="details-cont2">
          <p>${company}</p>
          <p>${rating}</p>
        </div>
      </div>`
      })
      document.querySelector('.grid-container').innerHTML= html

    }
  
    function updatePaginationButtons() {
      prevBtn.disabled = currentPage===1
      nextBtn.disabled = currentPage === totalPages
      
      pageBtns.forEach((btn, index) => {
        btn.classList.toggle('active', currentPage === index + 1)
      })
    }

    searchBtn.addEventListener('click', () => {
      fetchAndRenderProducts( 1)
    })

    pageBtns.forEach((btn, index) => {
      btn.addEventListener('click',() => {
        fetchAndRenderProducts( index + 1)
      })
    })

    prevBtn.addEventListener('click', () => {
      if(currentPage > 1) {
        fetchAndRenderProducts( currentPage - 1)
      }
    })

    nextBtn.addEventListener('click', () => {
      if(currentPage < totalPages) {
        fetchAndRenderProducts( currentPage + 1)
      }
    })

    fetchAndRenderProducts()
   

    
    