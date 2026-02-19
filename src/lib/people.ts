import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

export interface Person {
  title: string
  last: string
  position: string
  img: string
  website?: string
  gscholar?: string
  excerpt?: string
  current?: string
  content: string
  slug: string
}

const peopleDirectory = path.join(process.cwd(), 'public/_people')

export function getPeopleByPosition(position: string): Person[] {
  const fileNames = fs.readdirSync(peopleDirectory).filter((file) => file.endsWith('.markdown'))

  const people = fileNames
    .map((fileName) => {
      const filePath = path.join(peopleDirectory, fileName)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)

      if (data.position !== position) {
        return null
      }

      return {
        title: data.title || '',
        last: data.last || '',
        position: data.position || '',
        img: data.img || '',
        website: data.website || undefined,
        gscholar: data.gscholar || undefined,
        excerpt: data.excerpt || undefined,
        current: data.current || undefined,
        content: content.trim(),
        slug: fileName.replace(/\.markdown$/, ''),
      } as Person
    })
    .filter((person): person is Person => person !== null)

  return people.sort((a, b) => a.last.localeCompare(b.last))
}

export function getFaculty(): Person[] {
  return getPeopleByPosition('faculty')
}

export function getPeopleByPositions(positions: string[]): Person[] {
  const fileNames = fs.readdirSync(peopleDirectory).filter((file) => file.endsWith('.markdown'))

  const people = fileNames
    .map((fileName) => {
      const filePath = path.join(peopleDirectory, fileName)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)

      if (!positions.includes(data.position)) {
        return null
      }

      return {
        title: data.title || '',
        last: data.last || '',
        position: data.position || '',
        img: data.img || '',
        website: data.website || undefined,
        gscholar: data.gscholar || undefined,
        excerpt: data.excerpt || undefined,
        current: data.current || undefined,
        content: content.trim(),
        slug: fileName.replace(/\.markdown$/, ''),
      } as Person
    })
    .filter((person): person is Person => person !== null)

  return people.sort((a, b) => a.last.localeCompare(b.last))
}

export function getResearchTeam(): Person[] {
  return getPeopleByPositions(['phd', 'postdoc'])
}

export function getExternalAffiliates(): Person[] {
  return getPeopleByPosition('externalresearchaffiliate')
}

export function getAlumni(): Person[] {
  return getPeopleByPosition('alumni')
}

export function getVisiting(): Person[] {
  return getPeopleByPosition('visiting')
}
