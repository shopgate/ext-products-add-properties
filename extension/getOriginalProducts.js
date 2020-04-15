const getApiClient = require('./api/getApiClient')

/**
 * @param {Object} context
 * @param {{ cartItems }} input
 * @returns {Promise<{products: Object[]}>}
 */
module.exports = async (context, { cartItems: inputCartItems }) => {
  const cartProducts = inputCartItems.filter(cartItem => cartItem.type === 'product')

  let products = cartProducts
    .filter(cartItem => !!cartItem.product.shopItem)
    .map(cartItem => cartItem.product.shopItem)

  const withoutShopItem = cartProducts.filter(cartItem => !cartItem.product.shopItem)
  if (withoutShopItem.length) {
    const productIds = withoutShopItem.map(cartItem => encodeURIComponent(cartItem.product.id))

    const apiClient = getApiClient(context)

    try {
      const { body: { collection = [] } } = await apiClient.request({
        service: 'product',
        version: 'v1',
        path: `${context.meta.appId.split('_')[1]}/products`,
        method: 'GET',
        query: {
          productNumbers: productIds.join(',')
        }
      })

      products = products.concat(collection)
    } catch (err) {
      context.log.warn(err, 'Error requesting bigapi for original products')
    }
  }

  return {
    products
  }
}
