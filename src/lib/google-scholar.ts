const SCHOLAR_ORIGIN = 'https://scholar.google.com'

export const MARCO_PAVONE_SCHOLAR_URL =
  'https://scholar.google.com/citations?user=RhOpyXcAAAAJ'

const HTML_ENTITY_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
}

export interface ScholarPublication {
  title: string
  authors: string
  venue: string
  year: number | null
  link: string
}

function extractUserId(profileUrl: string): string {
  const parsed = new URL(profileUrl)
  const userId = parsed.searchParams.get('user')

  if (!userId) {
    throw new Error('Google Scholar profile URL is missing the "user" parameter.')
  }

  return userId
}

function stripTags(text: string): string {
  return text.replace(/<[^>]+>/g, ' ')
}

function decodeHtml(text: string): string {
  const withNamed = text.replace(
    /&(amp|lt|gt|quot|#39|nbsp);/g,
    (entity) => HTML_ENTITY_MAP[entity] ?? entity,
  )

  const withDecimal = withNamed.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(Number(code)),
  )

  const withHex = withDecimal.replace(/&#x([0-9a-fA-F]+);/g, (_, code) =>
    String.fromCharCode(parseInt(code, 16)),
  )

  return withHex.replace(/\s+/g, ' ').trim()
}

function extractAttr(tag: string, attr: 'href' | 'data-href'): string | null {
  const match = tag.match(new RegExp(`${attr}="([^"]+)"`))
  return match ? match[1] : null
}

function parseScholarRows(html: string): ScholarPublication[] {
  const rowMatches = html.match(/<tr class="gsc_a_tr"[\s\S]*?<\/tr>/g) ?? []
  const publications: ScholarPublication[] = []

  for (const row of rowMatches) {
    const titleMatch = row.match(/class="gsc_a_at"[^>]*>([\s\S]*?)<\/a>/)
    const title = titleMatch ? decodeHtml(stripTags(titleMatch[1])) : ''
    if (!title) {
      continue
    }

    const anchorTagMatch = row.match(/<a[^>]*class="gsc_a_at"[^>]*>/)
    const anchorTag = anchorTagMatch?.[0] ?? ''
    const href = extractAttr(anchorTag, 'href') ?? extractAttr(anchorTag, 'data-href')
    const link = href
      ? href.startsWith('http')
        ? href
        : `${SCHOLAR_ORIGIN}${href.startsWith('/') ? '' : '/'}${href}`
      : MARCO_PAVONE_SCHOLAR_URL

    const grayBlocks = [...row.matchAll(/<div class="gs_gray">([\s\S]*?)<\/div>/g)].map(
      (match) => decodeHtml(stripTags(match[1])),
    )

    const yearText =
      row.match(/class="gsc_a_yi">([\s\S]*?)<\/span>/)?.[1] ??
      row.match(/class="gsc_a_h gsc_a_hc gs_ibl">([\s\S]*?)<\/span>/)?.[1] ??
      ''
    const parsedYear = Number.parseInt(
      (decodeHtml(stripTags(yearText)).match(/\b\d{4}\b/) ?? [])[0] ?? '',
      10,
    )

    publications.push({
      title,
      authors: grayBlocks[0] ?? '',
      venue: grayBlocks[1] ?? '',
      year: Number.isFinite(parsedYear) ? parsedYear : null,
      link,
    })
  }

  return publications
}

export async function getScholarPublications(
  profileUrl = MARCO_PAVONE_SCHOLAR_URL,
): Promise<ScholarPublication[]> {
  const userId = extractUserId(profileUrl)
  const pageSize = 100
  const maxPages = 20
  const seen = new Set<string>()
  const publications: ScholarPublication[] = []

  for (let page = 0; page < maxPages; page += 1) {
    const cstart = page * pageSize
    const url = `${SCHOLAR_ORIGIN}/citations?hl=en&user=${encodeURIComponent(
      userId,
    )}&view_op=list_works&sortby=pubdate&cstart=${cstart}&pagesize=${pageSize}`

    const response = await fetch(url, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
        'accept-language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 60 * 60 * 12 },
    })

    if (!response.ok) {
      throw new Error(`Google Scholar request failed (${response.status}).`)
    }

    const html = await response.text()
    const pageRows = parseScholarRows(html)

    if (pageRows.length === 0) {
      break
    }

    for (const publication of pageRows) {
      const key = `${publication.title}|${publication.year ?? 'unknown'}`
      if (seen.has(key)) {
        continue
      }

      seen.add(key)
      publications.push(publication)
    }

    if (pageRows.length < pageSize) {
      break
    }
  }

  return publications.sort(
    (a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title),
  )
}
