import mongoose from "mongoose";


export interface IDataSource extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    fileName: string;
    fileType: string;
    filePath: string;
    status: 'ready' | 'processing' | 'failed',
    fileMetaData: Record<string, any>;

}
const schema = new mongoose.Schema<IDataSource>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['ready', 'processing', 'failed'],
        default: 'processing'
    },
    fileMetaData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

},
    { timestamps: true }
)

const DataSource = mongoose.model<IDataSource>("DataSource", schema);

export default DataSource;