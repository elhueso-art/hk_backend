const Product = require('../models/Product');
const createProduct = async (productData) => { const newProduct = new Product(productData);
 
return await newProduct.save();

};

module.exports = { createProduct,
};
