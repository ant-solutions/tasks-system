import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import {
  connectPrimaryData,
} from '../connect/mongo';
const { Schema } = mongoose;

const TasksSchema = new Schema({
  // title: {
  //   type: String,
  //   required: true,
  // },
  // done: {
  //   type: Boolean,
  //   required: true,
  // },
  completedAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'canceled', 'completed'],
    default: 'pending',
  },
  urgency: {
    type: String,
    enum: ['immediate', 'day', 'week'],
    default: 'immediate',
  },
});

// indexes
// TasksSchema.index({
//   'title': 1
// });

// plugins
TasksSchema.plugin(timestamps);

// methods

// statics methods
TasksSchema.statics.hello = function () {
  console.log('1234');
}

let model = null;
export default function (mongoose) {
  if (!model) {
    if (!mongoose) {
      mongoose = connectPrimaryData();
    }
    model = mongoose.model('Tasks', TasksSchema);
  }
  return model;
}
