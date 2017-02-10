import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import isUndefined from 'lodash/isUndefined';
import NodesModel from './nodes-schema';
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
    type: String,
    enum: ['immediate', 'day', 'week'],
    default: 'immediate',
  },
  node: {
    type: ObjectId,
    ref: 'Nodes',
  },
  priority: {
    type: Number,
    default: 0,
    require: true,
  }
});

// indexes
// TasksSchema.index({
//   'title': 1
// });

// plugins
TasksSchema.plugin(timestamps);

// methods
TasksSchema.methods.receiveTasks = async function (nodeId, batchSize) {
  const _nodeId = isObjectId(nodeId) ? nodeId : toObjectId(nodeId);
  const Nodes = NodesModel();
  const node = await Nodes.findOne({_id: _nodeId});
  if(!node) {
    throw new Error('not found Node Resource');
  }
  if(!isUndefined(this.node)) {
    throw new Error('the tasks is assigned');
  }
  if(this.status !== 'pending') {
    throw new Error('the tasks is assigned');
  }
  this.priority = batchSize;
  this.node = _nodeId;
  return this.save();
}

TasksSchema.methods.unassignTasks = async function (nodeId) {
  const _nodeId = isObjectId(nodeId) ? nodeId : toObjectId(nodeId);
  const Nodes = NodesModel();
  const node = await Nodes.findOne({_id: _nodeId});
  if(!node) {
    throw new Error('not found Node Resource');
  }
  if(isUndefined(this.node)) {
    throw new Error('the tasks is not assigned');
  }
  if(this.status !== 'pending') {
    throw new Error('the tasks is assigned');
  }
  this.priority = 0;
  this.node = undefined;
  return this.save();
}

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
