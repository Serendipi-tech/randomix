import { builder } from './builder';
import './enum';
import './models/user/index';
import './models/user/user.queries';
import './models/user/user.mutations';
import './models/list/index';
import './models/list/list.queries';

builder.queryType({});
builder.mutationType({});

export const schema = builder.toSchema();
