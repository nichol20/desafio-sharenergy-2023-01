import express from 'express'
import { ClientController } from '../controllers/ClientController'
import { mustBeAuthenticated } from '../middlewares/auth'

export const clientRoutes = express.Router()

clientRoutes.post('/clients', mustBeAuthenticated, async (req, res) => {
  const { name, email, phone, address, cpf } = req.body

  const clientController = new ClientController

  const newClient = await clientController.addNew({ 
    name: name || '',
    email: email || '',
    phone: phone || '',
    address: address || '',
    cpf: cpf || ''
  }, req.authorId!)

  return res.status(201).json(newClient)
})

clientRoutes.get('/clients', mustBeAuthenticated, async (req, res) => {
  const clientController = new ClientController
  const clients = await clientController.findAll(req.authorId!)

  return res.status(200).json(clients)
})

clientRoutes.get('/clients/:clientId', mustBeAuthenticated, async (req, res) => {
  const { clientId } = req.params
  const clientController = new ClientController

  const client = await clientController.findOne(clientId, req.authorId!)

  if(!client) return res.status(404).json({ message: 'Client not found' })

  return res.status(200).json(client)
})


clientRoutes.patch('/clients/:clientId', mustBeAuthenticated, async (req, res) => {
  const { name, email, phone, address, cpf } = req.body
  const { clientId } = req.params
  const clientController = new ClientController

  const client = await clientController.updateOne({
    ...name && { name },
    ...email && { email },
    ...phone && { phone },
    ...address && { address },
    ...cpf && { cpf },
    id: clientId
  }, req.authorId!)

  if(!client) return res.status(404).json({ message: 'Client not found' })

  return res.status(200).json({ ...client })
})

clientRoutes.delete('/clients/:clientId', mustBeAuthenticated, async (req, res) => {
  const { clientId } = req.params

  const clientController = new ClientController

  await clientController.delete(clientId, req.authorId!)

  return res.status(200).json({ message: 'Successfully deleted' })
})