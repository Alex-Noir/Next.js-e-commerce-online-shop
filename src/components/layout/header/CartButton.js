import React, { useContext } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { DivIconAmountInCart } from '../../../styles'
import Context from '../../../context'

export default function CartButton() {
  const { cartList } = useContext(Context)

  return (
    <Link href="/cart">
      <a>
        <FontAwesomeIcon icon={faShoppingCart} width="1em" />
        {
          cartList.length > 0
          ? <DivIconAmountInCart>
              {cartList.length}
            </DivIconAmountInCart>
          : null
        }
      </a>
    </Link>
  )
}
