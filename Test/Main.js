
const QDB = require("../QDB");
const entries = {};

try {

    require("./Test")(QDB, (name, output, expected) => {
        entries[name] = {
            passed:   JSON.stringify(output) == JSON.stringify(expected),
            output:   output,
            expected: expected
        };
    });

    const failed = [];

    for (const key in entries) {
        if (!entries[key].passed)
        failed.push({
            test:     key,
            output:   entries[key].output,
            expected: entries[key].expected
        });
    }

    console.log(`Successfully ran ${Object.keys(entries).length} tests\nOf which ${failed.length} have failed`);

    if (failed.length) {
        console.log("Failed test stack:\n");
        failed.forEach(entry => {
            console.log(entry.test,
                "\n", entry.output,
                "\n", entry.expected
            );
        });
    }

} catch (err) {
    console.error("Failed to run tests");
    console.error(err);
} finally {
    if (process.argv.includes("-d")) console.debug(entries);
}
