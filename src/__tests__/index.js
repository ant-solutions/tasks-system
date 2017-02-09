import test from 'tape';
require('./connect-mongo');

test.onFinish(() => process.exit(0));
