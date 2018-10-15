module.exports = async (context, input) => {
  const { config } = context
  let { products } = input

  const addProperties = config.addProperties.split(',').filter(val => val).map(val => val.toLowerCase())

  if (addProperties.length === 0 || products.length === 0) return

  const product = products[0]

  return { additionalProperties: product.additionalProperties }
}
