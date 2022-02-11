
/**
 * Resolves a dot-separated path to a key and rest path.
 * @param {Pathlike} pathlike String input to be formed and parsed.
 * @returns {Array}
 */
module.exports = pathlike => {
    return pathlike.split(/\.+/g);
}
