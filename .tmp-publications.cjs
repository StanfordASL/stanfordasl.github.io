"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicationSections = getPublicationSections;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let cachedSections = null;
const MONTH_MAP = {
    jan: 1,
    january: 1,
    feb: 2,
    february: 2,
    mar: 3,
    march: 3,
    apr: 4,
    april: 4,
    may: 5,
    jun: 6,
    june: 6,
    jul: 7,
    july: 7,
    aug: 8,
    august: 8,
    sep: 9,
    sept: 9,
    september: 9,
    oct: 10,
    october: 10,
    nov: 11,
    november: 11,
    dec: 12,
    december: 12,
};
function isEscaped(text, index) {
    let slashes = 0;
    for (let i = index - 1; i >= 0 && text[i] === '\\'; i -= 1) {
        slashes += 1;
    }
    return slashes % 2 === 1;
}
function splitBibEntries(source) {
    const entries = [];
    const stringMacros = {};
    let i = 0;
    while (i < source.length) {
        const at = source.indexOf('@', i);
        if (at === -1) {
            break;
        }
        i = at + 1;
        while (i < source.length && /\s/.test(source[i])) {
            i += 1;
        }
        const typeStart = i;
        while (i < source.length && /[A-Za-z]/.test(source[i])) {
            i += 1;
        }
        const type = source.slice(typeStart, i).trim().toLowerCase();
        if (!type) {
            continue;
        }
        while (i < source.length && /\s/.test(source[i])) {
            i += 1;
        }
        const open = source[i];
        const close = open === '{' ? '}' : open === '(' ? ')' : '';
        if (!close) {
            continue;
        }
        i += 1;
        const bodyStart = i;
        let depth = 1;
        let inQuote = false;
        let escaped = false;
        while (i < source.length && depth > 0) {
            const ch = source[i];
            if (inQuote) {
                if (escaped) {
                    escaped = false;
                }
                else if (ch === '\\') {
                    escaped = true;
                }
                else if (ch === '"') {
                    inQuote = false;
                }
            }
            else {
                if (ch === '"' && !isEscaped(source, i)) {
                    inQuote = true;
                }
                else if (ch === open) {
                    depth += 1;
                }
                else if (ch === close) {
                    depth -= 1;
                    if (depth === 0) {
                        break;
                    }
                }
            }
            i += 1;
        }
        const body = source.slice(bodyStart, i).trim();
        if (source[i] === close) {
            i += 1;
        }
        if (type === 'comment' || type === 'preamble') {
            continue;
        }
        if (type === 'string') {
            const macros = parseFields(body, stringMacros);
            for (const [name, value] of Object.entries(macros)) {
                stringMacros[name.toLowerCase()] = value;
            }
            continue;
        }
        const keyComma = findTopLevelDelimiter(body, ',');
        if (keyComma === -1) {
            continue;
        }
        const key = body.slice(0, keyComma).trim();
        const fieldsBody = body.slice(keyComma + 1);
        entries.push({ type, key, fields: parseFields(fieldsBody, stringMacros) });
    }
    return entries;
}
function parseFields(body, stringMacros) {
    const fields = {};
    let i = 0;
    while (i < body.length) {
        while (i < body.length && (body[i] === ',' || /\s/.test(body[i]))) {
            i += 1;
        }
        if (i >= body.length) {
            break;
        }
        const nameStart = i;
        while (i < body.length && /[A-Za-z0-9_-]/.test(body[i])) {
            i += 1;
        }
        const name = body.slice(nameStart, i).trim().toLowerCase();
        if (!name) {
            while (i < body.length && body[i] !== ',') {
                i += 1;
            }
            continue;
        }
        while (i < body.length && /\s/.test(body[i])) {
            i += 1;
        }
        if (body[i] !== '=') {
            while (i < body.length && body[i] !== ',') {
                i += 1;
            }
            continue;
        }
        i += 1;
        while (i < body.length && /\s/.test(body[i])) {
            i += 1;
        }
        const { value, nextIndex } = parseValue(body, i);
        i = nextIndex;
        fields[name] = resolveValue(value, stringMacros);
    }
    return fields;
}
function parseValue(body, start) {
    let i = start;
    let depth = 0;
    let inQuote = false;
    let escaped = false;
    while (i < body.length) {
        const ch = body[i];
        if (inQuote) {
            if (escaped) {
                escaped = false;
            }
            else if (ch === '\\') {
                escaped = true;
            }
            else if (ch === '"') {
                inQuote = false;
            }
        }
        else {
            if (ch === '"' && !isEscaped(body, i)) {
                inQuote = true;
            }
            else if (ch === '{') {
                depth += 1;
            }
            else if (ch === '}') {
                if (depth > 0) {
                    depth -= 1;
                }
            }
            else if (ch === ',' && depth === 0) {
                break;
            }
        }
        i += 1;
    }
    return { value: body.slice(start, i), nextIndex: i };
}
function findTopLevelDelimiter(text, delimiter) {
    let depth = 0;
    let inQuote = false;
    let escaped = false;
    for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];
        if (inQuote) {
            if (escaped) {
                escaped = false;
            }
            else if (ch === '\\') {
                escaped = true;
            }
            else if (ch === '"') {
                inQuote = false;
            }
            continue;
        }
        if (ch === '"' && !isEscaped(text, i)) {
            inQuote = true;
            continue;
        }
        if (ch === '{') {
            depth += 1;
            continue;
        }
        if (ch === '}') {
            if (depth > 0) {
                depth -= 1;
            }
            continue;
        }
        if (ch === delimiter && depth === 0) {
            return i;
        }
    }
    return -1;
}
function splitTopLevel(text, delimiter) {
    const parts = [];
    let start = 0;
    while (start <= text.length) {
        const relative = findTopLevelDelimiter(text.slice(start), delimiter);
        if (relative === -1) {
            parts.push(text.slice(start));
            break;
        }
        const end = start + relative;
        parts.push(text.slice(start, end));
        start = end + 1;
    }
    return parts;
}
function unwrapValue(text) {
    let value = text.trim();
    if (!value) {
        return '';
    }
    if (value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1);
    }
    while (value.startsWith('{') && value.endsWith('}') && hasBalancedBraces(value)) {
        value = value.slice(1, -1).trim();
    }
    return value;
}
function resolveValue(raw, stringMacros) {
    const concatenated = splitTopLevel(raw, '#');
    const resolved = concatenated
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => {
        const unwrapped = unwrapValue(part);
        const macroKey = unwrapped.toLowerCase();
        if (/^[a-z][a-z0-9_:-]*$/i.test(unwrapped) && stringMacros[macroKey]) {
            return stringMacros[macroKey];
        }
        return cleanValue(unwrapped);
    })
        .join('')
        .trim();
    return cleanValue(resolved);
}
function cleanValue(raw) {
    let text = raw.trim();
    if (!text) {
        return '';
    }
    if (text.includes('#')) {
        text = text
            .split('#')
            .map((part) => cleanValue(part))
            .join('')
            .trim();
    }
    while (text.startsWith('{') && text.endsWith('}') && hasBalancedBraces(text)) {
        text = text.slice(1, -1).trim();
    }
    const accentPattern = /\\[`'"^"~=.]\s*\{?([A-Za-z])\}?/g;
    text = text.replace(accentPattern, '$1');
    const latexTokens = {
        '\\&': '&',
        '\\%': '%',
        '\\_': '_',
        '\\#': '#',
        '\\$': '$',
        '\\textendash': '-',
        '\\textemdash': '-',
        '\\aa': 'a',
        '\\AA': 'A',
        '\\ae': 'ae',
        '\\AE': 'AE',
        '\\oe': 'oe',
        '\\OE': 'OE',
        '\\o': 'o',
        '\\O': 'O',
        '\\ss': 'ss',
    };
    for (const [key, value] of Object.entries(latexTokens)) {
        text = text.replaceAll(key, value);
    }
    text = text.replace(/[{}]/g, '');
    text = text.replace(/~/g, ' ');
    text = text.replace(/\s+/g, ' ').trim();
    return text;
}
function hasBalancedBraces(text) {
    let depth = 0;
    for (const ch of text) {
        if (ch === '{') {
            depth += 1;
        }
        else if (ch === '}') {
            depth -= 1;
            if (depth < 0) {
                return false;
            }
        }
    }
    return depth === 0;
}
function splitAuthors(rawAuthors) {
    return rawAuthors
        .split(/\s+and\s+/i)
        .map((name) => name.trim())
        .filter(Boolean);
}
function formatAuthorName(rawName) {
    const name = rawName.replace(/[{}]/g, '').trim();
    if (!name) {
        return '';
    }
    let last = '';
    let given = '';
    if (name.includes(',')) {
        const [lastPart, ...rest] = name.split(',');
        last = lastPart.trim();
        given = rest.join(' ').trim();
    }
    else {
        const parts = name.split(/\s+/).filter(Boolean);
        if (parts.length === 1) {
            return parts[0];
        }
        last = parts[parts.length - 1];
        given = parts.slice(0, -1).join(' ');
    }
    const initials = given
        .split(/[\s-]+/)
        .map((part) => part.replace(/[^A-Za-z]/g, ''))
        .filter(Boolean)
        .map((part) => `${part[0]}.`)
        .join(' ');
    return initials ? `${initials} ${last}` : last;
}
function formatAuthors(rawAuthors) {
    const names = splitAuthors(rawAuthors).map(formatAuthorName).filter(Boolean);
    if (names.length === 0) {
        return '';
    }
    if (names.length === 1) {
        return names[0];
    }
    if (names.length === 2) {
        return `${names[0]} and ${names[1]}`;
    }
    return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}
function parseMonth(rawMonth) {
    if (!rawMonth) {
        return 0;
    }
    const value = rawMonth.trim().toLowerCase();
    const numeric = Number.parseInt(value, 10);
    if (Number.isFinite(numeric) && numeric >= 1 && numeric <= 12) {
        return numeric;
    }
    return MONTH_MAP[value] ?? 0;
}
function toKeywords(rawKeywords) {
    if (!rawKeywords) {
        return [];
    }
    return rawKeywords
        .split(/[;,]/)
        .map((keyword) => keyword.trim().toLowerCase())
        .filter(Boolean);
}
function quoteTitle(title) {
    if (!title) {
        return '';
    }
    return `"${title},"`;
}
function formatCitation(entry) {
    const type = entry.type;
    const f = entry.fields;
    const authors = formatAuthors(f.author ?? '');
    const title = quoteTitle(f.title ?? '');
    const year = f.year ? cleanValue(f.year) : '';
    const pages = f.pages ? cleanValue(f.pages) : '';
    if (type === 'article') {
        const journal = f.journal ? cleanValue(f.journal) : '';
        const volume = f.volume ? cleanValue(f.volume) : '';
        const number = f.number ? cleanValue(f.number) : '';
        return [
            authors,
            title,
            journal,
            volume ? `vol. ${volume}` : '',
            number ? `no. ${number}` : '',
            pages ? `pp. ${pages}` : '',
            year,
        ]
            .filter(Boolean)
            .join(', ')
            .concat('.');
    }
    if (type === 'inproceedings' || type === 'incollection') {
        const booktitle = f.booktitle ? cleanValue(f.booktitle) : '';
        return [
            authors,
            title,
            booktitle ? `in ${booktitle}` : '',
            pages ? `pp. ${pages}` : '',
            year,
        ]
            .filter(Boolean)
            .join(', ')
            .concat('.');
    }
    if (type === 'techreport') {
        const institution = f.institution ? cleanValue(f.institution) : '';
        const number = f.number ? cleanValue(f.number) : '';
        return [
            authors,
            title,
            institution || 'Tech. Rep.',
            number ? `Tech. Rep. ${number}` : '',
            year,
        ]
            .filter(Boolean)
            .join(', ')
            .concat('.');
    }
    if (type === 'phdthesis') {
        const school = f.school ? cleanValue(f.school) : '';
        return [
            authors,
            title,
            'Ph.D. dissertation',
            school,
            year,
        ]
            .filter(Boolean)
            .join(', ')
            .concat('.');
    }
    const venue = cleanValue(f.journal || f.booktitle || f.publisher || '');
    return [authors, title, venue, year].filter(Boolean).join(', ').concat('.');
}
function toPublication(entry) {
    const keywords = toKeywords(entry.fields.keywords ?? '');
    const year = Number.parseInt(entry.fields.year ?? '', 10);
    const doi = cleanValue(entry.fields.doi ?? '');
    const rawUrl = cleanValue(entry.fields.url ?? '');
    const url = rawUrl || (doi ? `https://doi.org/${doi}` : '');
    return {
        key: entry.key,
        type: entry.type,
        title: cleanValue(entry.fields.title ?? ''),
        authors: splitAuthors(entry.fields.author ?? ''),
        year: Number.isFinite(year) ? year : null,
        month: parseMonth(entry.fields.month ?? ''),
        keywords,
        citation: formatCitation(entry),
        url: url || undefined,
        doi: doi || undefined,
    };
}
function byRecency(a, b) {
    const yearA = a.year ?? 0;
    const yearB = b.year ?? 0;
    if (yearA !== yearB) {
        return yearB - yearA;
    }
    if (a.month !== b.month) {
        return b.month - a.month;
    }
    return a.title.localeCompare(b.title);
}
function getPublicationSections() {
    if (cachedSections) {
        return cachedSections;
    }
    const bibPath = path_1.default.join(process.cwd(), 'content/bibliography/ASL_Bib.bib');
    const source = fs_1.default.readFileSync(bibPath, 'utf8');
    const entries = splitBibEntries(source).map(toPublication);
    const preprints = entries
        .filter((entry) => entry.keywords.includes('sub'))
        .sort(byRecency);
    const publications = entries
        .filter((entry) => {
        if (entry.type === 'incollection' || entry.type === 'techreport') {
            return true;
        }
        if (entry.type === 'article' || entry.type === 'inproceedings') {
            return !entry.keywords.includes('sub');
        }
        return false;
    })
        .sort(byRecency);
    const theses = entries
        .filter((entry) => entry.type === 'phdthesis')
        .sort(byRecency);
    cachedSections = [
        { key: 'preprints', title: 'Preprints', items: preprints },
        { key: 'publications', title: 'Publications', items: publications },
        { key: 'theses', title: 'Theses', items: theses },
    ];
    return cachedSections;
}
