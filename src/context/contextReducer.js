// Reducer => es una funcion que tomá el valor anterior del estado, y una action(En ella se especificará como quieres que el estado cambie) => y la funcion retornara un nuevo estado
const contextReducer = (oldState, action) => {
  let newState
  // 1. verifico el type name de la action 
  switch (action.type ) {
    case 'DELETE_TRANSACTION':
      // Logica para eliminar una trasaction
      newState = oldState.filter((transaction) => transaction.id !== action.payload)
      localStorage.setItem('transactions', JSON.stringify(newState))
      
      return newState
      
      case 'CREATE_TRANSACTION':
        // Logica para crear una trasaction
        newState = [action.payload, ...oldState]
        localStorage.setItem('transactions', JSON.stringify(newState))
        
        return newState
    default:
      return oldState
    }
}

export default contextReducer