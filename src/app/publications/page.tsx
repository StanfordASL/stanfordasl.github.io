import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { getPublicationSections } from '@/lib/publications'
import type { Metadata } from 'next'
import { PublicationsTabbedView } from './publications-tabbed-view'

export const metadata: Metadata = {
  title: 'Publications',
  description: 'Browse publications from the Autonomous Systems Lab.',
}

export default function PublicationsPage() {
  const sections = getPublicationSections()

  return (
    <main>
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <Container className="mt-16 pb-16">
        <PublicationsTabbedView sections={sections} />
      </Container>
      <Footer />
    </main>
  )
}
