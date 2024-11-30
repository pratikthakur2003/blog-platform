const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Create a new post
router.post('/', auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = new Post({
            title,
            content,
            author: req.user.id  // Set the author to the authenticated user's ID
        });
        
        const savedPost = await post.save();
        await savedPost.populate('author', 'username');
        res.json(savedPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('author', 'username')
            .exec();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a post
router.put('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user is the author of the post
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }

        const { title, content } = req.body;
        post.title = title;
        post.content = content;
        
        const updatedPost = await post.save();
        await updatedPost.populate('author', 'username');
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user is the author of the post
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Generate summary for a post
router.post('/:id/summary', async (req, res) => {
  try {
    const { content } = req.body;
    
    // Here you would typically call an AI service to generate the summary
    // For now, we'll create a simple summary by taking the first few sentences
    const sentences = content.split(/[.!?]+/).filter(sentence => sentence.trim());
    const summary = sentences.slice(0, 2).join('. ') + '.';
    
    res.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ message: 'Error generating summary' });
  }
});

module.exports = router;
