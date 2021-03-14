import numeral from 'numeral'

const formatYen = (price) => `¥${numeral(price).format('0,0')}`

export { formatYen }

export default {
  formatYen,
}
