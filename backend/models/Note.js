import mongoose from "mongoose"

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, "Please add a title"]
    },
    content: {
        type: String,
        required: [true, "PLease add some content"]
    },
    isFavorite: {
            type: Boolean,
            default: false,
    },
    tags: {
            type: [String],
            default: [],
    }
}, {timestamps: true});

export default mongoose.model('Note', noteSchema);