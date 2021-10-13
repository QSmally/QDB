
const { Collection } = require("qulity");

const Generics = require("../Generics");

class BaseCacheStrategy {

    /**
     * In-memory cached rows.
     * @name BaseCacheStrategy#memory
     * @type {Collection<String, DataModel>}
     * @private
     */
    memory = new Collection();

     /**
      * Inserts or patches something in the Connection's internal cache.
      * @param {String} keyContext As address to memory map this data model to.
      * @param {DataModel} document The value to set in the cache, as a parsed memory model.
      * @abstract
      */
    patch(keyContext, document) {
        const documentClone = Generics.clone(document);
        documentClone._timestamp = Date.now();
        this.memory.set(keyContext, documentClone);
    }
}

module.exports = BaseCacheStrategy;
