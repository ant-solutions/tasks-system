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
    status: 'pending'
  }).sort({
    urgency: 1
  }).limit(batchSize);
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
  const tasks = await this.find({
    node: _nodeId,
  });
  const unassignTasks = tasks.map((v) => (v.task));
  await this.remove({
    node: _nodeId
  });
  return TasksModel().find({
    _id: {$in: unassignTasks}
  });
}

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
