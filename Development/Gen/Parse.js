
const FS = require("fs");

module.exports = File => {
    const Buffer = FS.readFileSync(File, {encoding: "utf-8"})
    .split("\n").map(Line => Line.trim());

    const Comments = [];

    while (Buffer.indexOf("/**") !== -1) {
        const fIdx = Buffer.indexOf("/**");
        const sIdx = Buffer.indexOf("*/");

        const Comment = Buffer.slice(fIdx, sIdx + 2);
        Comment.push(fIdx.toString());

        Comments.push(Comment);
        Buffer[fIdx] = Buffer[sIdx] = "Mapped";
    }

    return Comments.map(Comment => {
        return Comment
        .filter(Line => !["/**", "*/"].includes(Line))
        .map(Line => Line.replace("* ", ""));
    }).map(Tree => {

        const Line  = parseInt(Tree.pop()) + 1;
        const Value = Tree.splice(Tree.length - 1, 1)[0].split(" ");
        let Output  = {Value: Value[Value[0] == "async" ? 1 : 0], Line};

        let CtxTag = "Description";

        Tree.forEach(Line => {
            const Contents = Line.split(" ").slice(1).join(" ");
            switch (Line.split(" ")[0]) {
                case "@param":
                    if (!Output.Params) Output.Params = [];
                    Output.Params.push(Contents);
                    CtxTag = "Param";
                    break;

                case "@returns":
                    Output.Returns = Contents;
                    CtxTag = "Returns";
                    break;

                case "@extends":
                case "@type":
                    const Type = Line.split(" ")[0].slice(1);
                    Output[Type[0].toUpperCase() + Type.slice(1)] = Contents;
                    break;

                case "@readonly":
                case "@private":
                case "@name":
                    if (!Output.Flags) Output.Flags = [];
                    Output.Flags.push(Line.split(" ")[0].slice(1));
                    if (Line.split(" ")[0] == "@name") Output.Value = Contents.split("#")[1];
                    break;

                case "@example":
                    Output.Code = Contents;
                    break;

                default:
                    if (CtxTag == "Description" && !Output.Description) Output.Description = Line;
                    else if (CtxTag == "Param") Output.Params[Output.Params.length - 1] += ` ${Line}`;
                    else Output[CtxTag] += ` ${Line}`;
            }
        });

        if (Value[0] == "async") {
            if (!Output.Flags) Output.Flags = [];
            Output.Flags.push("async");
        }
        
        return Output;

    });

}
