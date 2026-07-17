import { builder } from './builder';
import './enum';
import './models/user/index';
import './models/user/user.queries';
import './models/user/user.mutations';
import './models/list/index';
import './models/list/list.queries';
import './models/friendship/index';
import './models/friendship/friendship.queries';
import './models/list/list.mutations';
import './models/listCategory/index';
import './models/listCategory/listCategory.queries';
import './models/item/index';
import './models/item/item.mutations';
import './models/tag/index';
import './models/tag/tag.queries';
import './models/tag/tag.mutations';
import './models/rating/index';
import './models/rating/rating.mutations';

builder.queryType({});
builder.mutationType({});

export const schema = builder.toSchema();
