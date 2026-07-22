import fs from 'fs'
import path from 'path'

export type PublicationSectionKey = 'preprints' | 'publications' | 'theses'

export interface Publication {
  key: string
  type: string
  title: string
  authors: string[]
  authorsDisplay: string
  year: number | null
  month: number
  keywords: string[]
  citation: string
  venue?: string
  abstract?: string
  bibtex?: string
  status?: string
  url?: string
  doi?: string
}

export interface PublicationSection {
  key: PublicationSectionKey
  title: string
  items: Publication[]
}

type BibEntry = {
  type: string
  key: string
  fields: Record<string, string>
  raw: string
}

let cachedSections: PublicationSection[] | null = null

const MONTH_MAP: Record<string, number> = {
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
}

function isEscaped(text: string, index: number): boolean {
  let slashes = 0
  for (let i = index - 1; i >= 0 && text[i] === '\\'; i -= 1) {
    slashes += 1
  }
  return slashes % 2 === 1
}

function splitBibEntries(source: string): BibEntry[] {
  const entries: BibEntry[] = []
  const stringMacros: Record<string, string> = {}
  let i = 0

  while (i < source.length) {
    const at = source.indexOf('@', i)
    if (at === -1) {
      break
    }
    i = at + 1

    while (i < source.length && /\s/.test(source[i])) {
      i += 1
    }

    const typeStart = i
    while (i < source.length && /[A-Za-z]/.test(source[i])) {
      i += 1
    }
    const type = source.slice(typeStart, i).trim().toLowerCase()
    if (!type) {
      continue
    }

    while (i < source.length && /\s/.test(source[i])) {
      i += 1
    }

    const open = source[i]
    const close = open === '{' ? '}' : open === '(' ? ')' : ''
    if (!close) {
      continue
    }
    i += 1

    const bodyStart = i
    let depth = 1
    while (i < source.length && depth > 0) {
      const ch = source[i]
      if (ch === open) {
        depth += 1
      } else if (ch === close) {
        depth -= 1
        if (depth === 0) {
          break
        }
      }
      i += 1
    }

    const body = source.slice(bodyStart, i).trim()
    if (source[i] === close) {
      i += 1
    }
    const raw = source.slice(at, i).trim()

    if (type === 'comment' || type === 'preamble') {
      continue
    }

    if (type === 'string') {
      const macros = parseFields(body, stringMacros)
      for (const [name, value] of Object.entries(macros)) {
        stringMacros[name.toLowerCase()] = value
      }
      continue
    }

    const keyComma = findTopLevelDelimiter(body, ',')
    if (keyComma === -1) {
      continue
    }
    const key = body.slice(0, keyComma).trim()
    const fieldsBody = body.slice(keyComma + 1)
    entries.push({ type, key, fields: parseFields(fieldsBody, stringMacros), raw })
  }

  return entries
}

function parseFields(body: string, stringMacros: Record<string, string>): Record<string, string> {
  const fields: Record<string, string> = {}
  let i = 0

  while (i < body.length) {
    while (i < body.length && (body[i] === ',' || /\s/.test(body[i]))) {
      i += 1
    }
    if (i >= body.length) {
      break
    }

    const nameStart = i
    while (i < body.length && /[A-Za-z0-9_-]/.test(body[i])) {
      i += 1
    }
    const name = body.slice(nameStart, i).trim().toLowerCase()
    if (!name) {
      while (i < body.length && body[i] !== ',') {
        i += 1
      }
      continue
    }

    while (i < body.length && /\s/.test(body[i])) {
      i += 1
    }
    if (body[i] !== '=') {
      while (i < body.length && body[i] !== ',') {
        i += 1
      }
      continue
    }
    i += 1

    while (i < body.length && /\s/.test(body[i])) {
      i += 1
    }

    const { value, nextIndex } = parseValue(body, i)
    i = nextIndex
    fields[name] = resolveValue(value, stringMacros)
  }

  return fields
}

function parseValue(body: string, start: number): { value: string; nextIndex: number } {
  let i = start
  let depth = 0
  let inQuote = false
  let escaped = false

  while (i < body.length) {
    const ch = body[i]
    if (inQuote) {
      if (escaped) {
        escaped = false
      } else if (ch === '\\') {
        escaped = true
      } else if (ch === '"') {
        inQuote = false
      }
    } else {
      if (ch === '"' && depth === 0 && !isEscaped(body, i)) {
        inQuote = true
      } else if (ch === '{') {
        depth += 1
      } else if (ch === '}') {
        if (depth > 0) {
          depth -= 1
        }
      } else if (ch === ',' && depth === 0) {
        break
      }
    }
    i += 1
  }

  return { value: body.slice(start, i), nextIndex: i }
}

function findTopLevelDelimiter(text: string, delimiter: string): number {
  let depth = 0
  let inQuote = false
  let escaped = false

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]
    if (inQuote) {
      if (escaped) {
        escaped = false
      } else if (ch === '\\') {
        escaped = true
      } else if (ch === '"') {
        inQuote = false
      }
      continue
    }

    if (ch === '"' && depth === 0 && !isEscaped(text, i)) {
      inQuote = true
      continue
    }
    if (ch === '{') {
      depth += 1
      continue
    }
    if (ch === '}') {
      if (depth > 0) {
        depth -= 1
      }
      continue
    }
    if (ch === delimiter && depth === 0) {
      return i
    }
  }

  return -1
}

function splitTopLevel(text: string, delimiter: string): string[] {
  const parts: string[] = []
  let start = 0

  while (start <= text.length) {
    const relative = findTopLevelDelimiter(text.slice(start), delimiter)
    if (relative === -1) {
      parts.push(text.slice(start))
      break
    }
    const end = start + relative
    parts.push(text.slice(start, end))
    start = end + 1
  }

  return parts
}

function unwrapValue(text: string): string {
  let value = text.trim()
  if (!value) {
    return ''
  }

  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1)
  }

  while (value.startsWith('{') && value.endsWith('}') && hasBalancedBraces(value)) {
    value = value.slice(1, -1).trim()
  }

  return value
}

function resolveValue(raw: string, stringMacros: Record<string, string>): string {
  const concatenated = splitTopLevel(raw, '#')
  const resolved = concatenated
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const unwrapped = unwrapValue(part)
      const macroKey = unwrapped.toLowerCase()
      if (/^[a-z][a-z0-9_:-]*$/i.test(unwrapped) && stringMacros[macroKey]) {
        return stringMacros[macroKey]
      }
      if (/^(proc|jrn|book|tech)_[a-z0-9_]+$/i.test(unwrapped)) {
        const fallback = unwrapped.replace(/^[^_]+_/, '').replaceAll('_', ' ').trim()
        if (fallback) {
          return fallback
        }
      }
      return cleanValue(unwrapped)
    })
    .join('')
    .trim()

  return cleanValue(resolved)
}

function cleanValue(raw: string): string {
  let text = raw.trim()
  if (!text) {
    return ''
  }

  if (text.includes('#')) {
    text = text
      .split('#')
      .map((part) => cleanValue(part))
      .join('')
      .trim()
  }

  while (text.startsWith('{') && text.endsWith('}') && hasBalancedBraces(text)) {
    text = text.slice(1, -1).trim()
  }

  const accentCombining: Record<string, string> = {
    '`': '\u0300',
    "'": '\u0301',
    '^': '\u0302',
    '"': '\u0308',
    '~': '\u0303',
    '=': '\u0304',
    '.': '\u0307',
    u: '\u0306',
    v: '\u030C',
    H: '\u030B',
    c: '\u0327',
    k: '\u0328',
    r: '\u030A',
  }

  text = text.replace(
    /\\([`'"^"~=.uvHckr])\s*(?:\{([^{}])\}|([^{}\s]))/g,
    (_, accent: string, bracedBase: string | undefined, base: string | undefined) => {
      const character = bracedBase || base || ''
      const diacritic = accentCombining[accent]
      if (!character || !diacritic) {
        return character
      }
      return `${character}${diacritic}`.normalize('NFC')
    },
  )

  text = text.replace(/\\i/g, 'i')
  text = text.replace(/\\j/g, 'j')

  const latexTokens: Record<string, string> = {
    '\\&': '&',
    '\\%': '%',
    '\\_': '_',
    '\\#': '#',
    '\\$': '$',
    '\\textendash': '-',
    '\\textemdash': '-',
    '\\aa': 'aa',
    '\\AA': 'AA',
    '\\ae': 'ae',
    '\\AE': 'AE',
    '\\oe': 'oe',
    '\\OE': 'OE',
    '\\o': 'ø',
    '\\O': 'Ø',
    '\\l': 'ł',
    '\\L': 'Ł',
    '\\ss': 'ss',
  }

  for (const [key, value] of Object.entries(latexTokens)) {
    text = text.replaceAll(key, value)
  }

  text = text.replace(/[{}]/g, '')
  text = text.replace(/~/g, ' ')
  text = text.replace(/\s+/g, ' ').trim()
  return text
}

function hasBalancedBraces(text: string): boolean {
  let depth = 0
  for (const ch of text) {
    if (ch === '{') {
      depth += 1
    } else if (ch === '}') {
      depth -= 1
      if (depth < 0) {
        return false
      }
    }
  }
  return depth === 0
}

function splitAuthors(rawAuthors: string): string[] {
  return rawAuthors
    .split(/\s+and\s+/i)
    .map((name) => name.trim())
    .filter(Boolean)
}

function formatAuthorName(rawName: string): string {
  const name = rawName.replace(/[{}]/g, '').trim()
  if (!name) {
    return ''
  }

  let last = ''
  let given = ''

  if (name.includes(',')) {
    const [lastPart, ...rest] = name.split(',')
    last = lastPart.trim()
    given = rest.join(' ').trim()
  } else {
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length === 1) {
      return parts[0]
    }
    last = parts[parts.length - 1]
    given = parts.slice(0, -1).join(' ')
  }

  const initials = given
    .replace(/~/g, ' ')
    .split(/[\s-]+/)
    .map((part) => part.replace(/[^\p{L}]/gu, ''))
    .filter(Boolean)
    .map((part) => `${part[0]}.`)
    .join(' ')

  return initials ? `${initials} ${last}` : last
}

function formatAuthors(rawAuthors: string): string {
  const names = splitAuthors(rawAuthors).map(formatAuthorName).filter(Boolean)
  if (names.length === 0) {
    return ''
  }
  if (names.length === 1) {
    return names[0]
  }
  if (names.length === 2) {
    return `${names[0]} and ${names[1]}`
  }
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`
}

function parseMonth(rawMonth: string): number {
  if (!rawMonth) {
    return 0
  }
  const value = rawMonth.trim().toLowerCase()
  const numeric = Number.parseInt(value, 10)
  if (Number.isFinite(numeric) && numeric >= 1 && numeric <= 12) {
    return numeric
  }
  return MONTH_MAP[value] ?? 0
}

function toKeywords(rawKeywords: string): string[] {
  if (!rawKeywords) {
    return []
  }
  return rawKeywords
    .split(/[;,]/)
    .map((keyword) => keyword.trim().toLowerCase())
    .filter(Boolean)
}

function normalizePublicationUrl(rawUrl: string, doi: string): string {
  const candidate = rawUrl.trim()
  if (candidate) {
    if (candidate.startsWith('//')) {
      return `https:${candidate}`
    }
    return candidate
  }

  return doi ? `https://doi.org/${doi}` : ''
}

function quoteTitle(title: string): string {
  if (!title) {
    return ''
  }
  return `“${title},”`
}

function joinCitationParts(parts: string[]): string {
  const filtered = parts.filter(Boolean)
  if (filtered.length === 0) {
    return ''
  }

  let output = filtered[0]
  for (let i = 1; i < filtered.length; i += 1) {
    const previous = filtered[i - 1]
    const separator = /,["”]$/.test(previous) ? ' ' : ', '
    output += `${separator}${filtered[i]}`
  }
  return output
}

function citationWithStatus(parts: string[], status?: string): string {
  const base = joinCitationParts(parts)
  if (!base) {
    return ''
  }

  const withPeriod = /[.!?]$/.test(base) ? base : `${base}.`
  if (!status) {
    return withPeriod
  }
  return `${withPeriod} (${status})`
}

function inferStatus(note: string, keywords: string[]): string | undefined {
  const normalizedNote = note.trim().toLowerCase()
  if (normalizedNote.includes('submitted')) {
    return 'Submitted'
  }
  if (normalizedNote.includes('in press') || normalizedNote === 'press') {
    return 'In Press'
  }
  if (normalizedNote.includes('in preparation') || normalizedNote === 'prep') {
    return 'In Preparation'
  }

  if (keywords.includes('sub')) {
    return 'Submitted'
  }
  if (keywords.includes('press')) {
    return 'In Press'
  }
  if (keywords.includes('prep')) {
    return 'In Preparation'
  }

  return undefined
}

function formatCitation(entry: BibEntry, status?: string): string {
  const type = entry.type
  const f = entry.fields
  const authors = formatAuthors(f.author ?? '')
  const title = quoteTitle(f.title ?? '')
  const year = f.year ? cleanValue(f.year) : ''
  const pages = f.pages ? cleanValue(f.pages) : ''

  if (type === 'article') {
    const journal = f.journal ? cleanValue(f.journal) : ''
    const booktitle = f.booktitle ? cleanValue(f.booktitle) : ''
    const venue = journal || booktitle
    const volume = f.volume ? cleanValue(f.volume) : ''
    const number = f.number ? cleanValue(f.number) : ''
    return citationWithStatus([
      authors,
      title,
      venue,
      volume ? `vol. ${volume}` : '',
      number ? `no. ${number}` : '',
      pages ? `pp. ${pages}` : '',
      year,
    ], status)
  }

  if (type === 'inproceedings' || type === 'incollection') {
    const booktitle = f.booktitle ? cleanValue(f.booktitle) : ''
    return citationWithStatus([
      authors,
      title,
      booktitle,
      pages ? `pp. ${pages}` : '',
      year,
    ], status)
  }

  if (type === 'techreport') {
    const institution = f.institution ? cleanValue(f.institution) : ''
    const number = f.number ? cleanValue(f.number) : ''
    return citationWithStatus([
      authors,
      title,
      institution || 'Tech. Rep.',
      number ? `Tech. Rep. ${number}` : '',
      year,
    ], status)
  }

  if (type === 'phdthesis') {
    const school = f.school ? cleanValue(f.school) : ''
    return citationWithStatus([
      authors,
      title,
      'Ph.D. dissertation',
      school,
      year,
    ], status)
  }

  const venue = cleanValue(f.journal || f.booktitle || f.publisher || '')
  return citationWithStatus([authors, title, venue, year], status)
}

function extractVenue(entry: BibEntry): string {
  const f = entry.fields
  const type = entry.type

  if (type === 'phdthesis') {
    return cleanValue(f.school || 'Ph.D. dissertation')
  }

  if (type === 'techreport') {
    return cleanValue(f.institution || 'Tech. Rep.')
  }

  return cleanValue(f.journal || f.booktitle || f.publisher || '')
}

function toPublication(entry: BibEntry): Publication {
  const keywords = toKeywords(entry.fields.keywords ?? '')
  const year = Number.parseInt(entry.fields.year ?? '', 10)
  const doi = cleanValue(entry.fields.doi ?? '')
  const rawUrl = cleanValue(entry.fields.url ?? '')
  const url = normalizePublicationUrl(rawUrl, doi)
  const note = cleanValue(entry.fields.note ?? '')
  const status = inferStatus(note, keywords)
  const abstract = cleanValue(entry.fields.abstract ?? '')

  return {
    key: entry.key,
    type: entry.type,
    title: cleanValue(entry.fields.title ?? ''),
    authors: splitAuthors(entry.fields.author ?? ''),
    authorsDisplay: formatAuthors(entry.fields.author ?? ''),
    year: Number.isFinite(year) ? year : null,
    month: parseMonth(entry.fields.month ?? ''),
    keywords,
    citation: formatCitation(entry, status),
    venue: extractVenue(entry) || undefined,
    abstract: abstract || undefined,
    bibtex: entry.raw || undefined,
    status,
    url: url || undefined,
    doi: doi || undefined,
  }
}

function byRecency(a: Publication, b: Publication): number {
  const yearA = a.year ?? 0
  const yearB = b.year ?? 0
  if (yearA !== yearB) {
    return yearB - yearA
  }
  if (a.month !== b.month) {
    return b.month - a.month
  }
  return a.title.localeCompare(b.title)
}

// Canonical "lastname|firstInitial" key for matching a bib author to a person.
function nameKey(rawName: string): string {
  const n = rawName.replace(/[{}.]/g, '').replace(/\s+/g, ' ').trim()
  if (!n) return ''
  let last: string
  let given: string
  if (n.includes(',')) {
    const [l, ...rest] = n.split(',')
    last = l.trim()
    given = rest.join(' ').trim()
  } else {
    const parts = n.split(' ').filter(Boolean)
    last = parts[parts.length - 1] ?? ''
    given = parts.slice(0, -1).join(' ')
  }
  const initial = (given.match(/\p{L}/u)?.[0] ?? '').toLowerCase()
  return `${last.toLowerCase()}|${initial}`
}

function personKey(person: { title: string; last: string }): string {
  const last = person.last.replace(/[{}.]/g, '').trim()
  // strip honorifics + the last name from the display title to isolate the given name
  const stripped = person.title
    .replace(/\b(prof|professor|dr|mr|mrs|ms)\.?\b/gi, '')
    .replace(new RegExp(`\\b${last.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'), '')
    .replace(/[{}.]/g, '')
    .trim()
  const initial = (stripped.match(/\p{L}/u)?.[0] ?? '').toLowerCase()
  return `${last.toLowerCase()}|${initial}`
}

// All publications co-authored by a given person, most recent first.
export function getPublicationsForPerson(person: { title: string; last: string }): Publication[] {
  const key = personKey(person)
  if (!key.endsWith('|') && key.includes('|')) {
    const all = getPublicationSections().flatMap((section) => section.items)
    return all.filter((pub) => pub.authors.some((a) => nameKey(a) === key)).sort(byRecency)
  }
  return []
}

export function getPublicationSections(): PublicationSection[] {
  if (cachedSections) {
    return cachedSections
  }

  const bibPath = path.join(process.cwd(), 'content/bibliography/ASL_Bib.bib')
  const source = fs.readFileSync(bibPath, 'utf8')
  const entries = splitBibEntries(source).map(toPublication)

  const preprints = entries
    .filter((entry) => entry.keywords.includes('sub'))
    .sort(byRecency)

  const publications = entries
    .filter((entry) => {
      if (entry.type === 'incollection' || entry.type === 'techreport') {
        return true
      }
      if (entry.type === 'article' || entry.type === 'inproceedings') {
        return !entry.keywords.includes('sub')
      }
      return false
    })
    .sort(byRecency)

  const theses = entries
    .filter((entry) => entry.type === 'phdthesis')
    .sort(byRecency)

  cachedSections = [
    { key: 'preprints', title: 'Preprints', items: preprints },
    { key: 'publications', title: 'Publications', items: publications },
    { key: 'theses', title: 'Theses', items: theses },
  ]

  return cachedSections
}
