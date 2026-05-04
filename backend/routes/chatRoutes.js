const express = require('express')
const { sendMessage, deleteConversation } = require('../controllers/chatController')
const { authenticate } = require('../middleware/auth')

const router = express.Router()

router.post('/message', authenticate, sendMessage)
router.delete('/conversations/:id', authenticate, deleteConversation)

module.exports = router