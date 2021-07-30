
class CLIFormatter {
    static formats = {
        dim:   "\x1b[40m",
        bold:  "\x1b[1m",
        reset: "\x1b[0m"
    };

    static dim = text => `${CLIFormatter.formats.dim}${text}${CLIFormatter.formats.reset}`;
    static bold = text => `${CLIFormatter.formats.bold}${text}${CLIFormatter.formats.reset}`;
    static list = (items, padding, dashes) => Object.keys(items)
        .map(item => `${dashes ? " -" : " "} ${item}:`.padEnd(padding) + items[item])
        .join("\n");
}

module.exports = CLIFormatter;
