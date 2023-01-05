const { ApolloClient, InMemoryCache, gql, split, HttpLink } = require("@apollo/client")
const { getMainDefinition } = require("@apollo/client/utilities")
const fetch = require("node-fetch")

const POST_NODE_TYPE = `Product`

const client = new ApolloClient({
  link: new HttpLink({
      uri: "https://hasura.staging-bolt.me/v1/graphql", // or `https://gatsby-source-plugin-api.glitch.me/`
      fetch,
    }),
  cache: new InMemoryCache(),
})

exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
  getNodesByType,
}, pluginOptions) => {
  const { createNode } = actions

  const { data } = await client.query({
    query: gql`
      query {
        products(where: {_and: {merchant_division_public_id: {_eq: "${pluginOptions.merchantPublicID}"}}}) {
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

  return
}