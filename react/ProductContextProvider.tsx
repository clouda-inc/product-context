import React, { FC, useEffect, Dispatch } from 'react'
import ProductContext from './ProductContext'
import { ProductDispatchContext } from './ProductDispatchContext'
import { useProductReducer, getSelectedItem } from './reducer'

function useProductInState(product: MaybeProduct, dispatch: Dispatch<Actions>) {
  useEffect(() => {
    if (product) {
      dispatch({
        type: 'SET_PRODUCT',
        args: { product },
      })
    }
  }, [product, dispatch])
}

function useSelectedItemFromId(skuId: string | undefined, dispatch: Dispatch<Actions>, product: MaybeProduct) {
  useEffect(() => {
    const items = (product && product.items) || []
    dispatch({
      type: 'SET_SELECTED_ITEM',
      args: { item: getSelectedItem(skuId, items) },
    })
  }, [dispatch, skuId, product])
}

const ProductContextProvider: FC<ProductAndQuery> = ({ query, product, children }) => {

  const [state, dispatch] = useProductReducer({ query, product })

  // These hooks are used to keep the state in sync with API data, specially when switching between products without exiting the product page
  useProductInState(product, dispatch)
  useSelectedItemFromId(query.skuId, dispatch, product)

  return (
    <ProductContext.Provider value={state}>
      <ProductDispatchContext.Provider value={dispatch}>
        {children}
      </ProductDispatchContext.Provider>
    </ProductContext.Provider>
  )
}

export default ProductContextProvider