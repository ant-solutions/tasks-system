import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import isUndefined from 'lodash/isUndefined';
import {
  connectPrimaryData,
} from '../connect/mongo';
import {
  toObjectId,
  isObjectId,
} from '../utils/to-objectid';
const { Schema } = mongoose;

const TasksSchema = new Schema({
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
TasksSchema.statics.createTask = async function (urgencyArgs) {
  const urgency = isUndefined(urgencyArgs) ? 'immediate' : urgencyArgs;
  return this.create({
    urgency,
  });
}

TasksSchema.statics.completeTask = async function (taskId) {
  const _id = isObjectId(taskId) ? taskId : toObjectId(taskId);
  return this.findOneAndUpdate({
    _id,
    status: 'pending',
  }, {
    $set: {
      status: 'completed',
      completedAt: new Date,
    }
  }, {new: true});
}

TasksSchema.statics.cancelTask = async function (taskId) {
  const _id = isObjectId(taskId) ? taskId : toObjectId(taskId);
  return this.findOneAndUpdate({
    _id,
    status: 'pending',
  }, {
    $set: {
      status: 'canceled',
      completedAt: new Date,
    }
  }, {new: true});
}

TasksSchema.statics.receiveTasks = async function () {
}

TasksSchema.statics.unassignTasks = async function () {
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
