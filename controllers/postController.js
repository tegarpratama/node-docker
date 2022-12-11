const Post = require('../models/postModel')

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
    })
  }
}

exports.getOnePost = async (req, res, next) => {
  try {
    const posts = await Post.findById(req.params.id)

    res.status(200).json({
      status: 'success',
      data: {
        posts,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
    })
  }
}

exports.createPost = async (req, res, next) => {
  try {
    const posts = await Post.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        posts,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
    })
  }
}

exports.updatePost = async (req, res, next) => {
  try {
    const posts = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(201).json({
      status: 'success',
      data: {
        posts,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
    })
  }
}

exports.deletePost = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id)

    res.status(201).json({
      status: 'success',
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
    })
  }
}
