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
  github?: string
  linkedin?: string
  email?: string
  excerpt?: string
  current?: string
  content: string
  slug: string
}

const peopleDirectory = path.join(process.cwd(), 'public/_people')

function personFiles(): string[] {
  return fs.readdirSync(peopleDirectory).filter((file) => file.endsWith('.markdown'))
}

function readPerson(fileName: string): Person {
  const filePath = path.join(peopleDirectory, fileName)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    title: data.title || '',
    last: data.last || '',
    position: data.position || '',
    img: data.img || '',
    website: data.website || undefined,
    gscholar: data.gscholar || undefined,
    github: data.github || undefined,
    linkedin: data.linkedin || undefined,
    email: data.email || undefined,
    excerpt: data.excerpt || undefined,
    current: data.current || undefined,
    content: content.trim(),
    slug: fileName.replace(/\.markdown$/, ''),
  }
}

export function getPeopleByPosition(position: string): Person[] {
  return personFiles()
    .map(readPerson)
    .filter((person) => person.position === position)
    .sort((a, b) => a.last.localeCompare(b.last))
}

export function getFaculty(): Person[] {
  return getPeopleByPosition('faculty')
}

export function getPeopleByPositions(positions: string[]): Person[] {
  return personFiles()
    .map(readPerson)
    .filter((person) => positions.includes(person.position))
    .sort((a, b) => a.last.localeCompare(b.last))
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

// People who get an individual profile page: everyone with a real bio file.
// The visiting-researchers entry is a table (visiting.markdown), not a person.
export function getProfiledPeople(): Person[] {
  return personFiles()
    .map(readPerson)
    .filter((person) => person.position !== 'visiting')
}

export function getPersonBySlug(slug: string): Person | null {
  const filePath = path.join(peopleDirectory, `${slug}.markdown`)
  if (!fs.existsSync(filePath)) return null
  const person = readPerson(`${slug}.markdown`)
  return person.position === 'visiting' ? null : person
}
