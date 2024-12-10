const prompt = require("prompt-sync")();

function classifyTerm(term) {
    const simpleFunc = /^(sin|cos|tan|sec|cosec|csc|cot|ln|e)\(x\)$/;
    const nestedFunc = /^\((.+)\)\^(\d+)$/;
    const nestedTrigFunc = /^(sin|cos|tan|sec|cosec|csc|cot)\((.+)\)$/;
    const productFunc = /(.+)\*(.+)/;
    const qoutientFunc = /(.+)\/(.+)/;
    const linearFunc = /^([+-]?\d*)x([+-]\d+)?$/;
    const constant = /^[+-]?\d+(\.\d+)?$/;


    if (productFunc.test(term)) {
        return "PRODUCT";
    }
    if (qoutientFunc.test(term)) {
        return "DIVISION";
    }
    if (nestedFunc.test(term)) {
        return "NESTED FUNCTION";
    }
    if (term.includes("x^")) return "ALGEBRAIC";

    if (nestedTrigFunc.test(term)) {
        return "NESTED TRIGONOMETRIC";
    }
    if (simpleFunc.test(term)) {
        if (term.includes("ln")) return "LOGARITHMIC";
        if (term.includes("e^")) return "EXPONENTIAL";
        return "TRIGONOMETRIC";
    }
    if (linearFunc.test(term)) { return "LINEAR"; }
    if (constant.test(term)) { return "CONSTANT"; }

    return "UNKNOWN";
}

function tokenizeExpression(expr) {
    const tokens = [];
    let term = "";
    let openParen = 0;

    for (let i = 0; i < expr.length; i++) {
        const element = expr[i];
        if ((element === '+' || element === '-') && openParen === 0) {
            if (term.length > 0) {
                tokens.push(term.trim());
            }
            term = element;
        } else {
            term += element;
            if (element === "(") openParen++;
            if (element === ")") openParen--;
        }
    }

    if (term.length > 0) {
        tokens.push(term.trim());
    }
    console.log(tokens);

    return tokens;
}


function differentiate(term) {

    const sign = term.startsWith("-") ? "-" : "+";

    const unsignedTerm = term.startsWith("-") || term.startsWith("+") ? term.slice(1).trim() : term;

    if (unsignedTerm === "x") return `${sign} 1`;


    if (unsignedTerm === "ln(x)") return `${sign} 1/x`;
    if (unsignedTerm === "e^x") return `${sign} e^x`;

    if (unsignedTerm === "sin(x)") return `${sign} cos(x)`;
    if (unsignedTerm === "cos(x)") return `${sign} (-sin(x))`;
    if (unsignedTerm === "tan(x)") return `${sign} sec^2(x)`;
    if (unsignedTerm === "cot(x)") return `${sign} (-cosec^2(x))`;
    if (unsignedTerm === "sec(x)") return `${sign} sec(x)*tan(x)`;
    if (unsignedTerm === "cosec(x)") return `${sign} (-cosec(x)*tan(x))`;


    if (classifyTerm(unsignedTerm) === "NESTED FUNCTION") {
        const match = unsignedTerm.match(/^\((.+)\)\^(\d+)$/);
        if (match) {
            const base = match[1];
            const exp = Number(match[2]);

            const innerToken = tokenizeExpression(base);
            const diffInner = innerToken.map(differentiate).join(" ");

            return `${exp}(${base})^${exp - 1} * ${diffInner}`;
        }
    }

    if (classifyTerm(unsignedTerm) === "LINEAR") {
        const match = unsignedTerm.match(/^([+-]?\d*)x([+-]\d+)?$/);
        if (match) {
            const coeff = match[1] === "" || match[1] === "+" ? 1 : match[1] === "-" ? -1 : Number(match[1]);
            return `${sign} ${coeff}`;
        }
    }


    if (classifyTerm(unsignedTerm) === "ALGEBRAIC") {
        const match = unsignedTerm.match(/^(\d*)x(?:\^(\d+))?$/);
        console.log("IN ALGEBRIC DIFFERENTIATION");
        console.log(match);

        if (match) {
            const coeff = match[1] === "" ? 1 : Number(match[1]);
            const exp = match[2] === undefined ? 1 : Number(match[2]);

            // power rule: nx^(n-1)
            const newCoeff = coeff * exp;
            const newExp = exp - 1;

            if (newExp === 0) return `${sign} ${newCoeff}`;
            if (newExp === 1) return `${sign} ${newCoeff}x`;

            return `${sign} ${newCoeff}x^${newExp}`;
        } else {
            console.error(`Invalid algebraic term: ${unsignedTerm}`);
            return (sign + unsignedTerm);
        }
    }
    if (classifyTerm(unsignedTerm) === "NESTED TRIGONOMETRIC") {
        const match = unsignedTerm.match(/^(sin|cos|tan|sec|cosec|csc|cot)\((.+)\)$/);
        if (match) {
            const outerFunc = match[1];
            const innerFunc = match[2];
            const outerDerivatives = {
                "sin": "cos",
                "cos": "-sin",
                "tan": "sec^2",
                "cot": "-cosec^2",
                "sec": "sec * tan",
                "cosec": "-cosec * cot",
                "csc": "-cosec * cot"
            };
            const outerDerivative = outerDerivatives[outerFunc];
            const innerDerivative = differentiate(innerFunc);

            return `${sign} ${outerDerivative}(${innerFunc}) * (${innerDerivative})`;

        }
    }
    //Product Rule
    if (classifyTerm(unsignedTerm) === "PRODUCT") {
        const match = unsignedTerm.match(/(.+)\*(.+)/);
        if (match) {
            const u = match[1];
            const v = match[2];

            uprime = differentiate(u.trim());
            vprime = differentiate(v.trim());

            return `${sign} (${u}*${vprime} + ${v} * ${uprime})`;

        }
    }
    //Qoutientt Rule
    if (classifyTerm(unsignedTerm) === "DIVISION") {
        const match = unsignedTerm.match(/(.+)\/(.+)/);
        if (match) {
            const u = match[1];
            const v = match[2];

            uprime = differentiate(u.trim());
            vprime = differentiate(v.trim());

            return `${sign} ((${v} * ${uprime}) - (${vprime} * ${u})) / ${v}^2`;

        }
    }

    if (classifyTerm(unsignedTerm) === "CONSTANT") {
        const match = unsignedTerm.match(/^[+-]?\d+(\.\d+)?$/);
        if (match) {
            const derivative = "0"
            Number(derivative);
            return `${derivative}`;
        }
    }
    // console.log(term);

}

let expression = prompt("Enter Expression: ");
// console.log(expression);
if (expression.trim() === "") {
    console.error("INVALID INPUT!");
    
}
else {

    let terms = tokenizeExpression(expression);
    let diffTerms = [];
    for (let i = 0; i < terms.length; i++) {
        const element = terms[i];
        // console.log(element);
        diffTerms[i] = differentiate(element);
    }

    // Filter out "0" terms before joining
    if (classifyTerm(expression) !== "CONSTANT") {
        diffTerms = diffTerms.filter(term => term && term.trim() !== "0").join(" ");

    }

    console.log(`${diffTerms}`);
    // console.log(classifyTerm((expression)));
}
