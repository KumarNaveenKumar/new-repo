import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        default: 0,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,

    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        trim: true,

    },
    tokens: {
        token: {
            type: String,
            required: true
        }
    },
});

const User = mongoose.model('User', userSchema);

export {
    User
}