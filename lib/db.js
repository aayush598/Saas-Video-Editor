const DB_NAME = 'VideoEditorDB'
const DB_VERSION = 2
const STORE_PROJECT = 'project_state'
const STORE_ASSETS = 'media_assets'
const STORE_TEMPLATES = 'custom_templates'

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
            if (!db.objectStoreNames.contains(STORE_TEMPLATES)) {
                db.createObjectStore(STORE_TEMPLATES, { keyPath: 'id' })
            }
        }

        request.onsuccess = (event) => {
            const db = event.target.result
            const transaction = db.transaction(
                method === 'read' ? [STORE_PROJECT, STORE_ASSETS, STORE_TEMPLATES] : [STORE_PROJECT, STORE_ASSETS, STORE_TEMPLATES],
                method === 'read' ? 'readonly' : 'readwrite'
            )

            if (typeof args[0] === 'function') {
                try {
                    const result = args[0](transaction)
                    if (result && result instanceof Promise) {
                        result.then(resolve).catch(reject)
                    } else {
                        transaction.oncomplete = () => resolve(result)
                    }
                } catch (e) {
                    reject(e)
                }
            } else {
                // If no function, just resolve with transaction? Not really useful here.
                resolve(transaction)
            }

            transaction.onerror = (e) => reject(e)
        }

        request.onerror = (e) => reject(e)
    })
}

export const saveTemplate = async (template) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onsuccess = (event) => {
            const db = event.target.result
            const transaction = db.transaction([STORE_TEMPLATES], 'readwrite')
            const store = transaction.objectStore(STORE_TEMPLATES)
            store.put(template)

            transaction.oncomplete = () => resolve()
            transaction.onerror = (e) => reject(e)
        }
        request.onerror = (e) => reject(e)
    })
}

export const loadTemplates = async () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onsuccess = (event) => {
            const db = event.target.result
            // Check if store exists in case of old DB version cached (though version bump should handle it)
            if (!db.objectStoreNames.contains(STORE_TEMPLATES)) {
                resolve([])
                return
            }
            const transaction = db.transaction([STORE_TEMPLATES], 'readonly')
            const store = transaction.objectStore(STORE_TEMPLATES)
            const query = store.getAll()

            query.onsuccess = () => resolve(query.result)
            query.onerror = (e) => reject(e)
        }
        request.onerror = (e) => reject(e)
    })
}

export const deleteTemplate = async (id) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onsuccess = (event) => {
            const db = event.target.result
            const transaction = db.transaction([STORE_TEMPLATES], 'readwrite')
            const store = transaction.objectStore(STORE_TEMPLATES)
            store.delete(id)

            transaction.oncomplete = () => resolve()
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

            // Function to sanitize state (remove functions etc)
            const sanitize = (obj) => {
                if (typeof obj !== 'object' || obj === null) return obj
                if (Array.isArray(obj)) return obj.map(sanitize)

                const clone = {}
                for (const key in obj) {
                    const val = obj[key]
                    // Skip functions or React elements (often circular or symbol based)
                    if (typeof val === 'function' || (val && val.$$typeof)) continue
                    clone[key] = sanitize(val)
                }
                return clone
            }

            const cleanState = sanitize(state)
            store.put(cleanState, 'currentProject')

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
            if (!db.objectStoreNames.contains(STORE_PROJECT)) db.createObjectStore(STORE_PROJECT)
            if (!db.objectStoreNames.contains(STORE_ASSETS)) db.createObjectStore(STORE_ASSETS)
            if (!db.objectStoreNames.contains(STORE_TEMPLATES)) db.createObjectStore(STORE_TEMPLATES, { keyPath: 'id' })
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
