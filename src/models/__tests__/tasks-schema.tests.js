import TasksModel from '../tasks-schema';
import NodesModel from '../nodes-schema';
import {
  toObjectId,
  isObjectId,
} from '../../utils/to-objectid';
import isDate from 'lodash/isDate';
import test from 'tape';
import moment from 'moment';

test('TasksModel createTask', async function (t) {
  t.plan(18);
  // remove all
  await TasksModel().remove({});
  let task = await TasksModel().createTask();
  t.equal(isDate(task.createdAt), true, 'createdAt should be Date type');
  t.equal(isDate(task.updatedAt), true, 'createdAt should be Date type');
  t.equal(task.__v, 0, '__v should equal 0');
  t.equal(moment(task.startTime).diff(moment(), 'seconds') <= 3600, true, 'startTime should less than 1 hours');
  t.equal(task.status, 'pending', 'status should equal pending');
  t.equal(task.completedAt, undefined, 'completedAt should equal undefined');

  task = await TasksModel().createTask('day');
  t.equal(isDate(task.createdAt), true, 'createdAt should be Date type');
  t.equal(isDate(task.updatedAt), true, 'createdAt should be Date type');
  t.equal(task.__v, 0, '__v should equal 0');
  t.equal(moment(task.startTime).diff(moment(), 'seconds') <= 86400, true, 'startTime should less than 1 hours');
  t.equal(task.status, 'pending', 'status should equal pending');
  t.equal(task.completedAt, undefined, 'completedAt should equal undefined');

  task = await TasksModel().createTask('week');
  t.equal(isDate(task.createdAt), true, 'createdAt should be Date type');
  t.equal(isDate(task.updatedAt), true, 'createdAt should be Date type');
  t.equal(task.__v, 0, '__v should equal 0');
  t.equal(moment(task.startTime).diff(moment(), 'seconds') <= 86400 * 7, true, 'startTime should less than 1 hours');
  t.equal(task.status, 'pending', 'status should equal pending');
  t.equal(task.completedAt, undefined, 'completedAt should equal undefined');
});

test('TasksModel urgency', async function (t) {
  t.plan(3);
  // remove all
  await TasksModel().remove({});
  let task = await TasksModel().createTask();
  t.equal(task.urgency, 'immediate', 'urgency should equal immediate');

  task = await TasksModel().createTask('day');
  t.equal(task.urgency, 'day', 'urgency should equal day');

  task = await TasksModel().createTask('week');
  t.equal(task.urgency, 'week', 'urgency should equal week');

});

test('TasksModel completeTask', async function (t) {
  t.plan(5);
  // remove all
  await TasksModel().remove({});
  const task = await TasksModel().createTask();
  const taskcompleted = await TasksModel().completeTask(task._id);
  t.equal(isDate(taskcompleted.completedAt), true, 'completedAt should be Date type');
  t.equal(isDate(taskcompleted.createdAt), true, 'createdAt should be Date type');
  t.equal(isDate(taskcompleted.updatedAt), true, 'createdAt should be Date type');
  t.equal(moment(taskcompleted.startTime).diff(moment(), 'seconds') <= 3600, true, 'startTime should less than 1 hours');
  t.equal(taskcompleted.status, 'completed', 'status should equal completed');
});

test('TasksModel cancelTask', async function (t) {
  t.plan(5);
  // remove all
  await TasksModel().remove({});
  const task2 = await TasksModel().createTask();
  const taskcanceled = await TasksModel().cancelTask(task2._id);
  t.equal(isDate(taskcanceled.completedAt), true, 'completedAt should be Date type');
  t.equal(isDate(taskcanceled.createdAt), true, 'createdAt should be Date type');
  t.equal(isDate(taskcanceled.updatedAt), true, 'createdAt should be Date type');
  t.equal(moment(taskcanceled.startTime).diff(moment(), 'seconds') <= 3600, true, 'startTime should less than 1 hours');
  t.equal(taskcanceled.status, 'canceled', 'status should equal canceled');
});

test('TasksModel error message', async function (t) {
  t.plan(2);
  try {
    await TasksModel().receiveTasks(toObjectId('123'), 5);
    t.equal(1, 2, 'should throw new Error');
  }
  catch(e){
    t.equal(e.message, 'not found Node Resource');
  }

  try {
    await TasksModel().unassignTasks(toObjectId('123'));
    t.equal(1, 2, 'should throw new Error');
  }
  catch(e){
    t.equal(e.message, 'not found Node Resource');
  }
});

test('TasksModel receiveTasks with large number of bashSize', async function (t) {
  t.plan(2);
  // remove all
  await TasksModel().remove({});
  await NodesModel().remove({});
  // Insert dummy data
  const nodesDummyData = [{
    _id: toObjectId('589db5443d5dae015dc3fd7d'),
    title: 'node resources A'
  }];
  const nodesResources = [];
  for (let i = nodesDummyData.length - 1; i >= 0; i--) {
    nodesResources.push(await NodesModel().create(nodesDummyData[i]));
  }
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
  const tasksResources = [];
  for (let i = tasksDummyData.length - 1; i >= 0; i--) {
    tasksResources.push(await TasksModel().createTask(tasksDummyData[i]));
  }
  let list = await TasksModel().receiveTasks(toObjectId('589db5443d5dae015dc3fd7d'), 100);
  t.equal(list.length, 9);
  let count = await TasksModel().count({node: toObjectId('589db5443d5dae015dc3fd7d')});
  t.equal(count, 9);
});

test('TasksModel receiveTasks should select highest priority tasks', async function (t) {
  t.plan(3);
  // remove all
  await TasksModel().remove({});
  await NodesModel().remove({});
  // Insert dummy data
  const nodesDummyData = [{
    _id: toObjectId('589db5443d5dae015dc3fd7d'),
    title: 'node resources A'
  }];
  const nodesResources = [];
  for (let i = nodesDummyData.length - 1; i >= 0; i--) {
    nodesResources.push(await NodesModel().create(nodesDummyData[i]));
  }
  const tasksDummyData = [
    'immediate',
    'day',
    'week',
  ];
  const tasksResources = [];
  for (let i = tasksDummyData.length - 1; i >= 0; i--) {
    tasksResources.push(await TasksModel().createTask(tasksDummyData[i]));
  }
  let list = await TasksModel().receiveTasks(toObjectId('589db5443d5dae015dc3fd7d'), 1);
  t.equal(list.length, 1);
  let count = await TasksModel().count({node: toObjectId('589db5443d5dae015dc3fd7d')});
  t.equal(count, 1);
  const task = await TasksModel().findOne({node: toObjectId('589db5443d5dae015dc3fd7d')});
  t.equal(moment(task.startTime).diff(moment(), 'seconds') <= 3600, true, 'startTime should less than 1 hours');
});

test('TasksModel receiveTasks and unassignTasks', async function (t) {
  t.plan(17);
  // remove all
  await TasksModel().remove({});
  await NodesModel().remove({});

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
  let list = await TasksModel().receiveTasks(toObjectId('589db5443d5dae015dc3fd7e'), 5);
  t.equal(list.length, 5);

  let count = await TasksModel().count({node: toObjectId('589db5443d5dae015dc3fd7e')});
  t.equal(count, 5);

  list = await TasksModel().receiveTasks(toObjectId('589db5443d5dae015dc3fd7e'), 3);
  t.equal(list.length, 3);

  count = await TasksModel().count({node: toObjectId('589db5443d5dae015dc3fd7e')});
  t.equal(count, 8);

  count = await TasksModel().count({node: { $exists: false }});
  t.equal(count, 1);

  list = await TasksModel().receiveTasks(toObjectId('589db5443d5dae015dc3fd7e'), 3);
  t.equal(list.length, 1);

  list = await TasksModel().receiveTasks(toObjectId('589db5443d5dae015dc3fd7e'), 3);
  t.equal(list.length, 0);

  list = await TasksModel().unassignTasks(toObjectId('589db5443d5dae015dc3fd7e'));
  t.equal(list.length, 9);

  count = await TasksModel().count({node: { $exists: false }});
  t.equal(count, 9);

  count = await TasksModel().count({node: toObjectId('589db5443d5dae015dc3fd7e')});
  t.equal(count, 0);

  list = await TasksModel().receiveTasks(toObjectId('589db5443d5dae015dc3fd7e'), 1);
  t.equal(list.length, 1);

  list = await TasksModel().receiveTasks(toObjectId('589db5443d5dae015dc3fd7d'), 1);
  t.equal(list.length, 1);

  count = await TasksModel().count({node: toObjectId('589db5443d5dae015dc3fd7e')});
  t.equal(count, 1);

  const t1 = await TasksModel().findOne({node: toObjectId('589db5443d5dae015dc3fd7e')});
  t.equal(moment(t1.startTime).diff(moment(), 'seconds') <= 3600, true, 'startTime should less than 1 hours');

  const t2 = await TasksModel().findOne({node: toObjectId('589db5443d5dae015dc3fd7d')});
  t.equal(moment(t2.startTime).diff(moment(), 'seconds') <= 3600, true, 'startTime should less than 1 hours');

  list = await TasksModel().receiveTasks(toObjectId('589db5443d5dae015dc3fd7e'), 20);
  t.equal(list.length, 7);

  count = await TasksModel().count({node: toObjectId('589db5443d5dae015dc3fd7e')});
  t.equal(count, 8);
});
