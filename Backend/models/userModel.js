const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    videos: [{
        type: mongoose.Types.ObjectId,
        ref: 'Video',
    }],
    subscribers: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    subscribedTo: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }]
}, { timestamps: true });


//hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//compare password
userSchema.methods.comparePassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema)