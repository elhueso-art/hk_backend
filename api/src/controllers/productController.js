
const productService = require('../services/productService');


const createProduct = async (req, res) => { try {
const product = await productService.createProduct(req.body);


res.status(201).json({ status: 'success', data: product }); } catch (error) {
res.status(400).json({ status: 'error', message: error.message

}); }

};



module.exports = { createProduct,
};
