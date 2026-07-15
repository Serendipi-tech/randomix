import { builder } from './builder';
import './enum';
import './models/user/index';
import './models/user/user.queries';
import './models/user/user.mutations';

builder.queryType({});
builder.mutationType({});

export const schema = builder.toSchema();
