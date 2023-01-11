import * as React from "react"
import { graphql } from "gatsby"
import { formatPrice } from "../utils/format-price"
import {
  productCardStyle,
  productHeadingStyle,
  productImageStyle,
  productDetailsStyle,
  productVendorStyle,
} from "./product-card.module.css"
import { formatName } from "../utils/format-name"
import { selectImage } from "../utils/select-image"
import { selectBoltProductID } from "../utils/select-bolt-id"

const publisherKey = "b61b9342d84f5a7c9aeea9b09574d16c"
const buttonUrlBase = "https://connect-staging.bolt.com"

export function ProductCard({ product, eager }) {
  const {
    id,
    name,
    description,
    product_prices: [firstPrice],
    product_media,
  } = product

  const price = formatPrice(
    "USD",
    firstPrice.list_price / 100
  )

  const defaultName = formatName(name)
  const defaultDescription = formatName(description)
  const boltProductID = selectBoltProductID(product)

  const defaultImageHeight = 200
  const defaultImageWidth = 200

  const hasImage = selectImage(product_media, "medium")

  return (
    <a
      className={productCardStyle}
      aria-label={`View ${id} product page`}
      href={`${buttonUrlBase}/product_checkout.html?merchant_division_id=${product.merchant_division_public_id}&publisher_key=${publisherKey}&bolt_product_id=${boltProductID}`}
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
        <p className={productVendorStyle}> {defaultDescription} </p>
        <div>{price}</div>
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
