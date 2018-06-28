import { ASYNC_INCREMENT,SET_PRODUCT_TYPES,SET_CHECKED_TYPE } from '../types/counter'
import { createAction } from 'redux-actions'

export const asyncInc = createAction(ASYNC_INCREMENT, () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(1)
    }, 1000)
  })
})


export const setProductTypes = createAction(SET_PRODUCT_TYPES, (data) => {
  return new Promise(resolve => {
      resolve(data)
  })
})


export const setCheckedType = createAction(SET_CHECKED_TYPE, (index) => {
  return new Promise(resolve => {
      resolve(index)
  })
})






