import TasksModel from '../tasks-schema'
import test from 'tape';

test('TasksModel test', async function (t) {
  t.plan(2);

  t.equal(typeof Date.now, 'function');
  var start = Date.now();

  setTimeout(function () {
    t.equal(Date.now() - start, 100);
  }, 100);
  TasksModel().hello();
  console.log(await TasksModel().find({}));
});
