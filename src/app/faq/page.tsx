import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about the Autonomous Systems Laboratory at Stanford University.',
}

function FrequentlyAskedQuestions() {
  return (
    <Container>
      <section id="faqs" className="scroll-mt-8">
        <Subheading className="text-center">
          Frequently asked questions
        </Subheading>

        {/* Admitted Students Section */}
        <div className="mt-12">
          <Heading as="h2" className="text-center">
            Admitted Students
          </Heading>
          <div className="mx-auto mt-16 max-w-3xl space-y-12">
            <dl>
              <dt className="text-base font-semibold">
                I&apos;ve been admitted as a Masters student. How do I become a PhD student in the ASL?
              </dt>
              <dd className="mt-4 text-base/7 text-gray-600">
                Congratulations on your admission to Stanford! In order to become a permanent member of the lab, you will need to do at least a quarter-long research rotation with the lab. Over the course of the rotation, we will see if there is a good fit. The number of new students accepted each year depends on the current size of the lab, available funding sources, and how your research interests align with the lab&apos;s research. Unfortunately, we get a lot of interest and we cannot accept every student.
              </dd>
              <dd className="mt-4 text-base/7 text-gray-600">
                Usually, Master&apos;s students are advised to first take AA 274A: Principles of Robotic Autonomy I (Fall), and AA 203: Introduction to Optimal Control Theory (Spring), and perform well in them, before rotating in the lab. The summer is a particularly good time to do a rotation because this allows students to focus more of their efforts on research and stress less about taking time away from courses.
              </dd>
            </dl>
            <dl>
              <dt className="text-base font-semibold">
                What does a rotation in the lab entail?
              </dt>
              <dd className="mt-4 text-base/7 text-gray-600">
                Usually, you will work on your own research problem with the guidance of one or more PhD students in the lab. Each rotation culminates in a research report as well as a presentation to the lab members.
              </dd>
            </dl>
            <dl>
              <dt className="text-base font-semibold">
                I&apos;m interested in robotics in general, how do I find out more about what the ASL does?
              </dt>
              <dd className="mt-4 text-base/7 text-gray-600">
                The easiest way is to check out our projects page and attend our lab meetings. Information about the lab meetings will be announced on this mailing list. You will get to learn about topics that the lab is interested in, and an opportunity to meet students in the lab.
              </dd>
              <dd className="mt-4 text-base/7 text-gray-600">
                Another way to learn more about the ASL is to take AA274: Principles of Robotic Autonomy, and AA203: Introduction to Optimal Control Theory.
              </dd>
            </dl>
            <dl>
              <dt className="text-base font-semibold">
                I&apos;m an undergrad/MS student interested in gaining some research experience from the ASL, but not looking to stay for the PhD. Can I still do a research rotation?
              </dt>
              <dd className="mt-4 text-base/7 text-gray-600">
                Yes! Please take a look at our research areas and our recent publications to see which areas you are most interested in.
              </dd>
            </dl>
          </div>
        </div>

        {/* Prospective Students Section */}
        <div className="mt-24">
          <Heading as="h2" className="text-center">
            Prospective Students
          </Heading>
          <div className="mx-auto mt-16 max-w-3xl space-y-12">
            <dl>
              <dt className="text-base font-semibold">
                I am thinking of applying to Stanford, how do I increase my chances of getting in or working in the ASL?
              </dt>
              <dd className="mt-4 text-base/7 text-gray-600">
                Thank you for your interest in the ASL&apos;s research. The lab does not partake in the admissions process, so we cannot provide information about your chances of admission and/or joining the ASL. If you have been accepted to Stanford, we will be happy to talk to you at visit day for admitted students, or when you arrive at Stanford.
              </dd>
            </dl>
            <dl>
              <dt className="text-base font-semibold">
                I am planning a visit to Stanford&apos;s campus. Can I have a tour of the lab?
              </dt>
              <dd className="mt-4 text-base/7 text-gray-600">
                Unfortunately, we get many requests and cannot usually give tours to individuals (otherwise, we&apos;d be giving tours all day, every day, and we wouldn&apos;t get any research done!)
              </dd>
            </dl>
            <dl>
              <dt className="text-base font-semibold">
                How can I apply for a postdoctoral position in the ASL?
              </dt>
              <dd className="mt-4 text-base/7 text-gray-600">
                If you are interested in becoming a postdoc in the ASL, please send an email with your CV and two representative publications.
              </dd>
            </dl>
          </div>
        </div>
      </section>
    </Container>
  )
}

export default function FAQ() {
  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <div className="pt-16 pb-16">
        <FrequentlyAskedQuestions />
      </div>
      <Footer />
    </main>
  )
}
