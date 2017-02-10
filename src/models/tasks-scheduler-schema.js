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
const { Types: { ObjectId } } = Schema;

const TasksSchedulerSchema = new Schema({
  node: {
    type: ObjectId,
    ref: 'Nodes',
    require: true,
  },
  task: {
    type: ObjectId,
    ref: 'Tasks',
    require: true,
  },
  priority: {
    type: Number,
    require: true,
  }
});

// indexes
// TasksSchedulerSchema.index({
//   'title': 1
// });

// plugins
TasksSchedulerSchema.plugin(timestamps);

// methods

// statics methods

TasksSchedulerSchema.statics.receiveTasks = async function (node_id, batch_size) {}

TasksSchedulerSchema.statics.unassignTasks = async function () {}

let model = null;
export default function (mongoose) {
  if (!model) {
    if (!mongoose) {
      mongoose = connectPrimaryData();
    }
    model = mongoose.model('TasksScheduler', TasksSchedulerSchema);
  }
  return model;
}
