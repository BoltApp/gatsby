import * as React from "react"
import { graphql, Link } from "gatsby"
import { formatPrice } from "../utils/format-price"
import {
  productCardStyle,
  productHeadingStyle,
  productImageStyle,
  productDetailsStyle,
  productPrice,
} from "./product-card.module.css"
import { formatName } from "../utils/format-name"
import { selectImage } from "../utils/select-image"

export function ProductCard({ product, eager }) {
  const {
    id,
    name,
    product_prices: [firstPrice],
    product_media,
  } = product

  const price = formatPrice(
    "USD",
    firstPrice.list_price / 100
  )

  const defaultName = formatName(name)

  const defaultImageHeight = 200
  const defaultImageWidth = 200

  const hasImage = selectImage(product_media, "medium")

  return (
    <Link
      className={productCardStyle}
      aria-label={`View ${id} product page`}
      to={`/products/${id}`}
    >
      {hasImage
        ? (
          <div className={productImageStyle} data-name="product-image-box">
            <img alt={id} src={hasImage?.url}/>
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
