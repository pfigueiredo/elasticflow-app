
function sEquals(a, b) {
    return (a?.toString() ?? "") === (b?.toString() ?? "")
}

exports.sEquals = sEquals;