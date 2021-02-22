import Cache from "./Cache";
import Questions from "./Questions";
import { ONE_WEEK } from "./constants";

const db = new Questions({
  cache: new Cache({ stdTTL: ONE_WEEK }),
});

export default db;
