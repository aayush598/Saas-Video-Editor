const DB_NAME = 'VideoEditorDB'
const DB_VERSION = 1
const STORE_PROJECT = 'project_state'
const STORE_ASSETS = 'media_assets'

export const dbRequest = (method, ...args) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onupgradeneeded = (event) => {
            const db = event.target.result
            if (!db.objectStoreNames.contains(STORE_PROJECT)) {
                db.createObjectStore(STORE_PROJECT)
            }
            if (!db.objectStoreNames.contains(STORE_ASSETS)) {
                db.createObjectStore(STORE_ASSETS)
            }
        }

        request.onsuccess = (event) => {
            const db = event.target.result
            const transaction = db.transaction(method === 'read' ? [STORE_PROJECT, STORE_ASSETS] : [STORE_PROJECT, STORE_ASSETS], method === 'read' ? 'readonly' : 'readwrite')

            // Helper to execute generic store command
            if (typeof args[0] === 'function') {
                try {
                    const result = args[0](transaction)
                    if (result && result instanceof Promise) {
                        result.then(resolve).catch(reject)
                    } else {
                        // wait for transaction complete
                        transaction.oncomplete = () => resolve(result)
                    }
                } catch (e) {
                    reject(e)
                }
            }

            transaction.onerror = (e) => reject(e)
        }

        request.onerror = (e) => reject(e)
    })
}

export const saveProjectState = async (state) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onsuccess = (event) => {
            const db = event.target.result
            const transaction = db.transaction([STORE_PROJECT], 'readwrite')
            const store = transaction.objectStore(STORE_PROJECT)
            store.put(state, 'currentProject')

            transaction.oncomplete = () => resolve()
            transaction.onerror = (e) => reject(e)
        }
        request.onerror = (e) => reject(e)
    })
}

export const loadProjectState = async () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onsuccess = (event) => {
            const db = event.target.result
            const transaction = db.transaction([STORE_PROJECT], 'readonly')
            const store = transaction.objectStore(STORE_PROJECT)
            const query = store.get('currentProject')

            query.onsuccess = () => resolve(query.result)
            query.onerror = (e) => reject(e)
        }
        request.onupgradeneeded = (event) => {
            const db = event.target.result
            db.createObjectStore(STORE_PROJECT)
            db.createObjectStore(STORE_ASSETS)
        }
        request.onerror = (e) => reject(e)
    })
}

export const saveAsset = async (id, blob) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onsuccess = (event) => {
            const db = event.target.result
            const transaction = db.transaction([STORE_ASSETS], 'readwrite')
            const store = transaction.objectStore(STORE_ASSETS)
            store.put(blob, id)

            transaction.oncomplete = () => resolve(id)
            transaction.onerror = (e) => reject(e)
        }
        request.onerror = (e) => reject(e)
    })
}

export const loadAsset = async (id) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onsuccess = (event) => {
            const db = event.target.result
            const transaction = db.transaction([STORE_ASSETS], 'readonly')
            const store = transaction.objectStore(STORE_ASSETS)
            const query = store.get(id)

            query.onsuccess = () => resolve(query.result)
            query.onerror = (e) => reject(e)
        }
        request.onerror = (e) => reject(e)
    })
}

export const clearDatabase = async () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(DB_NAME)
        request.onsuccess = () => resolve()
        request.onerror = (e) => reject(e)
    })
}
