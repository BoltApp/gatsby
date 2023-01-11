import * as React from "react"
import { graphql, Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { formatPrice } from "../utils/format-price"
import {
  productCardStyle,
  productHeadingStyle,
  productImageStyle,
  productDetailsStyle,
  productPrice,
} from "./product-card.module.css"
import { formatName } from "../utils/format-name"

const publishableKey = "5OWVUheleCaj.T4LcnlPkT4Ue.e93bda8a3ba796fed56d0fb0a8fe59585c9a434edef3b6e71af984ea315db3b6"
const publisherKey = "b61b9342d84f5a7c9aeea9b09574d16c"
const buttonUrlBase = "https://connect-staging.bolt.com"

export function ProductCard({ product, eager }) {
  const {
    id,
    name,
    description,
    product_prices: [firstPrice],
    product_media: [firstImage],
  } = product

  const price = formatPrice(
    "USD",
    firstPrice.list_price / 100
  )

  const defaultName = formatName(name)

  const defaultImageHeight = 200
  const defaultImageWidth = 200

  const hasImage = firstImage

  return (
    <a
      className={productCardStyle}
      aria-label={`View ${id} product page`}
      href={`${buttonUrlBase}/product_checkout.html?merchant_division_id=${product.merchant_division_public_id}&publisher_key=${publisherKey}&bolt_product_id=${product.children[0].id}`}
    >
      {hasImage
        ? (
          <div className={productImageStyle} data-name="product-image-box">
            <img alt={id} src={firstImage?.url}/>
          </div>
        ) : (
          <div style={{ height: defaultImageHeight, width: defaultImageWidth }} />
        )
      }
      <div className={productDetailsStyle}>
        <h2 as="h2" className={productHeadingStyle}>
          {defaultName}
        </h2>
        <div className={productPrice}>{price}</div>
      </div>
    </a>
  )
}

export const query = graphql`
  fragment ProductCard on Product {
    bolt_product_id
    id
    name
    merchant_division_public_id
    url
    description
    product_media {
      url
    }
    product_prices {
      list_price
    }
    children {
      id
    }
  }
`
