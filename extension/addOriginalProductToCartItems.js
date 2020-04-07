const getApiClient = require('./api/getApiClient')

/**
 * @param {Object} context
 * @param {{ cartItems }} input
 * @returns {Promise<{cartItems: *}>}
 */
module.exports = async (context, { cartItems: inputCartItems }) => {
  const withoutShopItem = inputCartItems.filter(cartItem => !cartItem.product.shopItem)
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

      withoutShopItem.forEach(cartItem => {
        cartItem.product.shopItem = collection.find(p => p.id === cartItem.product.id)
      })
    } catch (err) {
      context.log.warn(err, 'Error requesting bigapi for original products')
    }
  }

  return {
    cartItems: inputCartItems
  }
}
