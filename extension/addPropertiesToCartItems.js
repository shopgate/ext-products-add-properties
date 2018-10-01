module.exports = async (context, input) => {
  const { config } = context
  let { cartItems } = input

  const addProperties = config.addProperties.split(',').filter(val => val).map(val => val.toLowerCase())

  if (addProperties.length === 0) return { cartItems }

  cartItems = cartItems.map(cartItem => {
    if (!cartItem.product || !cartItem.product.shopItem) return cartItem

    const additionalProperties = cartItem.product.shopItem.properties.filter(prop =>
      addProperties.includes(prop.label.toLowerCase())
    )

    if (additionalProperties.length) { Object.assign(cartItem.product, { additionalProperties }) }

    return cartItem
  })

  return { cartItems }
}
