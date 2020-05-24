import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { DivCartListItem } from '../../styles'
import Context from '../../context'

export default function CartListItem({ cartListItem }) {
  const { id,
          title, 
          company,
          amountInCart,
          price,
          hasDiscount,
          inStock,
          totalPrice } = cartListItem
  
  const { refreshCart } = useContext(Context)

  const [ currentTotalPrice, setCurrentTotalPrice ] = useState(totalPrice)

  let options = []

  for (let i = 1; i <= inStock; i++) {
    options.push(<option value={`${i}`}>{i}</option>)
  }

  useEffect(() => {
    const select = document.getElementById(`itemsOf${id}`)
    select.options[amountInCart - 1].setAttribute('selected', true)
  }, [])

  const editAmount = async (id, price) => {
    const selectedAmount = document.getElementById(`itemsOf${id}`).value
    const updTotalPrice = price * selectedAmount

    fetch(`http://localhost:3000/api/cart/${id}?type=editInCart`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        amountInCart: selectedAmount,
        totalPrice: updTotalPrice
      })
    }).then(r => {
      if (r.status >= 400) {
        return r.json().then(errResData => {
          const err = new Error('Error.')
          err.data = errResData
          throw err
        })
      }
      return r.json()
    }).then(r => {
      const storageCartList = JSON.parse(localStorage.cartList)
      const changedCartList = storageCartList.map(obj => r.find(o => o.id === obj.id) || obj)
      setCurrentTotalPrice(r[0].totalPrice)
      localStorage.setItem('cartList', JSON.stringify(changedCartList))
      refreshCart()
    })
  }

  const deleteItem = id => {
    fetch(`http://localhost:3000/api/cart/${id}?type=delete`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    }).then(r => {
      if (r.status >= 400) {
        return r.json().then(errResData => {
          const err = new Error('Error.')
          err.data = errResData
          throw err
        })
      }
      return r.json()
    }).then(r => {
      const storageCartList = JSON.parse(localStorage.cartList)
      const changedCartList = storageCartList.filter(obj => obj.id !== r[0].id)
      localStorage.setItem('cartList', JSON.stringify(changedCartList))
      refreshCart()
    })
  }

  return (
    <DivCartListItem>
      <img
        src={`/img/products/${id}/01.webp`}
        alt={title}
        height="100"
        width="100"
      />
      <div>
        <Link href="/product-page/[id].js" as={`/product-page/${id}`}>
          <a>
            <h5>{title}</h5>
          </a>
        </Link>
        <h6>
          Company: {company}
        </h6>
      </div>
      <h6>
        <label htmlFor={`itemsOf${id}`}>
          Quantity:
          <select id={`itemsOf${id}`} onChange={() => editAmount(id, price)}>
            {options}
          </select>
        </label>
      </h6>
      <h5>
        <span>Total price:</span>
        <span>
          {currentTotalPrice}
        </span>
      </h5>
      <button
        type="button"
        className="close text-danger d-inline-block"
        aria-label="Close"
        onClick={() => deleteItem(id)}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </DivCartListItem>
  )
}