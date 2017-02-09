import { connectPrimaryData } from '../connect/mongo';

// important note, turn true to reset `test database`
connectPrimaryData('mongodb://mongo/test1', {}, false);
