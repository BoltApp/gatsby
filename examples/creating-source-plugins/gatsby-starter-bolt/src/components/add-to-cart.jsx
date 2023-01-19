import * as React from "react"
import { StoreContext } from "../context/store-context"
import { addToCart as addToCartStyle } from "./add-to-cart.module.css"
import { selectBoltProductID } from "../utils/select-bolt-id"

export function AddToCart({ product, quantity, available, ...props }) {
  const { addVariantToCart, loading } = React.useContext(StoreContext)

  const publisherKey = "b61b9342d84f5a7c9aeea9b09574d16c"
  const buttonUrlBase = "https://connect-staging.bolt.com"
  const boltProductID = selectBoltProductID(product)

  function addToCart(e) {
    e.preventDefault()
    window.location.href=`${buttonUrlBase}/product_checkout.html?merchant_division_id=${product.merchant_division_public_id}&publisher_key=${publisherKey}&bolt_product_id=${boltProductID}`
  }

  return (
    <button
      type="submit"
      className={addToCartStyle}
      onClick={addToCart}
      disabled={!available || loading}
      {...props}
    >
      {available ? "Checkout" : "Out of Stock"}
    </button>
  )
}
