import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import moment from 'moment';
import isUndefined from 'lodash/isUndefined';
import {
  connectPrimaryData,
} from '../connect/mongo';
import {
  toObjectId,
  isObjectId,
} from '../utils/to-objectid';
const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;

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
    type: Date,
  }
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
  let time = moment();
  /**
  one of immediate, day, or week.
    immediate means it's to be completed within 1 hour
    day is to be completed within 1 day
    week is to be completed within 1 week.
  */
  if (urgency === 'immediate') {
    time = time.add(1, 'hours');
  }
  if (urgency === 'day') {
    time = time.add(1, 'days');
  }
  if (urgency === 'week') {
    time = time.add(7, 'days');
  }
  return this.create({
    urgency: time.toDate(),
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
