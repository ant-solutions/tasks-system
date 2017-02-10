import test from 'tape';
import NodesModel from '../nodes-schema';
import TasksModel from '../tasks-schema';
import TasksSchedulerModel from '../tasks-scheduler-schema';
import {
  toObjectId,
  isObjectId,
} from '../../utils/to-objectid';

test('TasksSchedulerModel receiveTasks, unassignTasks', async function (t) {
  t.plan(2);
  // remove all
  await TasksModel().remove({});
  await NodesModel().remove({});
  await TasksSchedulerModel().remove({});

  // Insert dummy data
  const nodesDummyData = [{
    _id: toObjectId('589db5443d5dae015dc3fd7d'),
    title: 'node resources A'
  }, {
    _id: toObjectId('589db5443d5dae015dc3fd7e'),
    title: 'node resources B'
  }, {
    _id: toObjectId('589db5453d5dae015dc4fd7e'),
    title: 'node resources C'
  }];

  const tasksDummyData = [
    'immediate',
    'day',
    'day',
    'immediate',
    'week',
    'day',
    'week',
    'immediate',
    'week',
  ];

  const nodesResources = [];
  for (let i = nodesDummyData.length - 1; i >= 0; i--) {
    nodesResources.push(await NodesModel().create(nodesDummyData[i]));
  }

  const tasksResources = [];
  for (let i = tasksDummyData.length - 1; i >= 0; i--) {
    tasksResources.push(await TasksModel().createTask(tasksDummyData[i]));
  }
  let list = await TasksSchedulerModel().receiveTasks(toObjectId('589db5443d5dae015dc3fd7e'), 5);
  t.equal(list.length, 5);

  list = await TasksSchedulerModel().unassignTasks(toObjectId('589db5443d5dae015dc3fd7e'));
  t.equal(list.length, 5);
});
