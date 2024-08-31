import mongoose, {Schema} from 'mongoose';

const sheetSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: "Untitled"
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    data: {
        type: mongoose.Schema.Types.Mixed, // Allows more flexibility in storing complex structures
        required: true
    },

    shared_with: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    version_history: [{
        version: Number,
        timestamp: Date,
        changes: mongoose.Schema.Types.Mixed, // Mixed type to handle diverse types of changes
    }]
}, {
    timestamps: true
})

export const Sheet = mongoose.model("Sheet", sheetSchema)