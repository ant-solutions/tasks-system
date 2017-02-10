import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import {
  connectPrimaryData,
} from '../connect/mongo';
import {
  toObjectId,
  isObjectId,
} from '../utils/to-objectid';
const { Schema } = mongoose;

const NodesSchema = new Schema({
  title: {
    type: String,
    require: true,
  }
});

// indexes
// NodesSchema.index({
//   'title': 1
// });

// plugins
NodesSchema.plugin(timestamps);

// methods

// statics methods

let model = null;
export default function (mongoose) {
  if (!model) {
    if (!mongoose) {
      mongoose = connectPrimaryData();
    }
    model = mongoose.model('Nodes', NodesSchema);
  }
  return model;
}
