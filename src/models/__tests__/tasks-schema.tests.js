import TasksModel from '../tasks-schema';
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
  t.equal(moment(task.urgency).diff(moment(), 'seconds') <= 3600, true, 'urgency should less than 1 hours');
  t.equal(task.status, 'pending', 'status should equal pending');
  t.equal(task.completedAt, undefined, 'completedAt should equal undefined');

  task = await TasksModel().createTask('day');
  t.equal(isDate(task.createdAt), true, 'createdAt should be Date type');
  t.equal(isDate(task.updatedAt), true, 'createdAt should be Date type');
  t.equal(task.__v, 0, '__v should equal 0');
  t.equal(moment(task.urgency).diff(moment(), 'seconds') <= 86400, true, 'urgency should less than 1 hours');
  t.equal(task.status, 'pending', 'status should equal pending');
  t.equal(task.completedAt, undefined, 'completedAt should equal undefined');

  task = await TasksModel().createTask('week');
  t.equal(isDate(task.createdAt), true, 'createdAt should be Date type');
  t.equal(isDate(task.updatedAt), true, 'createdAt should be Date type');
  t.equal(task.__v, 0, '__v should equal 0');
  t.equal(moment(task.urgency).diff(moment(), 'seconds') <= 86400 * 7, true, 'urgency should less than 1 hours');
  t.equal(task.status, 'pending', 'status should equal pending');
  t.equal(task.completedAt, undefined, 'completedAt should equal undefined');
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
  t.equal(moment(taskcompleted.urgency).diff(moment(), 'seconds') <= 3600, true, 'urgency should less than 1 hours');
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
  t.equal(moment(taskcanceled.urgency).diff(moment(), 'seconds') <= 3600, true, 'urgency should less than 1 hours');
  t.equal(taskcanceled.status, 'canceled', 'status should equal canceled');
});

/**
test('TasksModel test', async function (t) {
  t.plan(25);

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
  }];

  const nodesResources = [];
  for (let i = nodesDummyData.length - 1; i >= 0; i--) {
    nodesResources.push(await NodesModel().create(nodesDummyData[i]));
  }

  const task = await TasksModel().createTask();
  t.equal(isDate(task.createdAt), true, 'createdAt should be Date type');
  t.equal(isDate(task.updatedAt), true, 'createdAt should be Date type');
  t.equal(task.__v, 0, '__v should equal 0');
  t.equal(task.urgency, 'immediate', 'urgency should equal immediate');
  t.equal(task.status, 'pending', 'status should equal pending');
  t.equal(task.completedAt, undefined, 'completedAt should equal undefined');

  const taskcompleted = await TasksModel().completeTask(task._id);
  t.equal(isDate(taskcompleted.completedAt), true, 'completedAt should be Date type');
  t.equal(isDate(taskcompleted.createdAt), true, 'createdAt should be Date type');
  t.equal(isDate(taskcompleted.updatedAt), true, 'createdAt should be Date type');
  t.equal(taskcompleted.urgency, 'immediate', 'urgency should equal immediate');
  t.equal(taskcompleted.status, 'completed', 'status should equal completed');

  const task2 = await TasksModel().createTask();
  const taskcanceled = await TasksModel().cancelTask(task2._id);
  t.equal(isDate(taskcanceled.completedAt), true, 'completedAt should be Date type');
  t.equal(isDate(taskcanceled.createdAt), true, 'createdAt should be Date type');
  t.equal(isDate(taskcanceled.updatedAt), true, 'createdAt should be Date type');
  t.equal(taskcanceled.urgency, 'immediate', 'urgency should equal immediate');
  t.equal(taskcanceled.status, 'canceled', 'status should equal canceled');

  const task3 = await TasksModel().createTask();
  const bash = await task3.receiveTasks(toObjectId('589db5443d5dae015dc3fd7d'), 5);
  t.equal(bash.priority, 5, 'priority should equal 5');
  t.equal(bash.node.toString(), '589db5443d5dae015dc3fd7d', 'node should equal 589db5443d5dae015dc3fd7d');
  t.equal(bash.status, 'pending', 'status should equal pending');

  console.log('How do i know the highest priority task of node, please see the test code');
  const highestPriorityTask = await TasksModel().highestTask(toObjectId('589db5443d5dae015dc3fd7d'));
  t.equal(highestPriorityTask.priority, 5, 'priority should equal 5');
  t.equal(highestPriorityTask.node.toString(), '589db5443d5dae015dc3fd7d', 'node should equal 589db5443d5dae015dc3fd7d');
  t.equal(highestPriorityTask.status, 'pending', 'status should equal pending');

  const unassignedTask = await bash.unassignTasks(toObjectId('589db5443d5dae015dc3fd7d'));
  t.equal(unassignedTask.priority, 0, 'priority should equal 5');
  t.equal(unassignedTask.node, undefined, 'node should equal undefined');
  t.equal(unassignedTask.status, 'pending', 'status should equal pending');
});
*/
