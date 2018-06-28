import { handleActions } from 'redux-actions'
import { INCREMENT, DECREMENT, ASYNC_INCREMENT,SET_PRODUCT_TYPES,SET_CHECKED_TYPE } from '../types/counter'

export default handleActions({
  [INCREMENT] (state) {
    return {
      ...state,
      num: state.num + 1
    }
  },
  [DECREMENT] (state) {
    return {
      ...state,
      num: state.num - 1
    }
  },
  [ASYNC_INCREMENT] (state, action) {
    return {
      ...state,
      asyncNum: state.asyncNum + action.payload
    }
  },

  [SET_PRODUCT_TYPES] (state, action) {
    var productTypes = action.payload;
    for(var items of productTypes){
      items.checked = false;
      if(items.productChild && items.productChild.length > 0){
        for(var product of items.productChild){
          product.checked = false;
        }
      }
    }
    return {
      ...state,
      productTypes: productTypes
    }
  },
  [SET_CHECKED_TYPE] (state, action) {
    let productTypes = state.productTypes;
    productTypes[action.payload].checked = !productTypes[action.payload].checked;
    console.log(productTypes)
    return {
      ...state,
      productTypes: productTypes
    }
  },




}, {
  num: 0,
  asyncNum: 0,
  productTypes:[]
})