import lowdb from 'lowdb'
import storage from 'lowdb/file-sync'

import { ONE_WEEK, COLLECTION_ID } from './constants'

const db = lowdb(`${ __dirname }/db.json`, { storage })

const isValidCacheKey = (key, ttl) =>
 	Math.floor((Date.now() - key.created) / 1000) <= ttl

class CacheKey {
	constructor(key, value) {
		this.created = Date.now()
		Object.assign(this, { key, value })
	}
}

class Cache {
	constructor({ stdTTL }) {
		this.stdTTL = stdTTL || 600
		this.db = db(COLLECTION_ID)
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

export default new Cache({ stdTTL: ONE_WEEK })
