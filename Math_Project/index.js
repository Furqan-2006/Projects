const prompt = require("prompt-sync")();

// Regular Expressions for Classification
const patterns = {
    simpleTrigFunc: /^(sin|cos|tan|sec|cosec|csc|cot)\(x\)$/,
    powerFunc: /^\((.+)\)\s*\^\s*(\d+)$/,
    nestedTrigFunc: /^(sin|cos|tan|sec|cosec|csc|cot)\((.+)\)$/,
    productFunc: /(.+)\s*\*\s*(.+)/,
    quotientFunc: /(.+)\s*\/\s*\((.+)\)/,
    linearFunc: /^([+-]?\d*)x\s*([+-]\s*\d+)?$/,
    constant: /^[+-]?\d+(\.\d+)?$/,
    expFunc: /^(e|\d+)\s*\^\s*\((.+)\)/,
    logFunc: /^(ln)\((.+)\)/,
    inverseTrigFunc: /^(arcsin|arccos|arctan|arcsec|arccosec|arccsc|arccot)\((.+)\)$/
};

// Classify the term based on regex patterns
function classifyTerm(term) {
    if (patterns.productFunc.test(term)) return "PRODUCT";
    if (patterns.quotientFunc.test(term)) return "DIVISION";
    if (patterns.powerFunc.test(term)) return "POWER";
    if (term.includes("x^")) return "ALGEBRAIC";
    if (patterns.simpleTrigFunc.test(term)) return "TRIGONOMETRIC";
    if (patterns.nestedTrigFunc.test(term)) return "NESTED TRIGONOMETRIC";
    if (patterns.inverseTrigFunc.test(term)) return "INVERSE TRIGONOMETRIC";
    if (patterns.linearFunc.test(term)) return "LINEAR";
    if (patterns.expFunc.test(term)) return "EXPONENTIAL";
    if (patterns.logFunc.test(term)) return "LOGARATHMIC";
    if (patterns.constant.test(term)) return "CONSTANT";
    return "UNKNOWN";
}

// Tokenize the input expression
function tokenizeExpression(expr) {
    const tokens = [];
    let term = "";
    let openParen = 0;

    for (let i = 0; i < expr.length; i++) {
        const element = expr[i];

        if ((element === '+' || element === '-') && openParen === 0) {
            if (term.trim()) tokens.push(term.trim());
            term = element; // Start new term with the sign
        } else {
            term += element;
            if (element === "(") openParen++;
            if (element === ")") openParen--;
        }

    }
    if (term.trim()) tokens.push(term.trim());
    // console.log(tokens);

    return tokens;
}

// Differentiate a term
function differentiate(term) {
    const sign = term.startsWith("-") ? "-" : "+";
    const unsignedTerm = term.startsWith("-") || term.startsWith("+") ? term.slice(1).trim() : term;

    if (unsignedTerm === "x") return `${sign} 1`;
    if (unsignedTerm === "ln(x)") return `${sign} 1/x`;
    if (unsignedTerm === "e^x") return `${sign} e^x`;

    const trigDerivatives = {
        "sin(x)": "cos(x)",
        "cos(x)": "-sin(x)",
        "tan(x)": "sec^2(x)",
        "cot(x)": "-cosec^2(x)",
        "sec(x)": "sec(x)*tan(x)",
        "cosec(x)": "-cosec(x)*cot(x)",

    };
    if (trigDerivatives[unsignedTerm]) return `${sign} ${trigDerivatives[unsignedTerm]}`;

    if (classifyTerm(unsignedTerm) === "POWER") {
        const match = unsignedTerm.match(patterns.powerFunc);
        // console.log(match[1]);
        // console.log(match[2]);
        if (match) {
            const base = match[1];
            const exp = Number(match[2]);
            const diffbase = differentiate(match[1]);
            return `${sign} ${exp}(${base})^${exp - 1} (${diffbase})`;

        }
    }

    if (classifyTerm(unsignedTerm) === "LINEAR") {
        const match = unsignedTerm.match(patterns.linearFunc);
        if (match) {
            const coeff = match[1] ? Number(match[1]) : 1;
            return `${sign} ${coeff}`;
        }
    }

    if (classifyTerm(unsignedTerm) === "PRODUCT") {
        const match = unsignedTerm.match(patterns.productFunc);
        if (match) {
            const u = match[1].trim();
            const v = match[2].trim();
            const du = differentiate(u);
            const dv = differentiate(v);
            return `${sign} (${du} * ${v} + ${u} * ${dv})`;
        }
    }

    if (classifyTerm(unsignedTerm) === "DIVISION") {
        const match = unsignedTerm.match(patterns.quotientFunc);
        if (match) {
            const u = match[1].trim();
            const v = match[2].trim();
            const du = differentiate(u);
            const dv = differentiate(v);
            return `${sign} (${du} * ${v} - ${u} * ${dv}) / (${v})^2`;
        }
    }

    if (classifyTerm(unsignedTerm) === "ALGEBRAIC") {
        const match = unsignedTerm.match(/^([+-]?\d*)x(?:\^(\d+))?$/);
        if (match) {
            const coeff = match[1] ? Number(match[1]) : 1;
            const exp = match[2] ? Number(match[2]) : 1;
            return `${sign} ${coeff * exp}x^${exp - 1}`;
        }
    }

    if (classifyTerm(unsignedTerm) === "EXPONENTIAL") {
        const match = unsignedTerm.match(patterns.expFunc);
        if (match) {
            const base = match[1];
            const exp = match[2];
            const diffexp = differentiate(exp);
            return `(${match[0]}) (ln(${base})(${diffexp})) `
        }
    }

    if (classifyTerm(unsignedTerm) === "LOGARATHMIC") {
        const match = unsignedTerm.match(patterns.logFunc);
        if (match) {
            console.log(match[0]);
            console.log(match[1]);
            console.log(match[2]);

            const u = match[2];
            const diffInner = differentiate(u);

            return `${sign}(${diffInner}) / (${u})`
        }
    }

    if (classifyTerm(unsignedTerm) === "NESTED TRIGONOMETRIC") {
        const match = unsignedTerm.match(patterns.nestedTrigFunc);
        if (match) {
            const outerFunc = match[1];
            const innerFunc = match[2];
            const diffOuter = differentiate(`${outerFunc}(x)`);
            const diffInner = differentiate(innerFunc);
            return `${sign} (${diffOuter.replace("x", `(${innerFunc})`)} * (${diffInner}))`

        }
    }
    if (classifyTerm(unsignedTerm) === "INVERSE TRIGONOMETRIC") {
        const match = unsignedTerm.match(patterns.inverseTrigFunc);
        const innerFunc = match[2];

        if (/arcsin/.test(unsignedTerm)) {
            return `${differentiate(innerFunc)} / sqrt(1 - (${innerFunc})^2)`;
        }
        if (/arccos/.test(unsignedTerm)) {
            return `-( ${differentiate(innerFunc)} / sqrt(1 - (${innerFunc})^2) )`;
        }
        if (/arctan/.test(unsignedTerm)) {
            return `${differentiate(innerFunc)} / (1 + (${innerFunc})^2)`;
        }
        if (/arccot/.test(unsignedTerm)) {
            return `-( ${differentiate(innerFunc)} / (1 + (${innerFunc})^2) )`;
        }
        if (/arcsec/.test(unsignedTerm)) {
            return `${differentiate(innerFunc)} / (|${innerFunc}| * sqrt(((${innerFunc})^2) - 1))`;
        }
        if (/arccosec|arccsc/.test(unsignedTerm)) {
            return `-( ${differentiate(innerFunc)} / (|${innerFunc}| * sqrt(((${innerFunc})^2) - 1)) )`;
        }


    }
    if (classifyTerm(unsignedTerm) === "CONSTANT") return "0";

    return `${sign} UNKNOWN_TERM(${unsignedTerm})`;
}

// Integrate a term
function integrate(term) {
    const sign = term.startsWith("-") ? "-" : "+";
    const unsignedTerm = term.startsWith("-") || term.startsWith("+") ? term.slice(1).trim() : term;

    if (unsignedTerm === "x") return `${sign} (1/2)x^2`;
    if (unsignedTerm === "ln(x)") return `${sign} x*ln(x) - x`;
    if (unsignedTerm === "e^x") return `${sign} e^x`;

    const trigIntegrals = {
        "sin(x)": "-cos(x)",
        "cos(x)": "sin(x)",
        "tan(x)": "ln|sec(x)|",
        "cot(x)": "ln|sin(x)|",
        "sec(x)": "ln|sec(x) + tan(x)|",
        "cosec(x)": "-ln|cosec(x) + cot(x)|"
    };
    if (trigIntegrals[unsignedTerm]) return `${sign} ${trigIntegrals[unsignedTerm]}`;

    //ILATE
    function applyILATERule(uTerm, vPrimeTerm) {
        const ILATE_priority = ['LOGARATHMIC', 'ALGEBRAIC', 'LINEAR', 'TRIGONOMETRIC', 'NESTED TRIGONOMETRIC', 'EXPONENTIAL'];

        const uClass = classifyTerm(uTerm.trim());
        const vPrimeClass = classifyTerm(vPrimeTerm);

        if (ILATE_priority.indexOf(uClass) < ILATE_priority.indexOf(vPrimeClass)) {
            return { u: uTerm, dv: vPrimeTerm };
        } else {
            return { u: vPrimeTerm, dv: uTerm };
        }
    }
    if (classifyTerm(unsignedTerm) === "PRODUCT") {
        const match = unsignedTerm.match(patterns.productFunc);

        if (match) {
            const { u, dv } = applyILATERule(match[1], match[2]);

            const v = integrate(dv.trim());
            const du = differentiate(u.trim());
            const integralSign = "\u222B";

            return `((${u})(${v}) - ${integralSign} ((${v})(${du})) )`;
        }
    }

    if (classifyTerm(unsignedTerm) === "ALGEBRAIC") {
        const match = unsignedTerm.match(/^([+-]?\d*)x(?:\^*\(*([+-]?\d+))?\)*$/);
        if (match) {
            const coeff = match[1] ? Number(match[1]) : 1;
            const exp = match[2] ? Number(match[2]) : 1;

            if (exp === -1) {
                return `${sign} ln(x)`;
            }

            const newCoeff = coeff / (exp + 1);
            const newExp = exp + 1;
            return `${sign} (${newCoeff}) x ^ ${newExp}`;
        }
    }


    if (classifyTerm(unsignedTerm) === "CONSTANT") {
        return `${sign} ${unsignedTerm} x`;
    }

    if (classifyTerm(unsignedTerm) === "EXPONENTIAL") {
        const match = unsignedTerm.match(patterns.expFunc);
        if (match) {
            const base = match[1];
            const exp = match[2];
            const diffExp = differentiate(exp);

            if (base === "e") {
                return `(${match[0]}) / (${diffExp})`
            }

            else {
                return `(${match[0]}) / ( (${diffExp})(ln(${base})) )`
            }
        }
    }
    if (classifyTerm(unsignedTerm) === "NESTED TRIGONOMETRIC") {
        return `CAN NOT INTEGRATE! ${unsignedTerm} does not have an elementary antiderivative.`
    }

    if (classifyTerm(unsignedTerm) === "DIVISION") {
        const match = unsignedTerm.match(patterns.quotientFunc);


        if (match) {
            if (match[1] === "1") {
                const u = match[2];
                const umatch = u.match(patterns.powerFunc);

                const x = umatch[1];
                const exp = -1 * Number(umatch[2]);

                const newU = integrate(`x^(${exp})`);
                return `${newU.replace("x", `(${x})`)} `

            }

            const denominator = match[2];
            const numerator = tokenizeExpression(denominator);
            const differentiatedTerms = numerator.map(differentiate).filter(term => term.trim()).join(" ");

        }
    }
    return `${sign} UNKNOWN_INTEGRAL(${unsignedTerm})`;
}

// Main Program
console.log("1. Differentiation");
console.log("2. Integration");

const choice = prompt("Enter a choice (1 or 2): ");
const expression = prompt("Enter an expression: ").trim();
console.log(classifyTerm(expression));


if (!expression) {
    console.error("Invalid input! Expression cannot be empty.");
} else if (choice === "1") {
    const terms = tokenizeExpression(expression);
    const differentiatedTerms = terms.map(differentiate).filter(term => term.trim()).join(" ");
    console.log(`Differentiated Expression: ${differentiatedTerms} `);
} else if (choice === "2") {
    const terms = tokenizeExpression(expression);
    const integratedTerms = terms.map(integrate).join(" ");
    console.log(`Integrated Expression: ${integratedTerms} + C`);
} else {
    console.error("Invalid choice! Please select 1 or 2.");
}
