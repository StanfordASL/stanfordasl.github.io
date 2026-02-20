'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Publication, PublicationSection } from '@/lib/publications'

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

function toYearAnchorId(sectionKey: string, yearLabel: string) {
  const slug = yearLabel
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${sectionKey}-year-${slug || 'unknown'}`
}

function PublicationDisclosure({
  label,
  icon,
  children,
}: {
  label: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        title={label}
        className="cursor-pointer text-gray-400 transition hover:text-gray-900"
      >
        {icon}
      </button>
      {open ? children : null}
    </div>
  )
}

/* ─── Publication list with sticky year headers ─── */

function SectionContent({ section }: { section: PublicationSection }) {
  const groups = groupByYear(section.items)

  const renderStatus = (item: Publication) => {
    if (!item.status) return null
    return (
      <span className="ml-2 text-base font-normal italic text-gray-600">
        ({item.status})
      </span>
    )
  }

  const renderTitle = (item: Publication) => {
    if (item.url) {
      return (
        <>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="font-semibold tracking-tight text-gray-950 transition hover:text-gray-700"
          >
            {item.title}
          </a>
          {renderStatus(item)}
        </>
      )
    }
    return (
      <span className="font-semibold tracking-tight text-gray-950">
        {item.title}
        {renderStatus(item)}
      </span>
    )
  }

  return (
    <div>
      {groups.length === 0 ? (
        <p className="p-6 text-sm text-gray-500 sm:p-8">No entries found.</p>
      ) : (
        groups.map(([year, group]) => (
          <div key={year}>
            {/* Sticky year divider — frosted, edge-to-edge */}
            <div
              id={toYearAnchorId(section.key, year)}
              className="sticky top-[4.5rem] z-10 scroll-mt-[4.5rem] bg-white"
            >
              <div className="flex items-center gap-4 px-6 py-3.5 sm:px-8">
                <h3 className="shrink-0 text-[13px] font-bold tabular-nums tracking-wide text-gray-950">
                  {year}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
              </div>
            </div>

            {/* Publications for this year */}
            <ul className="space-y-6 px-6 pb-2 sm:px-8">
              {group.map((item) => (
                <li key={`${item.key}-${section.title}`}>
                  <div className="text-lg/7">{renderTitle(item)}</div>
                  <p className="mt-0.5 text-sm/6 text-gray-600">
                    {item.authorsDisplay}
                    {item.venue ? ` · ${item.venue}` : ''}
                  </p>
                  {(item.bibtex || item.abstract) && (
                    <div className="mt-1 flex flex-wrap items-start gap-x-3 gap-y-2">
                      {item.bibtex && (
                        <PublicationDisclosure
                          label="BibTeX"
                          icon={
                            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                          }
                        >
                          <pre className="mt-2 max-h-56 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-[11px] leading-relaxed text-gray-700">
                            {item.bibtex}
                          </pre>
                        </PublicationDisclosure>
                      )}
                      {item.abstract && (
                        <PublicationDisclosure
                          label="Abstract"
                          icon={
                            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                              <line x1="16" y1="13" x2="8" y2="13" />
                              <line x1="16" y1="17" x2="8" y2="17" />
                              <line x1="10" y1="9" x2="8" y2="9" />
                            </svg>
                          }
                        >
                          <p className="mt-2 max-w-3xl rounded-lg border border-gray-200 bg-gray-50 p-3 text-[11px] leading-relaxed text-gray-700">
                            {item.abstract}
                          </p>
                        </PublicationDisclosure>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  )
}

/* ─── Segmented tab control ─── */

function TabBar({
  sections,
  activeKey,
  onTabClick,
}: {
  sections: PublicationSection[]
  activeKey: string
  onTabClick: (key: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false })

  const updatePill = useCallback(() => {
    const el = tabRefs.current[activeKey]
    if (!el) return
    setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: true })
  }, [activeKey])

  useEffect(() => {
    updatePill()
    window.addEventListener('resize', updatePill)
    return () => window.removeEventListener('resize', updatePill)
  }, [updatePill])

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center rounded-full bg-gray-950/[0.04] p-1"
      role="tablist"
    >
      {/* Sliding pill indicator */}
      <div
        aria-hidden
        className={`absolute top-1 bottom-1 rounded-full bg-white shadow-sm ring-1 ring-black/[0.06] transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          pill.ready ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ left: `${pill.left}px`, width: `${pill.width}px` }}
      />

      {sections.map((section) => {
        const isActive = section.key === activeKey
        return (
          <button
            key={section.key}
            ref={(el) => {
              tabRefs.current[section.key] = el
            }}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabClick(section.key)}
            className={`relative z-10 flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 ${
              isActive
                ? 'text-gray-950'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {section.title}
            <span
              className={`text-[11px] tabular-nums transition-colors duration-200 ${
                isActive ? 'text-gray-400' : 'text-gray-400/50'
              }`}
            >
              {section.items.length}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ─── Main tabbed view ─── */

export function PublicationsTabbedView({
  sections,
}: {
  sections: PublicationSection[]
}) {
  const [activeKey, setActiveKey] = useState('publications')

  // Sync with URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && sections.some((s) => s.key === hash)) {
      setActiveKey(hash as typeof activeKey)
    }
  }, [sections])

  const activeSection = sections.find((s) => s.key === activeKey) ?? sections[0]

  const handleTabClick = (key: string) => {
    setActiveKey(key as typeof activeKey)
    window.history.replaceState(null, '', `#${key}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Sticky tab bar */}
      <div
        className="sticky top-0 z-20 -mx-6 bg-white px-6 lg:-mx-8 lg:px-8"
      >
        <div className="flex justify-center py-4">
          <TabBar
            sections={sections}
            activeKey={activeKey}
            onTabClick={handleTabClick}
          />
        </div>
      </div>

      {/* Content — full width, no sidebar */}
      <div className="mt-8">
        <SectionContent key={activeKey} section={activeSection} />
      </div>
    </>
  )
}
