const express = require("express")
const router = new express.Router()
const User=require("../models/users")
import auth from "../middlewares/auth"
router.post('/users',async (req, res) => {
    try {
        const user=await new User({
            ...req.body
        })
        await user.save()
        res.send(200)
    } catch (e) {
        console.log(e)
        res.status(401).send(e)
    }
})
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({
            name: user.name,
            ownReviews: user.ownReviews,
            following: user.following,
            token,
            typeOfUser: user.typeOfUser
        })
    } catch (e) {
        res.status(400).send({
            error: e
        })
    }
})
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router