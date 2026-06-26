import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'How to reach, find, and visit the Autonomous Systems Laboratory at Stanford University.',
}

function ContactDetails() {
  return (
    <Container className="mt-16">
      <Heading as="h1">Contact Us</Heading>
      <p className="mt-6 max-w-3xl text-2xl font-medium text-gray-500">
        We&apos;d love to hear from you. Here&apos;s where to find us and how to
        plan your visit to the lab.
      </p>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
        <div className="space-y-10">
          <div>
            <Subheading>Address</Subheading>
            <p className="mt-3 text-base/7 text-gray-600">
              Autonomous Systems Laboratory
              <br />
              Stanford University
              <br />
              Department of Aeronautics &amp; Astronautics
              <br />
              William F. Durand Building, Rm. 009
              <br />
              496 Lomita Mall
              <br />
              Stanford, CA 94305-4035
            </p>
          </div>

          <div>
            <Subheading>Finding us</Subheading>
            <p className="mt-3 text-base/7 text-gray-600">
              We&apos;re located in the William F. Durand Building at 496 Lomita
              Mall. The lab is in Room 009, on the basement level — head
              downstairs and you&apos;ll find us in the basement by the main
              elevator lobby.
            </p>
          </div>

          <div>
            <Subheading>Parking</Subheading>
            <p className="mt-3 text-base/7 text-gray-600">
              We kindly ask that visitors park in the{' '}
              <a
                href="https://maps.app.goo.gl/cdYeKHpHfa3mPqPk6"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-2 transition text-gray-900 decoration-gray-300 hover:decoration-gray-900"
              >
                Roble Field Garage
              </a>
              , which is a short walk from the Durand Building.
            </p>
          </div>

          <div>
            <Subheading>Visiting hours</Subheading>
            <p className="mt-3 text-base/7 text-gray-600">
              Please plan to arrive during normal business hours (Monday–Friday,
              9am–5pm). Outside of these times the building may be locked, so
              we&apos;d kindly ask that you schedule your visit accordingly.
            </p>
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <div className="-m-2 rounded-4xl bg-white/15 shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5">
            <div className="rounded-4xl p-2 shadow-md shadow-black/5">
              <div className="overflow-hidden rounded-3xl shadow-2xl outline outline-1 -outline-offset-1 outline-black/10">
                <iframe
                  title="Map to the Durand Building, Stanford University"
                  width="100%"
                  height="480"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.2!2d-122.1733!3d37.4267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fbb2aa1a2e6c7%3A0x150c778bd3b558cf!2sDurand%20Building%2C%20496%20Lomita%20Mall%2C%20Stanford%2C%20CA%2094305!5e0!3m2!1sen!2sus!4v1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default function Contact() {
  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <div className="pb-24">
        <ContactDetails />
      </div>
      <Footer />
    </main>
  )
}
