import mongoose from "mongoose";


export interface IConversation {
    ingestId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId
}


const schema = new mongoose.Schema({

    ingestId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "DataIngest"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }

}, {timestamps: true})

const Conversation = mongoose.model<IConversation>("Conversation", schema)

export default Conversation;