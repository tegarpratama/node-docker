const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

exports.signup = async (req, res, next) => {
  const { username, password } = req.body
  const hashPassword = await bcrypt.hash(password, 12)

  try {
    const newUser = await User.create({
      username,
      password: hashPassword,
    })

    req.session.user = newUser

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
    })
  }
}

exports.login = async (req, res, next) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      })
    }

    const isCorrect = await bcrypt.compare(password, user.password)

    if (!isCorrect) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      })
    }

    req.session.user = user

    res.status(200).json({
      status: 'success',
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
    })
  }
}
