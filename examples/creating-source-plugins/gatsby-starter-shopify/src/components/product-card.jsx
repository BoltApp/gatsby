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
    firstPrice.list_price
  )

  const defaultImageHeight = 200
  const defaultImageWidth = 200
  let storefrontImageData = {}

  const hasImage = firstImage || Object.getOwnPropertyNames(storefrontImageData || {}).length

  return (
    <Link
      className={productCardStyle}
      aria-label={`View ${name} product page`}
    >
      {hasImage
        ? (
          <div className={productImageStyle} data-name="product-image-box">
            <GatsbyImage
              alt={firstImage?.altText ?? name}
              image={firstImage?.gatsbyImageData ?? storefrontImageData}
              loading={eager ? "eager" : "lazy"}
            />
          </div>
        ) : (
          <div style={{ height: defaultImageHeight, width: defaultImageWidth }} />
        )
      }
      <div className={productDetailsStyle}>
        <h2 as="h2" className={productHeadingStyle}>
          {name}
        </h2>
        <div className={productPrice}>{price}</div>
      </div>
    </Link>
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
