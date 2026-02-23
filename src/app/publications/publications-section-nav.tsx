'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

interface PublicationsSectionNavItem {
  id: string
  title: string
  years: { id: string; label: string }[]
}

export function PublicationsSectionNav({
  items,
}: {
  items: PublicationsSectionNavItem[]
}) {
  const sectionIds = useMemo(() => items.map((item) => item.id), [items])
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')
  const [activeYearId, setActiveYearId] = useState('')
  const [indicator, setIndicator] = useState({ top: 0, height: 0, visible: false })
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({})
  const activeSection = useMemo(
    () => items.find((item) => item.id === activeId),
    [activeId, items],
  )

  useEffect(() => {
    if (sectionIds.length === 0) {
      return
    }

    let raf = 0
    const activationOffset = 180

    const updateActiveSection = () => {
      let nextActive = sectionIds[0]

      for (const id of sectionIds) {
        const element = document.getElementById(id)
        if (!element) {
          continue
        }
        if (element.getBoundingClientRect().top - activationOffset <= 0) {
          nextActive = id
        }
      }

      setActiveId((current) => (current === nextActive ? current : nextActive))

      const activeSection = items.find((item) => item.id === nextActive)
      if (!activeSection || activeSection.years.length === 0) {
        setActiveYearId('')
        return
      }

      let nextYear = activeSection.years[0].id
      for (const year of activeSection.years) {
        const element = document.getElementById(year.id)
        if (!element) {
          continue
        }
        if (element.getBoundingClientRect().top - activationOffset <= 0) {
          nextYear = year.id
        }
      }

      setActiveYearId((current) => (current === nextYear ? current : nextYear))
    }

    const onScrollOrResize = () => {
      if (raf) {
        return
      }
      raf = window.requestAnimationFrame(() => {
        updateActiveSection()
        raf = 0
      })
    }

    updateActiveSection()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)

    return () => {
      if (raf) {
        window.cancelAnimationFrame(raf)
      }
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [items, sectionIds])

  useEffect(() => {
    if (!activeId) {
      return
    }

    const updateIndicator = () => {
      const activeItem = itemRefs.current[activeId]
      if (!activeItem) {
        return
      }

      setIndicator({
        top: activeItem.offsetTop,
        height: activeItem.offsetHeight,
        visible: true,
      })
    }

    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => {
      window.removeEventListener('resize', updateIndicator)
    }
  }, [activeId, items])

  if (items.length === 0) {
    return null
  }

  return (
    <nav aria-label="Publication sections">
      <div className="flex items-start gap-6">
        <ol className="relative min-w-[11rem] pl-5">
          <span
            aria-hidden
            className="pointer-events-none absolute top-0 bottom-0 left-0 w-px bg-gray-200"
          />
          <span
            aria-hidden
            className={`pointer-events-none absolute left-0 w-0.5 rounded-full bg-gray-900 transition-all duration-300 ${
              indicator.visible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: `translateY(${indicator.top}px)`,
              height: `${indicator.height}px`,
            }}
          />
          {items.map((item) => {
            const isActive = item.id === activeId
            return (
              <li
                key={item.id}
                ref={(element) => {
                  itemRefs.current[item.id] = element
                }}
                className="relative py-2"
              >
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`block pl-2 tracking-tight transition-all duration-300 ${
                    isActive
                      ? 'translate-x-1 text-gray-950'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <span
                    className={`tracking-tight transition-all duration-300 ${
                      isActive ? 'text-xl font-semibold' : 'text-base font-medium'
                    }`}
                  >
                    {item.title}
                  </span>
                </a>
              </li>
            )
          })}
        </ol>

        {activeSection && activeSection.years.length > 0 && (
          <div className="min-w-[4.5rem] border-l border-gray-200 pl-4 pt-2">
            <ol>
              {activeSection.years.map((year) => {
                const isActiveYear = year.id === activeYearId
                return (
                  <li key={year.id}>
                    <a
                      href={`#${year.id}`}
                      aria-current={isActiveYear ? 'true' : undefined}
                      className={`block py-1 text-sm transition-colors duration-200 ${
                        isActiveYear
                          ? 'font-semibold text-gray-900'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      {year.label}
                    </a>
                  </li>
                )
              })}
            </ol>
          </div>
        )}
      </div>
    </nav>
  )
}
