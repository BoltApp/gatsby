export const selectBoltProductID = (product) => {
  if (product.children[0]) {
    return product.children[0].id
  } else {
    return product.id
  }
}