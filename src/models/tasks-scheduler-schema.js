import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import TasksModel from './tasks-schema';
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

TasksSchedulerSchema.statics.receiveTasks = async function (nodeId, batchSize) {
  const _nodeId = isObjectId(nodeId) ? nodeId : toObjectId(nodeId);
  const node = await NodesModel().findOne({_id: _nodeId});
  if(!node) {
    throw new Error('not found Node Resource');
  }
  const tasks = await TasksModel().find({
    status: 'pending',
    node: { $exists: false },
  }).sort({
    urgency: 1
  }).limit(batchSize);
  console.log(tasks.length);
  // insert data
  const newTasksScheduler = tasks.map((v, k)=> ({
    node: _nodeId,
    task: v._id
  }));
  return await this.create(newTasksScheduler);
}
TasksSchedulerSchema.statics.unassignTasks = async function (nodeId) {
  const _nodeId = isObjectId(nodeId) ? nodeId : toObjectId(nodeId);
  const node = await NodesModel().findOne({_id: _nodeId});
  if(!node) {
    throw new Error('not found Node Resource');
  }
  return await this.remove({
    node: _nodeId
  });
}

/**

TasksSchema.statics.receiveTasks = async function (nodeId, batchSize) {
  const _nodeId = isObjectId(nodeId) ? nodeId : toObjectId(nodeId);
  const Nodes = NodesModel();
  const node = await Nodes.findOne({_id: _nodeId});
  if(!node) {
    throw new Error('not found Node Resource');
  }
  const tasks = await this.find({
    status: 'pending',
    node: { $exists: false },
  }).sort({
    urgency: 1
  }).limit(batchSize);

  // if(!isUndefined(this.node)) {
  //   throw new Error('the tasks is assigned');
  // }
  // if(this.status !== 'pending') {
  //   throw new Error('the tasks is assigned');
  // }
  // this.priority = batchSize;
  // this.node = _nodeId;
  // return this.save();
}

TasksSchema.statics.highestTask = async function (nodeId) {
  const _nodeId = isObjectId(nodeId) ? nodeId : toObjectId(nodeId);
  const result = await this.find({node: nodeId}).sort({priority:-1}).limit(1);
  if(result.length === 0) {
    return null;
  }
  return result[0];
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
 */

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
