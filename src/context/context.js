import React, { useReducer, createContext } from 'react'
import contextReducer from './contextReducer'

//1. Crear el Contexto
const initialState = JSON.parse(localStorage.getItem('transactions')) || [
  {amount: 100, category: "Travel", type: "Expense", date: "2022-02-28", id: "e5da723a-b030-4b75-89df-ca24c03288a3"}
]
export const ExpenseTrackerContext = createContext(initialState)

// 2. Crear el Provider con un fuctional Component
export const Provider = ({ children }) => { 
  /* 
    transactions: es una variable donde estara almacenada toda la data del reducer
    dispatch: funcion que actualiza el estado dependiendo del nombre de una acción
    contextReducer: es una funcion que especificara como estara cambiando el estado 
    initialState: es el estado inicial que tendra el reducer
  */
  const [transactions, dispatch] = useReducer(contextReducer, initialState)
  
  // Acciones del Reducer
  // dispatch({type:'ActionType', payload: data})
  // type: es el nombre que recibira la accion, para usarla en contextReducer, dependiendo del nombre de la accion hare una cosa u otra.
  // payload: es la data que estara utilizando contextReducer

  const deleteTrasaction = (id) => dispatch({ type: 'DELETE_TRANSACTION', payload: id })
  const createTrasaction = (transaction) => dispatch({ type: 'CREATE_TRANSACTION', payload: transaction })

  // Calcular el balance 
  const balance = transactions.reduce((acc, currentValue) => (currentValue.type === 'Expense' ? acc - currentValue.amount : acc + currentValue.amount), 0)

  // Aqui ira la logica que tendra el contexto
  return (
    // Todo lo que este dentro de este provider será visible en {children} 
    // Al envolver los componentes HIJOS dentro del provider podremos tener acceso a la data que tenga el contexto que estara en value.
    <ExpenseTrackerContext.Provider value={{ deleteTrasaction, createTrasaction, transactions, balance }}>
      { children }
    </ExpenseTrackerContext.Provider>
  )
}

// 3. envolver dentro del provider los componentes que quiero que tengan acceso a la data del contexto