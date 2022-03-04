import React, { useContext, useState, useEffect } from 'react'
import { TextField, Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import {v4 as uuidv4} from 'uuid'

import formatDate from '../../../utilities/formatDate'
import { incomeCategories, expenseCategories } from '../../../constants/categories'

import { useSpeechContext } from '@speechly/react-client'
import { ExpenseTrackerContext } from '../../../context/context'

import CustomSnackBar from '../../Snackbar/SnackBar'

import useStyles from './styles'

const initialState = {
  amount: '',
  category: '',
  type: 'Income',
  date: formatDate(new Date())
}

const Form = () => {
  // Clases css
  const classes = useStyles()
  // State
  const [formData, setFormData] = useState(initialState)
  const [open, setOpen] = useState(false)
  // Contexto 
  const { createTrasaction } = useContext(ExpenseTrackerContext)
  // Contexto de speechly
  const { segment } = useSpeechContext()

  const addTransaction = () => {
    if (Number.isNaN(Number(formData.amount)) || !formData.date.includes('-')) return;
    const transaction = {
      ...formData,
      amount: Number(formData.amount),
      id: uuidv4()
    }

    setOpen(true)
    createTrasaction(transaction)
    setFormData(initialState)
  }

  const selectedCategories = formData.type === 'Income' ? incomeCategories : expenseCategories

  // Logica para agregar o cancelar una transaction con speechly, efecto se ejecutara cada vez que segment cambie 
  useEffect(() => {
    // Si existe segmento de voz verifico que tipo y lo asigno al estado del form
    if(segment) {
      if(segment.intent.intent === 'add_expense') {
        setFormData({ ...formData, type: 'Expense' })
      } else if(segment.intent.intent === 'add_income') {
        setFormData({ ...formData, type: 'Income' })
      } else if(segment.isFinal && segment.intent.intent === 'create_transaction') {
        return addTransaction()
      } else if(segment.isFinal && segment.intent.intent === 'cancel_transaction') {
        return setFormData(initialState)
      }
      // e = entity
      // itero el segmento de voz
      segment.entities.forEach((e) => {
        const category = `${e.value.charAt(0)}${e.value.slice(1).toLowerCase()}`
        // en cada iteracion verifico que el tipo dicho por voz sea correcto y lo asigno a cada campo del form
        switch (e.type) {
          // asigno el amount por voz 
          case 'amount':
            setFormData({ ...formData, amount: e.value })
            break;
          case 'category':
            // Verifico si la categoria dicha es correcta de no ser asi le asigno la categoria al tipo correspondiente(Expense o Income) 
             if (incomeCategories.map((iC) => iC.type).includes(category)) {
              setFormData({ ...formData, type: 'Income', category });
            } else if (expenseCategories.map((iC) => iC.type).includes(category)) {
              setFormData({ ...formData, type: 'Expense', category });
            }
            break;
          // asigno la date dicha por voz
          case 'date':
            setFormData({ ...formData, date: e.value })
            break;
        
          default:
            break;
        }
      })
      // cuando todos los campos del form esten agrega la transaccion por voz
      if (segment.isFinal && formData.amount && formData.category && formData.type && formData.date) {
        addTransaction();
      }
    }
  }, [segment])
  

  return (
    <Grid container spacing={2}>
      <CustomSnackBar open={open} setOpen={setOpen} />
      <Grid item xs={12}>
        <Typography align='center' variant='subtitle2' gutterBottom>
          {segment && segment.words.map((w) => w.value).join(" ")}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
              <MenuItem value='Income'>Income</MenuItem>
              <MenuItem value='Expense'>Expense</MenuItem>
            </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
              {selectedCategories.map((category) => <MenuItem key={category.type} value={category.type}>{category.type}</MenuItem>)}
            </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
          <TextField type='number' label='Amount' fullWidth value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})}/>
      </Grid>
      <Grid item xs={6}>
          <TextField fullWidth label="Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: formatDate(e.target.value) })} />
      </Grid>
      <Button className={classes.button} variant='outlined' color='primary' fullWidth onClick={addTransaction}>
        Create
      </Button>
    </Grid>
  )
}


export default Form