const express = require('express')
const { generate, getAll, getOne, toggleSaved } = require('../controllers/routeController')
const { authenticate } = require('../middleware/auth')
const router = express.Router()

// ---------- specific routes first ----------
router.post('/generate', authenticate, generate)
router.get('/', authenticate, getAll)

// Force‑generate (NO AUTH) – MUST come before the /:id wildcard
router.get('/force-generate', async (req, res) => {
  const userId = 'f58fd1ac-0c80-4b04-9b51-a01d6c5476a9'   // your known user ID
  const { generateRoutes } = require('../services/filteringService')

  const intake = {
    degreeLevel: 'Masters',
    fieldOfStudy: 'AI & Big Data',
    cgpa: 8.5,
    backlogs: 0,
    ielts: 7.0,
    budget: 3000000,
    targetCountries: [],
    maxDuration: null,
    fastTrackPR: false
  }

  try {
    const routes = await generateRoutes(userId, intake)
    res.json({ success: true, count: routes.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ---------- parameterised routes after ----------
router.get('/:id', authenticate, getOne)
router.patch('/:id/saved', authenticate, toggleSaved)

module.exports = router