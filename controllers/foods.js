// controllers/foods.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

//router logic
router.get('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);

        res.render('index.ejs', {
            foods: currentUser.pantry,
        });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

//create new foods for pantry
router.get('/new', (req, res) => {
    res.render('new.ejs');
});

//route for aedding food
router.post('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);

        currentUser.pantry.push({ food: req.body.food });

        console.log('Added Food:', req.body.food);
        console.log('Current Pantry:', currentUser.pantry);

        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/foods`);
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});


router.get('/new', (req, res) => {
    // Render directly from views directory
    res.render('new.ejs', { user: req.session.user });
});

router.get('/:foodId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const food = currentUser.pantry.id(req.params.foodId);

        if (!food) {
            return res.status(404).send('Food item not found');
        }

        res.render('show.ejs', {
            food,
            user: currentUser
        });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});


//editing pantry items
router.put('/:foodId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);

        const food = currentUser.pantry.id(req.params.foodId);

        if (!food) {
            return res.status(404).send('Food item not found');
        }

        food.food = req.body.food;

        await currentUser.save();

        res.redirect(`/users/${currentUser._id}/foods`);
    } catch (error) {
        console.error(error);

    }
});

//shows edited list of pantry foods
router.get('/:foodId/edit', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const food = currentUser.pantry.id(req.params.foodId);

        if (!food) {
            return res.status(404).send('Food item not found');
        }

        res.render('edit.ejs', {
            food,
            user: currentUser
        });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

//delete route
router.delete('/:foodId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        
        const food = currentUser.pantry.id(req.params.foodId);
        
        if (!food) {
            return res.status(404).send('Food item not found');
        }
        
        food.deleteOne();
        
        await currentUser.save();
        
        res.redirect(`/users/${currentUser._id}/foods`);
    } catch (error) {
        console.error(error);
        res.status(500).redirect(`/users/${req.session.user._id}/foods`);
    }
});

module.exports = router;

