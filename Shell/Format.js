
const C = {BOLD: "\x1b[1m", RESET: "\x1b[0m"};
module.exports = Text => `${C.BOLD}${Text}${C.RESET}`;
