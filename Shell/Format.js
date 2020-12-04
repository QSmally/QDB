
const C = {BOLD: "\x1b[1m", RESET: "\x1b[0m"};

module.exports = {
    BOLD: Text => `${C.BOLD}${Text}${C.RESET}`,
    LIST: (Items, Padding) => Object.keys(Items)
        .map(Item => `  ${Item}:`.padEnd(Padding) + Items[Item])
        .join("\n")
}
