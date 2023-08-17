const express = require('express')

const router = express.Router()

const { listContacts } = require("../../models/contacts");

router.get('/api/contacts', async (req, res, next) => {
const data = listContacts();
  res.json({ 
    status: 'success',
    code: 200,
    data: {
      data
    }
   })
})

router.get('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router

