import mongoose from "mongoose";


export interface IDataIngest {
    userId: mongoose.Types.ObjectId,
    dataIngestName: string,
    dataIngestIdentifier: string,
    dataSourceIds: Array<mongoose.Types.ObjectId>
    status: 'processing' | 'completed' | 'failed'
}


const schema = new mongoose.Schema<IDataIngest>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    dataIngestName: {
        type: String,
        required: true
    },
    dataIngestIdentifier: {
        type: String,
        required: true
    },
    dataSourceIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DataSource",
            required: true
        }
    ],
    status: {
        type: String,
        enum: ['processing', 'completed', 'failed'],
        default: 'processing',
        required: true
    }
}, { timestamps: true })


const DataIngest = mongoose.model<IDataIngest>("DataIngest", schema)

export default DataIngest;