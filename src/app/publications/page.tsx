import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading } from '@/components/text'
import { getPublicationSections, type Publication } from '@/lib/publications'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Publications',
  description: 'Browse publications from the Autonomous Systems Lab.',
}

function groupByYear(items: Publication[]) {
  const groups = new Map<string, Publication[]>()

  for (const item of items) {
    const yearKey = item.year ? String(item.year) : 'Unknown'
    const current = groups.get(yearKey) ?? []
    current.push(item)
    groups.set(yearKey, current)
  }

  return [...groups.entries()]
}

function PublicationSection({
  title,
  items,
}: {
  title: string
  items: Publication[]
}) {
  const groups = groupByYear(items)

  const renderCitation = (item: Publication) => {
    const index = item.url && item.title ? item.citation.indexOf(item.title) : -1

    if (index >= 0 && item.url) {
      const before = item.citation.slice(0, index)
      const after = item.citation.slice(index + item.title.length)
      return (
        <>
          {before}
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-gray-950 underline decoration-gray-300 underline-offset-2 transition hover:decoration-gray-950"
          >
            {item.title}
          </a>
          {after}
        </>
      )
    }

    return item.citation
  }

  return (
    <section className="mt-18">
      <Heading as="h2">{title}</Heading>
      <div className="mt-8 rounded-2xl border border-gray-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
        {groups.length === 0 ? (
          <p className="text-sm text-gray-500">No entries found.</p>
        ) : (
          groups.map(([year, group]) => (
            <div key={year} className="mt-8 first:mt-0">
              <h3 className="text-lg font-semibold tracking-tight text-gray-950">{year}</h3>
              <ol className="mt-4 list-decimal space-y-4 pl-5 text-sm/7 text-gray-700">
                {group.map((item) => (
                  <li key={`${item.key}-${title}`}>
                    {renderCitation(item)}
                    {(item.bibtex || item.abstract) && (
                      <div className="mt-1 flex flex-wrap items-start gap-x-4 gap-y-2 text-xs leading-6">
                        {item.bibtex && (
                          <details>
                            <summary className="cursor-pointer list-none text-gray-500 transition hover:text-gray-900 [&::-webkit-details-marker]:hidden">
                              [BibTeX]
                            </summary>
                            <pre className="mt-2 max-h-56 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-[11px] leading-relaxed text-gray-700">
                              {item.bibtex}
                            </pre>
                          </details>
                        )}
                        {item.abstract && (
                          <details>
                            <summary className="cursor-pointer list-none text-gray-500 transition hover:text-gray-900 [&::-webkit-details-marker]:hidden">
                              [Abstract]
                            </summary>
                            <p className="mt-2 max-w-3xl rounded-lg border border-gray-200 bg-gray-50 p-3 text-[11px] leading-relaxed text-gray-700">
                              {item.abstract}
                            </p>
                          </details>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default function PublicationsPage() {
  const sections = getPublicationSections()

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <Container className="mt-16 pb-24">
        {sections.map((section) => (
          <PublicationSection
            key={section.key}
            title={section.title}
            items={section.items}
          />
        ))}
      </Container>
      <Footer />
    </main>
  )
}
