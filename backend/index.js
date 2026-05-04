const express = require('express')
const cors = require('cors')
require('dotenv').config()

const intakeRoutes = require('./routes/intakeRoutes')
const routeRoutes = require('./routes/routeRoutes')
const chatRoutes = require('./routes/chatRoutes')

const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.options('*', cors())
app.use(express.json({ limit: '1mb' }))

app.use('/api/intake', intakeRoutes)
app.use('/api/routes', routeRoutes)
app.use('/api/chat', chatRoutes)   // ✅ ADDED

app.get('/health', (req, res) => res.send('OK'))

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`))