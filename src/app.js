import nconf from 'nconf';
import config from './config';
import { mongo } from './connect';

// configurations
config();

// mongo
mongo();
