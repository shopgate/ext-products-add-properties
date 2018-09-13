const config = require('./config')

module.exports = async (context, input) => {
  let { products } = input

  const addProperties = config.addProperties.split(',').filter(val => val)

  if (addProperties.length === 0) return { products }

  products = products.map(product => {
    const additionalProperties = product.properties.filter(prop =>
      addProperties.includes(prop.label)
    )

    if (additionalProperties.length) { return Object.assign(product, { additionalProperties }) }

    return product
  })

  return { products }
}
