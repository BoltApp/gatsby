export const selectImage = (images, size) => {
  const sizeMap = {
    tiny: "44.58",
    small: "220.290",
    medium: "386.513",
    large: "1280.1280",
  }
  for (const image of images) {
    if (image.url && image.url.includes(sizeMap[size])) {
      return image
    }
  }
}