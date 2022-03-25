export default function dateFormat (date) {
  date = new Date(date)
  return `
  ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}
  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
  `
}
