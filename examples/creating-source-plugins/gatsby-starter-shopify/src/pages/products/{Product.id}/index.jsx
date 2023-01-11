import * as React from "react"
import { graphql, Link } from "gatsby"
import { Layout } from "../../../components/layout"
import isEqual from "lodash.isequal"
import { GatsbyImage, getSrc } from "gatsby-plugin-image"
import { StoreContext } from "../../../context/store-context"
import { AddToCart } from "../../../components/add-to-cart"
import { NumericInput } from "../../../components/numeric-input"
import { formatPrice } from "../../../utils/format-price"
import { Seo } from "../../../components/seo"
import { CgChevronRight as ChevronIcon } from "react-icons/cg"
import {
  productBox,
  container,
  header,
  productImageWrapper,
  productImageList,
  productImageListItem,
  scrollForMore,
  noImagePreview,
  optionsWrapper,
  priceValue,
  selectVariant,
  labelFont,
  breadcrumb,
  tagList,
  addToCartStyle,
  metaSection,
  productDescription,
} from "./product-page.module.css"
import { formatName } from "../../../utils/format-name"
import { selectImage } from "../../../utils/select-image"


export default function Product({ data: { product, suggestions } }) {
  const {
    id,
    name,
    product_prices: [firstPrice],
    product_media,
    children,
    description,
  } = product.nodes[0]

  const [quantity, setQuantity] = React.useState(1)

  const price = formatPrice(
    "USD",
    firstPrice.list_price / 100
  )
  const defaultName = formatName(name)
  const defaultDescription = formatName(description)

  const hasImages = product_media.length > 0
  const hasMultipleImages = true || product_media.length > 1
  const image = selectImage(product_media, "large")
  const options = []

  return (
    <Layout>
      <div className={container}>
        <div className={productBox}>
          {hasImages && (
            <div className={productImageWrapper}>
              <div
                role="group"
                aria-label="gallery"
                aria-describedby="instructions"
              >
                <ul className={productImageList}>
                  {(
                    <li
                      key={`product-image-${id}`}
                      className={productImageListItem}
                    >
                      <img src={image.url}></img>
                    </li>
                  )}
                </ul>
              </div>
              {hasMultipleImages && (
                <div className={scrollForMore} id="instructions">
                  <span aria-hidden="true">←</span> scroll for more{" "}
                  <span aria-hidden="true">→</span>
                </div>
              )}
            </div>
          )}
          {!hasImages && (
            <span className={noImagePreview}>No Preview image</span>
          )}
          <div>
            <div className={breadcrumb}>
              <Link to={product.productTypeSlug}>{product.productType}</Link>
              <ChevronIcon size={12} />
            </div>
            <h1 className={header}>{defaultName}</h1>
            <p className={productDescription}>{defaultDescription}</p>
            <h2 className={priceValue}>
              <span>{price}</span>
            </h2>
            <fieldset className={optionsWrapper}>
              {
                options.map(({ id, name, values }, index) => (
                  <div className={selectVariant} key={id}>
                    <select
                      aria-label="Variants"
                    >
                      <option value="">{`Select ${name}`}</option>
                      {values.map((value) => (
                        <option value={value} key={`${name}-${value}`}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
            </fieldset>
            <div className={addToCartStyle}>
              <NumericInput
                aria-label="Quantity"
                onIncrement={() => setQuantity((q) => Math.min(q + 1, 20))}
                onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
                onChange={(event) => setQuantity(event.currentTarget.value)}
                value={quantity}
                min="1"
                max="20"
              />
              <AddToCart
                product={product.nodes[0]}
                quantity={quantity}
                available={true}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const Head = ({ data: { product } }) => {
  const {
    name,
    description,
    //product_media: [firstImage],
  } = product

  return (
    <>
      {(
        <Seo
          title={name}
          description={description}
        />
      )}
    </>
  )
}

export const query = graphql`
  query($id: String!) {
    product: allProduct(
      filter: {id: { eq: $id }}
    ) {
      nodes {
        ...ProductCard
      }
    }
    suggestions: allProduct(
      limit: 3
      filter: { id: { ne: $id } }
    ) {
      nodes {
        ...ProductCard
      }
    }
  }
`