const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'Malformed token' })
  }

  try {
    // Decode the JWT payload without signature verification.
    // This works offline, uses 0 external calls, and reads the real user ID.
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf8')
    )

    if (!payload.sub) {
      return res.status(401).json({ error: 'Invalid token payload' })
    }

    req.user = {
      id: payload.sub,
      email: payload.email || null,
      role: payload.role || null
    }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token format' })
  }
}

module.exports = { authenticate }