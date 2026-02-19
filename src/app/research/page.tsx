import { BentoCard } from '@/components/bento-card'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { DataFlywheel } from '@/components/data-flywheel'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Research',
  description:
    'Explore the five core research thrusts of the Autonomous Systems Lab at Stanford University.',
}

function Header() {
  return (
    <Container className="mt-16">
      <Heading as="h1">Research</Heading>
      <Lead className="mt-6 max-w-3xl">
        Our research is organized around five core thrusts that together span
        the full autonomy stack — from foundational models and scalable
        backbones, to safety, data-driven improvement, and high-performance
        control.
      </Lead>
      <div className="mt-16 overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/10">
        <img
          alt="Stanford Robotics Lab"
          src="/visual-highlights/2.jpg"
          className="w-full object-cover"
          style={{ maxHeight: '400px' }}
        />
      </div>
    </Container>
  )
}

function ThrustSection({
  id,
  eyebrow,
  title,
  description,
  graphic,
  dark = false,
  reverse = false,
}: {
  id: string
  eyebrow: string
  title: string
  description: string
  graphic: React.ReactNode
  dark?: boolean
  reverse?: boolean
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <Container className="py-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className={reverse ? 'lg:order-2' : ''}>
            {graphic}
          </div>
          <div className={reverse ? 'lg:order-1' : ''}>
            <Subheading dark={dark}>{eyebrow}</Subheading>
            <Heading as="h3" className="mt-2" dark={dark}>
              {title}
            </Heading>
            <p
              className={`mt-6 max-w-xl text-base/7 ${dark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {description}
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default function Research() {
  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <Header />

      {/* Thrust 1: Foundations — graphic left, text right */}
      <ThrustSection
        id="foundations"
        eyebrow="Thrust 1"
        title="Foundation Models"
        description="We develop foundation models tailored for embodied intelligence, forming the core architecture for scalable, adaptive, and robust autonomous systems. Our work spans representation learning, generative modeling, and multi-modal reasoning — all aimed at building the next autonomy stack from the ground up."
        graphic={
          <BentoCard
            eyebrow="Foundation Models"
            title="Build the next autonomy stack"
            description=""
            graphic={
              <div className="h-80 bg-[url(/visual-highlights/1.jpeg)] bg-cover bg-center" />
            }
            fade={['bottom']}
          />
        }
      />

      {/* Thrust 2: Backbone — text left, graphic right */}
      <ThrustSection
        id="backbone"
        eyebrow="Thrust 2"
        title="Structured Policy Learning"
        description="We study how large-scale backbones can drive better robotic behavior, developing scaling laws and structured policies that translate directly to real-world performance. From models to machines, we bridge the gap between powerful pretrained representations and the embodied tasks that demand them."
        reverse
        graphic={
          <BentoCard
            eyebrow="Structured Policy Learning"
            title="From models to machines"
            description=""
            graphic={
              <div className="absolute inset-0 bg-[url(/visual-highlights/3.jpg)] bg-cover bg-center" />
            }
            fade={['bottom']}
          />
        }
      />

      {/* Dark band — Thrusts 3 & 4 */}
      <div className="mx-2 mt-24 rounded-4xl bg-gray-900 bg-[url(/dot-texture.svg)] py-8">
        {/* Thrust 3: Safety — graphic left, text right */}
        <ThrustSection
          id="safety"
          eyebrow="Thrust 3"
          title="Trustworthiness in Physical AI"
          description="Our research integrates monitoring, guardrailing, and alignment techniques that keep embodied systems safe, predictable, and reliable in the real world. We develop trustworthy physical AI that operators and society can depend on in high-stakes environments."
          dark
          graphic={
            <BentoCard
              dark
              eyebrow="Trustworthiness in Physical AI"
              title="Trustworthy physical AI"
              description=""
              graphic={
                <div className="absolute inset-0 bg-[url(/visual-highlights/4.jpg)] bg-cover bg-center" />
              }
              fade={['bottom']}
            />
          }
        />

        {/* Thrust 4: Data Flywheel — text left, graphic right */}
        <ThrustSection
          id="data-flywheel"
          eyebrow="Thrust 4"
          title="Data Flywheels for Robotics"
          description="We design automated evaluation and data pipelines that close feedback loops and enable continuously advancing robotic systems. By turning deployment experience into training signal, we create self-improving autonomy that gets better with every interaction."
          dark
          reverse
          graphic={
            <BentoCard
              dark
              eyebrow="Data Flywheels for Robotics"
              title="Self-improving autonomy"
              description=""
              graphic={<DataFlywheel className="scale-[1.2]" />}
            />
          }
        />
      </div>

      {/* Thrust 5: Control — light gray band */}
      <div className="mx-2 mt-24 mb-24 rounded-4xl bg-gray-50">
        <ThrustSection
          id="control"
          eyebrow="Thrust 5"
          title="Learning &amp; Optimization-based Control"
          description="We integrate optimization-based methods with AI-driven policies to achieve high-performance control at the physical edge. Our work pushes autonomous systems to operate at the limits of what is dynamically feasible."
          graphic={
            <BentoCard
              eyebrow="Learning &amp; Optimization-based Control"
              title="Operate at the limits"
              description=""
              graphic={
                <div className="absolute inset-0 bg-[url(/visual-highlights/5.JPG)] bg-cover bg-center" />
              }
              fade={['bottom']}
            />
          }
        />
      </div>

      <Footer />
    </main>
  )
}
