
const CacheStrategy = require("../CacheStrategy");

class DisabledCacheStrategy extends CacheStrategy {

    /**
     * A patch method which doesn't insert or modify any entries in the cache
     * property of the controller.
     */
    patch(_keyContext, _document) {}
}

module.exports = DisabledCacheStrategy;
