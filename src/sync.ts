import db from ".";

import syncAssets from "./syncAssets";

db.sync().then(syncAssets);
