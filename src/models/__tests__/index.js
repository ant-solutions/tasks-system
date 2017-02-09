import TasksModel from '../tasks-schema';
import isDate from 'lodash/isDate';
import test from 'tape';

test('TasksModel test', async function (t) {
  t.plan(3);

  // remove all
  await TasksModel().remove({});

  const task = await TasksModel().createTask();
  t.equal(isDate(task.createdAt), true, 'createdAt should be Date type');
  t.equal(isDate(task.updatedAt), true, 'createdAt should be Date type');
  t.equal(task.__v, 0, 'should equal 0');

  // const task = await TasksModel().completeTask(task._id);
  // const task = await TasksModel().cancelTask(task._id);
  // const task = await TasksModel().receiveTasks(node_id, batch_size);
  // const task = await TasksModel().unassignTasks(node_id);

  console.log(task);

  // t.equal(1, 2);
});
