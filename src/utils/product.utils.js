const checkProductSimilarity = (
    productDetails,
    description,
    name,
    price,
    stock,
    category
) =>{
    return (
        productDetails.description === description,
        productDetails.name === name,
        productDetails.price === price,
        productDetails.stock === stock,
        productDetails.category === category
    )
}

module.exports = {
    checkProductSimilarity
}