import TasksModel from '../tasks-schema';
import isDate from 'lodash/isDate';
import test from 'tape';

test('TasksModel test', async function (t) {
  t.plan(16);

  // remove all
  await TasksModel().remove({});

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

  // const task = await TasksModel().cancelTask(task._id);
  // const task = await TasksModel().receiveTasks(node_id, batch_size);
  // const task = await TasksModel().unassignTasks(node_id);

  // t.equal(1, 2);
});
