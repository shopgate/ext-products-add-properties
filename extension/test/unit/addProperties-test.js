const assert = require('assert')
const proxyquire = require('proxyquire')

const getProductsResult = () => ({
  products: [
    {
      id: '1',
      properties: [
        {
          label: 'added',
          value: 'added'
        },
        {
          label: 'ignored',
          value: 'ignored'
        },
        {
          label: 'foo',
          value: 'bar'
        }
      ]
    }
  ]
})

describe('addProperties', () => {
  it('should add properties if they are configured', async () => {
    let subjectUnderTest = proxyquire('./../../addProperties', {
      './config': {
        addProperties: 'foo,added'
      }
    })

    const { products } = await subjectUnderTest({}, getProductsResult())
    assert.deepEqual(products[0].additionalProperties, [
      {
        label: 'added',
        value: 'added'
      },
      {
        label: 'foo',
        value: 'bar'
      }
    ])
  })

  it('should not do anything if no property is matched', async () => {
    let subjectUnderTest = proxyquire('./../../addProperties', {
      './config': {
        addProperties: 'nomatch,nonomatch'
      }
    })

    const { products } = await subjectUnderTest({}, getProductsResult())
    assert.deepEqual({ products }, getProductsResult())
  })

  it('should not do anything if no property is configured to be added', async () => {
    let subjectUnderTest = proxyquire('./../../addProperties', {
      './config': {
        addProperties: ''
      }
    })

    const { products } = await subjectUnderTest({}, getProductsResult())
    assert.deepEqual({ products }, getProductsResult())
  })
})
