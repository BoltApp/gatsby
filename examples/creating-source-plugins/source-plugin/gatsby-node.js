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
        products(where: {_and: {merchant_division_public_id: {_eq: "${pluginOptions.merchantPublicID}"}, product_type: {_eq: "simple"}}}) {
          bolt_product_id
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

  // loop through data and create Gatsby nodes
  data.products.forEach(product =>
    createNode({
      ...product,
      id: createNodeId(`${POST_NODE_TYPE}-${product.id}`),
      parent: null,
      children: [],
      internal: {
        type: POST_NODE_TYPE,
        contentDigest: createContentDigest(product),
      },
    })
  )

  return
}