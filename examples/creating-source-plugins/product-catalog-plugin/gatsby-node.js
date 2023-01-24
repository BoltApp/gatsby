const { ApolloClient, InMemoryCache, gql, split, HttpLink } = require("@apollo/client")
const { getMainDefinition } = require("@apollo/client/utilities")
const fetch = require("node-fetch")

const POST_NODE_TYPE = `Product`

const client = new ApolloClient({
  link: new HttpLink({
      uri: "https://hasura.staging-bolt.me/v1/graphql",
      fetch,
    }),
  cache: new InMemoryCache(),
})

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type ProductPrice {
      list_price: Int!
    }
    type ProductMedia {
      url: String!
    }
    type AuthorJson implements Node @dontInfer {
      bolt_product_id: String
      parent_bolt_product_id: String!
      name: String!
      merchant_division_public_id: String!
      url: String!
      description: String!
      product_type: String!
      product_prices: [ProductPrice!]!
      product_media: [ProductMedia!]!
    }
  `
  createTypes(typeDefs)
}

exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
  getNodesByType,
  cache,
}, pluginOptions) => {
  const { createNode } = actions

  var lastFetched = await cache.get(`timestamp`)
  var catalog = await cache.get(`catalog`);
  if (!catalog) {
    lastFetched = "1900-01-01" // set a init timestamp
  }
  var today = new Date();
  const newTimestamp = today.toISOString()

  const { data } = await client.query({
    query: gql`
      query {
        products(where: {_and: {merchant_division_public_id: {_eq: "${pluginOptions.merchantPublicID}"}, updated_at: {_gt: "${lastFetched}"}}}) {
          bolt_product_id
          parent_bolt_product_id
          name
          merchant_division_public_id
          id
          url
          description
          product_type
          product_prices {
            list_price
          }
          product_media(where: {is_primary: {_eq: true}}) {
            url
          }
        }
      }
    `,
  })

  // loop through products to create parent child relationship
  var productMap = {};
  data.products.forEach(product => {
    if (product.parent_bolt_product_id !== null) {
      if (productMap.hasOwnProperty(product.parent_bolt_product_id)) {
        var size = productMap[product.parent_bolt_product_id].length
        productMap[product.parent_bolt_product_id][size] = product.bolt_product_id
      }else {
        productMap[product.parent_bolt_product_id] = [product.bolt_product_id]
      }
    }
  })

  if (catalog) {
    catalog.forEach(product =>
      createNode({
        ...product,
        id: product.bolt_product_id,
        parent: product.parent_bolt_product_id,
        children: productMap[product.bolt_product_id],
        internal: {
          type: POST_NODE_TYPE,
          contentDigest: createContentDigest(product),
        },
      })
    )
  }

  data.products.forEach(product =>
    createNode({
      ...product,
      id: product.bolt_product_id,
      parent: product.parent_bolt_product_id,
      children: productMap[product.bolt_product_id],
      internal: {
        type: POST_NODE_TYPE,
        contentDigest: createContentDigest(product),
      },
    })
  )

  // set up caching
  if (catalog) {
    await cache.set(`catalog`, catalog.concat(data.products))
  } else {
    await cache.set(`catalog`, data.products)
  }
  await cache.set(`timestamp`, newTimestamp)

  return
}