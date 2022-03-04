import { useContext } from 'react';
import { ExpenseTrackerContext } from '../context/context'

import { incomeCategories, expenseCategories, resetCategories } from '../constants/categories';

const useTransaction = (title) => {
  // Reseteo todos los amount de las categorias a 0
  resetCategories()
  // Obtengo todas las transacciones que hayan en el contexto 
  const { transactions } = useContext(ExpenseTrackerContext);
  // Filtro las trasacciones por tipo dependiendo del title devuelve transacciones de Income o Expense
  const transactionPerType = transactions.filter((transaction) => transaction.type === title)
  // Obtengo el total de las trasacciones por su tipo si es en Income total de income si no total de Expense 
  const total = transactionPerType.reduce((acc, currentVal) => acc += currentVal.amount, 0)
  // Verifico que categorias hay segun el title si el title es Income dame todas las categorias que haya
  const categories = title === 'Income' ? incomeCategories : expenseCategories

  // t = transactionType c = category
  // Itero sobre todas las trasacciones por tipo que hay
  transactionPerType.forEach(t => {
    // en el find devuelvo la primera coincidencia que cumpla la condicion en cada vuelta del bucle
    const category = categories.find(c => c.type === t.category)

    // Si dentro de category encontro la coincidencia sumo los amount en cada vuelta del bucle
    if(category) {
      category.amount += t.amount
    }
  })
  
  // Devuelve solo la categoria que sea mayor a 0 si es 0 la descarta
  const filteredCategories = categories.filter(c => c.amount > 0)

  // Contruyo la data que ira en el Chart
  const ChartData = {
    datasets: [{
      data: filteredCategories.map(c => c.amount),
      backgroundColor: filteredCategories.map(c => c.color)
    }],
    labels: filteredCategories.map(c => c.type)
  } 

  // Retorno que usare en los componentes que lo necesiten
  return { total, ChartData }
}

export default useTransaction