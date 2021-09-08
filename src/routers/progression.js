const express = require('express');
const router = new express.Router();
const Progression = require('../models/progression');
const auth = require('../middleware/auth');

router.post('/progressions', auth, async(req, res) => {
    const progression = new Progression({
        ...req.body,
        owner: req.user._id
    });

    try{
        await progression.save();
        res.status(201).send(progression);
    }
    catch (err){
        res.status(400).send(err);
    }
});

router.get('/progressions', auth, async(req, res) => {
    try{
        await req.user.populate('progressions').execPopulate()
        res.send(req.user.progressions)
    }
    catch (err){
        res.status(500).send()
    }
});

router.get('/progressions/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try{
        const progression = await Progression.findOne({ _id, owner: req.user._id});

        if (!progression){
            return res.status(404).send();
        }
        res.send(progression);
    }
    catch (err){
        res.status(500).send();
    }
})

router.patch('/progressions/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'key'];
    const isValidUpdate = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!isValidUpdate){
        return res.status(400).send({error: "Invalid update."});
    }

    try{
        const progression = await Progression.findOne({_id: req.params.id, owner: req.user._id});
        if (!progression){
            return res.status(404).send();
        }
        updates.forEach((update) => {
            progression[update] = req.body[update];
        });

        await progression.save();
        res.send(progression);
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.delete('/progressions/:id', auth, async (req, res) => {
    try{
        const progression = await Progression.findOneAndDelete({_id: req.params.id, owner: req.user._id});

        if (!progression){
            return res.status(404).send();
        }

        res.send(progression);
    }
    catch (err){
        res.status(500).send();
    }
});

router.post('/progressions/:id/chords', auth, async (req, res) => {
    const chord = req.body;
    
    try{
        const progression = await Progression.findOne({_id: req.params.id, owner: req.user._id});
        if (!progression){
            return res.status(404).send();
        }

        progression.chords = progression.chords.concat(chord);
        await progression.save();
        res.status(201).send(progression);
    }
    catch (err){
        res.status(400).send();
    }
});

router.delete('/progressions/:id/chords/:cid', auth, async (req, res) => {
    try{
        const progression = await Progression.findOne({_id: req.params.id, owner: req.user._id});
        if (!progression){
            return res.status(404).send()
        }
        chordID = req.params.cid;
        progression.chords = progression.chords.filter((chord) => {
            return chord._id.toString() !== chordID;
        });
        await progression.save();
        res.send(progression);
    }
    catch (err){
        res.status(500).send()
    }
});




module.exports = router;