const express = require('express')
const { evaluateIntake } = require('../controllers/intakeController')
const { authenticate } = require('../middleware/auth')
const router = express.Router()
router.post('/evaluate', authenticate, evaluateIntake)
module.exports = router