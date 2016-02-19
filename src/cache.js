import lowdb from 'lowdb'
import storage from 'lowdb/file-sync'

const COLLECTION_ID = 'cache'

const createDB = lowdb(`${ __dirname }/db.json`, { storage })

const isValidCacheKey = (key, ttl) =>
 	Math.floor((Date.now() - key.created) / 1000) <= ttl

class CacheKey {
	constructor(key, value) {
		this.created = Date.now()
		Object.assign(this, { key, value })
	}
}

export default class Cache {
	constructor({ stdTTL, db = createDB(COLLECTION_ID) }) {
		this.stdTTL = stdTTL || 600
		this.db = db
	}

	get(key) {
		const cached = this.db.find({ key })

		return cached && isValidCacheKey(cached, this.stdTTL)
			? cached.value
			: this.invalidate(key)
	}

	set(key, value) {
		this.db.push(new CacheKey(key, value))
	}

	invalidate(key) {
		this.db.remove({ key })
	}
}
