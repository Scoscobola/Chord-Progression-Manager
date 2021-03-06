const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

// Create a new user.
router.post('/users', async(req, res) => {
    const user = new User(req.body);
    
    try{
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    }
    catch (err){
        res.status(400).send(err);
    }
})

// Login a user.
router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    }
    catch (err){
        res.status(400).send();
    }
})

// Logout a user.
router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();

        res.send();
    }
    catch (err){
        res.status(500).send();
    }
});

// Logout a user and remove all authorization tokens.
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = [];
        await req.user.save();

        res.send();
    }
    catch (err){
        res.status(500).send();
    }
});

// GET a user's profile.
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

// Update a users's profile.
router.patch('/user/me', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid updates"});
    }

    try{
        updates.forEach((update) => {
            req.user[update] = req.body[update];
        });

        await req.user.save();
        res.send(req.user);
    }
    catch(err){
        res.status(400).send(err);
    }
})

// Delete a user.
router.delete('/users/me', auth, async (req, res) => {
    try{
        await req.user.remove();
        res.send(req.user);
    }
    catch (err){
        res.status(500).send();
    }
});

module.exports = router;