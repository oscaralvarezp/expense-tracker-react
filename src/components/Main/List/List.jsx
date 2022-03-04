// 4. Para hacer uso del contexto debemos importar primero el hook useContext y luego importar la variable que tiene el createContext

import React, { useContext } from 'react'
import { ExpenseTrackerContext } from '../../../context/context'

import { List as ListMUI, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemSecondaryAction, IconButton, Slide } from '@material-ui/core'
import { Delete, MoneyOff } from '@material-ui/icons'

import useStyles from './styles'


const List = () => {
  // Hacer uso de la data y funciones del contexto con useContext:
  const { deleteTrasaction, transactions } = useContext(ExpenseTrackerContext)
  const classes = useStyles()

  return (
    <ListMUI dense={false} className={classes.list}>
      {transactions.map((transaction) =>(
        <Slide direction='down' in mountOnEnter unmountOnExit key={transaction.id}>
          <ListItem>
            <ListItemAvatar>
              <Avatar 
              className={transaction.type === 'Income' ? classes.avatarIncome : classes.avatarExpense}>
                <MoneyOff />
              </Avatar>
            </ListItemAvatar>
            <ListItemText 
              primary={transaction.category} 
              secondary={`$${transaction.amount} - ${transaction.date}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge='end' aria-label='delete' onClick={() => deleteTrasaction(transaction.id)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </Slide>
      ))}
    </ListMUI>
  )
}

export default List