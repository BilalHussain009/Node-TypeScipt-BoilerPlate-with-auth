import mongoose from "mongoose"
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
import validator from "mongoose-validator";
const userschema = new mongoose.Schema({
    email:{
        type:String,
        requied:true,
        trim:true,
        validate: [
            validator({
              validator: 'isEmail',
              message: 'Oops..please enter valid email'
            })
          ],
        unique:true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
            if(value.length<4){
                throw new Error('Password is too short')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})
userschema.methods.toJSON = function (this:any) {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userschema.methods.generateAuthToken = async function (this:any) {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, "this is my secreyt replace it with Environment variable")
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}
userschema.statics.findByCredentials = async (email, password) => {
    const user:any = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}
userschema.pre('save', async function (this:any,next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})
const User = mongoose.model('User', userschema)
module.exports = User