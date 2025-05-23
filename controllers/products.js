const Product= require('../models/product')

const getAllProducts= async(req, res) => {
 const{featured, name, company, fields, numericFilters, sort, shipping}= req.query
 const queryObject= {}

 if(featured === 'true' || featured === 'false') {
 queryObject.featured= featured === 'true' 
 }

 if(name) {
  queryObject.name= {$regex:name, $options: 'i'}
 }

 if(company && company !== 'all') {
  queryObject.company= company
 }

 if(shipping) {
  queryObject.shipping= shipping === 'true'
 }

 if(numericFilters){
   const operatorMap= {
    '>' : '$gt',
    '>=': '$gte',
    '=' : '$eq',
    '<' : '$lt',
    '<=': '$lte'
   }
 

 const regEx= /\b(<|>|>=|=|<|<=)\b/g
 let filters= numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)
 console.log(filters)

 const options= ['price', 'rating']
 filters= filters.split(',').forEach((item) => {
  const[field, operator, value]= item.split('-')

  if(options.includes(field)){
    queryObject[field]= {[operator]: Number(value)}
  }
 })
}

console.log(queryObject)
 let result=  Product.find(queryObject)

 if(sort){
  
  let sortList = sort.split(',').join(' ');
  if (!sortList.includes('_id')) {
    sortList += ' _id';
  }
  result = result.sort(sortList);
} else{
  
  result = result.sort('createdAt _id');
}


 if(fields){
  const fieldsList= fields.split(',').map(f => f.trim())
  if(!fieldsList.includes('image')) {
    fieldsList.push('image')
  }
  result= result.select(fieldsList.join(' '))
 }

const page= Number(req.query.page) || 1
const limit= Number(req.query.limit) || 10
const skip= (page - 1) * limit

result= result.limit(limit).skip(skip)

 const products= await result
 res.status(200).json({products, nbHits: products.length})
}

module.exports= getAllProducts  