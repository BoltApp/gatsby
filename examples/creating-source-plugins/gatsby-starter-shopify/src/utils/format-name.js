export const formatName = (name) => {
  const nameMap = JSON.parse(name);
  return nameMap ? nameMap.default : ""
}