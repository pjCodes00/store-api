const mongoose= require('mongoose')

const productSchema= new mongoose.Schema({
  name:{
    type: String,
    required: [true, 'Product name must be provided']
  }, 

  price:{
    type: Number,
    required:[true, 'Product price must be provided']
  },

  rating:{
    type: Number,
    default: 4.5
  },

  company: {
    type: String,
    enum: {
      values: ['ikea', 'liddy', 'caressa', 'marcos'],
      message: '{VALUE} is not supported'
    }
  },

  featured:{
    type: Boolean,
    default: false
  },

  createdAt:{
    type: Date,
    default: Date.now()
  },

  image:{
    type: String,
    required: true
  },

  shipping:{
    type: Boolean,
  
  }

})

module.exports= mongoose.model('Product', productSchema)