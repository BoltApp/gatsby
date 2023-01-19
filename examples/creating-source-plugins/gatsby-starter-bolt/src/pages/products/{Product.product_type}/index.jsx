import * as React from "react"
import { graphql } from "gatsby"
import { Layout } from "../../../components/layout"
import { ProductListing } from "../../../components/product-listing"
import { Seo } from "../../../components/seo"
import { MoreButton } from "../../../components/more-button"
import { title } from "../index.module.css"

export default function ProductTypeIndex({
  data: { products },
  pageContext: { product_type },
}) {
  return (
    <Layout>
      <h1 className={title}>{product_type}</h1>
      <ProductListing products={products.nodes} />
      {products.pageInfo.hasNextPage && (
        <MoreButton to={`/search`}>
          More Products
        </MoreButton>
      )}
    </Layout>
  )
}

export const Head = ({ pageContext: { product_type } }) => (
  <Seo title={`Category: ${product_type}`} />
)

export const query = graphql`
  query ($product_type: String!) {
    products: allProduct(
      filter: { product_type: { eq: $product_type } }
      limit: 24
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`
