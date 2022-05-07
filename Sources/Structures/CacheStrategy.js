
const { Collection } = require("qulity");

const Generics = require("../Generics");

class CacheStrategy {

    /**
     * In-memory cached rows.
     * @name CacheStrategy#memoryStore
     * @type {Collection<String, DataModel>}
     * @private
     */
    memoryStore = new Collection();

     /**
      * Inserts or patches something in the Connection's internal cache.
      * @param {String} keyContext As address to memory map this data model to.
      * @param {DataModel} document The value to set in the cache, as a parsed memory model.
      * @abstract
      */
    patch(keyContext, document) {
        const documentClone = Generics.clone(document);
        documentClone._timestamp = Date.now();
        this.memoryStore.set(keyContext, documentClone);
    }
}

module.exports = CacheStrategy;
