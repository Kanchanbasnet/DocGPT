import mongoose from "mongoose";


export interface IConversationHistory {
    conversationId: mongoose.Types.ObjectId,
    query: String,
    response: String,
    metadata: {
        queryToken: Number,
        responseToken: Number,
        processingTime: Number,
        model: String
    }
}

const schema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    query: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    },
    metadata : {
        queryToken: {
            type: Number
        },
        responseToken: {
            type: Number
        },
        processingTime: {
            type: Number
        },
        model: {
            type: String
        }
    }
}, {timestamps: true})

const ConversationHistory = mongoose.model<IConversationHistory>("ConversationHistory", schema);
export default ConversationHistory;