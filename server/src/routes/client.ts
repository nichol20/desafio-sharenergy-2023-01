import express from 'express'
import { ClientController } from '../controllers/ClientController'
import { mustBeAuthenticated } from '../middlewares/auth'

export const clientRoutes = express.Router()

clientRoutes.post('/clients', mustBeAuthenticated, async (req, res) => {
  const { name, email, phone, address, cpf } = req.body

  const clientController = new ClientController

  try {
    const newClient = await clientController.addNew({ 
      name: name || '',
      email: email || '',
      phone: phone || '',
      address: address || '',
      cpf: cpf || ''
    }, req.authorId!)
  
    return res.status(201).json(newClient)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Something broke!' })
  }
})

clientRoutes.get('/clients', mustBeAuthenticated, async (req, res) => {
  const clientController = new ClientController

  try {
    const clients = await clientController.findAll(req.authorId!)
    return res.status(200).json(clients)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Something broke!' })
  }
})

clientRoutes.get('/clients/:clientId', mustBeAuthenticated, async (req, res) => {
  const { clientId } = req.params
  const clientController = new ClientController

  try {
    const client = await clientController.findOne(clientId, req.authorId!)
  
    if(!client) return res.status(404).json({ message: 'Client not found' })
  
    return res.status(200).json(client)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Something broke!' })
  }

})


clientRoutes.patch('/clients/:clientId', mustBeAuthenticated, async (req, res) => {
  const { name, email, phone, address, cpf } = req.body
  const { clientId } = req.params
  const clientController = new ClientController

  try {
    let newClient = {
      ...typeof(name) === 'string' && { name },
      ...typeof(email) === 'string' && { email },
      ...typeof(phone) === 'string' && { phone },
      ...typeof(address) === 'string' && { address },
      ...typeof(cpf) === 'string' && { cpf },
      id: clientId
    }
    
    const client = await clientController.updateOne(newClient, req.authorId!)
  
    if(!client) return res.status(404).json({ message: 'Client not found' })
  
    return res.status(200).json({ ...client })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Something broke!' })
  }

})

clientRoutes.delete('/clients/:clientId', mustBeAuthenticated, async (req, res) => {
  const { clientId } = req.params

  const clientController = new ClientController

  try {
    await clientController.delete(clientId, req.authorId!)
  
    return res.status(200).json({ message: 'Successfully deleted' })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Something broke!' })
  }
})