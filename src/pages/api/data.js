import { data, mobile_phones, laptops, tablets } from '../../data'

export default (req, res) => {
  const id = parseInt(req.query.id)
  const page = req.query.page
  const limit = req.query.limit

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  if (req.query.category === 'mobile_phones') {
    const result = mobile_phones.slice(startIndex, endIndex)
    res.status(200).json(result)
  } else if (req.query.category === 'laptops') {
    const result = laptops.slice(startIndex, endIndex)
    res.status(200).json(result)
  } else if (req.query.category === 'tablets') {
    const result = tablets.slice(startIndex, endIndex)
    res.status(200).json(result)
  } else if (req.query.category === 'best_offers') {
    const result = data.filter(dataItem => dataItem.price === 250)
    res.status(200).json(result)
  } else if (req.query.category === 'search') {
    const searchResults = data.filter(dataItem =>
      dataItem.title
        .toLowerCase()
        .includes(req.query.value.toLowerCase().trim())
    )
    res.status(200).json(searchResults)
  } else if (req.query.category === 'object') {
    const result = data.find(dataItem => dataItem.id === id)
    res.status(200).json(result)
  } else if (req.method === 'PATCH') {
    const reviewedItem = data[id].reviews.find(i => i.id === id)
    if (reviewedItem !== undefined) {
      reviewedItem = req.body
    }
    data[id].reviews.push(req.body)
    const itemReview = {
      user: req.body.user,
      review: req.body.review
    }
    res.status(200).json(itemReview)
  } else if (req.method === 'DELETE') {
    const reviewedItem = data[id].reviews.find(i => i.id === id)
    reviewedItem.filter(i => i.user !== req.query.user)
  } else {
    res.status(200).json(data)
  }
}
