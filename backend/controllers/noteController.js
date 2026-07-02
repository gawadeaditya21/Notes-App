import Note from "../models/Note.js";

export const getNotes = async(req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id}).sort({createdAt: -1});
        res.status(200).json(notes);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

export const createNote = async(req, res) => {
    try {
        const {title, content, isFavourite, tags} = req.body;
        if(!title || !content) {
            return res.status(400).json({message: "Please fill in all fields"});
        }

        const note = await Note.create({
            user: req.user.id,
            title,
            content,
            isFavourite,
            tags
        });

        res.status(201).json(note);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

export const updateNote = async(req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if(!note) return res.status(404).json({messgae: "Note not found"});
        if(note.user.toString() !== req.user.id) {
            return res.status(401).json({message: "User not authorized to update this note"});
        }

        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'});
        res.status(200).json(updatedNote);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

export const deleteNote = async(req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if(!note) return res.status(404).json({messgae: "Note not found"});
        if(note.user.toString() !== req.user.id) {
            return res.status(401).json({message: "User not authorized to update this note"});
        }

        await note.deleteOne();
        res.status(200).json({message: "Note removed successfully"});
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};