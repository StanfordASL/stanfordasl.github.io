import { Container } from '@/components/container'
import { AutonomyStackDiagram } from '@/components/autonomy-stack-diagram'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { DataFlywheel } from '@/components/data-flywheel'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Research',
  description:
    'Explore the six core research thrusts of the Autonomous Systems Lab at Stanford University.',
}

function Header() {
  return (
    <Container className="mt-16">
      <div className="relative overflow-hidden rounded-4xl bg-[url(/visual-highlights/2.jpg)] bg-cover" style={{ backgroundPosition: 'center 40%' }}>
        <div className="absolute inset-0 bg-gray-950/60" />
        <div className="relative px-8 py-24 sm:px-16">
          <Heading as="h1" dark>Research</Heading>
          <p className="mt-6 max-w-3xl text-2xl font-medium text-gray-200">
            Our research is organized around six core thrusts that together span
            the full autonomy stack — from foundational models and scalable
            backbones, to safety, data-driven improvement, high-performance
            control, and application-driven deployment.
          </p>
        </div>
      </div>
    </Container>
  )
}

function ThrustSection({
  id,
  eyebrow,
  title,
  description,
  papers,
  graphic,
  dark = false,
  reverse = false,
}: {
  id: string
  eyebrow: string
  title: string
  description: React.ReactNode
  papers: { title: string; venue: string; year: string; url: string }[]
  graphic: React.ReactNode
  dark?: boolean
  reverse?: boolean
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <Container className="py-28">
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2">
          <div className={`${reverse ? 'lg:order-2' : ''} [&>*]:h-full [&>*>img]:h-full [&>*>img]:object-cover`}>
            {graphic}
          </div>
          <div className={reverse ? 'lg:order-1' : ''}>
            <Subheading dark={dark}>{eyebrow}</Subheading>
            <Heading as="h3" className="mt-2 !text-3xl sm:!text-5xl" dark={dark}>
              {title}
            </Heading>
            <div
              className={`mt-6 max-w-xl text-base/7 ${dark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {description}
            </div>
            <div className="mt-8 max-w-xl">
              <p
                className={`text-xs font-semibold tracking-[0.16em] uppercase ${dark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Representative Papers
              </p>
              <ul className="mt-3 space-y-2">
                {papers.map((paper) => (
                  <li key={`${id}-${paper.title}`} className="flex gap-2 text-sm/5">
                    <span className={`mt-0.5 shrink-0 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                    <span>
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`font-medium underline underline-offset-2 transition ${dark ? 'text-white decoration-gray-600 hover:decoration-white' : 'text-gray-900 decoration-gray-300 hover:decoration-gray-900'}`}
                      >
                        {paper.title}
                      </a>
                      <span className={dark ? ' text-gray-400' : ' text-gray-600'}>
                        {' · '}
                        <span className="whitespace-nowrap">
                          {paper.venue}, {paper.year}
                        </span>
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
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
        papers={[
          {
            title:
              'Self-Supervised Bootstrapping of Action-Predictive Embodied Reasoning',
            venue: 'ArXiv',
            year: '2026',
            url: 'https://arxiv.org/abs/2602.08167',
          },
          {
            title:
              'RoboMonkey: Scaling Test-Time Sampling and Verification for Vision-Language-Action Models',
            venue: 'CoRL',
            year: '2025',
            url: 'https://arxiv.org/abs/2506.17811',
          },
          {
            title:
              'Space-LLaVA: a Vision-Language Model Adapted to Extraterrestrial Applications',
            venue: 'IEEE Aerospace Conference',
            year: '2025',
            url: 'https://arxiv.org/abs/2408.05924',
          },
        ]}
        graphic={
          <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/10">
            <img alt="" src="/visual-highlights/3.jpg" className="w-full object-cover" />
          </div>
        }
      />

      {/* Thrust 2: Backbone — dark band */}
      <div className="bg-gray-900 bg-[url(/dot-texture.svg)] py-8">
        <ThrustSection
          id="backbone"
          eyebrow="Thrust 2"
          title="Embodied AI Agents"
          description="Modern agentic systems can orchestrate complex work in the digital world, drawing on planning, tool use, and broad world knowledge. A natural next step is to extend these capabilities from digital tasks to physical ones, augmenting robotic systems with the same flexibility. Yet this translation is far from straightforward. Foundation models are largely trained on data that disregards the multi-modal signals central to robotics, and agentic reasoning has not been designed with embodied use cases in mind. At the same time, agentic systems excel precisely in the complex, open-ended settings that demand handling novel scenarios never encountered during training, which is exactly the regime in which future mobile robots must operate. Agentic systems therefore present a significant opportunity, alongside central difficulties.
            
            We develop methods that let agents control robotic embodiments, build a grounded understanding of their environments, and reason about the actions available to them. We study tool use both as a means of interacting with the physical world and as a way to resolve uncertainty by actively drawing information from the environment. Our extensive expertise in the optimization of large-scale systems offers a novel perspective on orchestration and lets us rethink reasoning in a robotic context, recognizing that embodied agents must form their understanding of the world from far richer sensory streams than VLMs or digital agentic systems. The central challenge, then, is interpreting this multi-modal input while respecting real-time compute constraints."
          papers={[
            {
              title:
                'Structured World-State Reasoning for Agentic Robotic Search',
              venue: 'CoRL (submitted)',
              year: '2026',
              url: '',
            },
            {
              title: 'FARM: Find Anything using Relational Spatial Memory',
              venue: 'CoRL (submitted)',
              year: '2026',
              url: 'https://openreview.net/forum?id=zCXivnAbeu',
            },
            {
              title:
                'SPACER: Robotic Data Scientist Framework for Actionable Failure Explanations',
              venue: 'CoRL (submitted)',
              year: '2026',
              url: '',
            },
          ]}
          dark
          reverse
          graphic={
            <AutonomyStackDiagram />
          }
        />
      </div>

      {/* Thrust 3: Safety — white */}
      <ThrustSection
        id="safety"
        eyebrow="Thrust 3"
        title="Trustworthiness in Physical AI"
        description="Our research integrates monitoring, guardrailing, and alignment techniques that keep embodied systems safe, predictable, and reliable in the real world. We develop trustworthy physical AI that operators and society can depend on in high-stakes environments."
        papers={[
          {
            title:
              'Real-Time Out-of-Distribution Failure Prevention via Multi-Modal Reasoning',
            venue: 'CoRL',
            year: '2025',
            url: 'https://arxiv.org/abs/2505.10547',
          },
          {
            title:
              'Vision Foundation Model Embedding-based Semantic Anomaly Detection',
            venue: 'ICRA Workshop',
            year: '2025',
            url: 'https://arxiv.org/abs/2505.07998',
          },
          {
            title:
              'Unpacking Failure Modes of Generative Policies: Runtime Monitoring of Consistency and Progress',
            venue: 'CoRL',
            year: '2024',
            url: 'https://arxiv.org/abs/2410.04640',
          },
        ]}
        graphic={
          <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/10">
            <img alt="" src="/visual-highlights/5.JPG" className="w-full object-cover" />
          </div>
        }
      />

      {/* Thrust 4: Data Flywheel — dark band */}
      <div className="bg-gray-900 bg-[url(/dot-texture.svg)] py-8">
        <ThrustSection
          id="data-flywheel"
          eyebrow="Thrust 4"
          title="Data Flywheels for Robotics"
          description={<>
            <p>A data flywheel is a cycle of self-improvement in which robot deployment experience feeds back to improve the policies and perception models that generated it. Building an effective flywheel is a multi-stage problem. Policies are deployed within a safety envelope; each deployment generates telemetry capturing multi-modal rollout data; targeted data collection gathers data that addresses observed failure modes; curation filters out existing data causally linked to those failures; and the resulting dataset trains the next policy before redeployment. Each stage is coupled to the others: tighter safety envelopes shape the distribution of rollout data, failure attribution enables both targeted data collection and principled data curation, which together form an improved dataset to train the next policy with.</p>
            <p className="mt-4">Our research develops the methodology to close this loop both reliably and effectively, working toward robotic systems that earn broader autonomy through accumulated deployment experience.</p>
          </>}
          papers={[
            {
              title:
                'CUPID: Curating Data your Robot Loves with Influence Functions',
              venue: 'CoRL',
              year: '2025',
              url: 'https://arxiv.org/abs/2506.19121',
            },
            {
              title:
                'Realistic Extreme Behavior Generation for Improved AV Testing',
              venue: 'IEEE ICRA',
              year: '2025',
              url: 'https://arxiv.org/pdf/2409.10669',
            },
            {
              title:
                'Data Lifecycle Management in Evolving Input Distributions for Learning-based Aerospace Applications',
              venue: 'IEEE Aerospace Conference',
              year: '2023',
              url: 'https://arxiv.org/abs/2209.06855',
            },
          ]}
          dark
          reverse
          graphic={
            <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10">
              <DataFlywheel className="h-full w-full origin-center scale-[0.92]" />
            </div>
          }
        />
      </div>

      {/* Thrust 5: Control — white */}
      <ThrustSection
        id="control"
        eyebrow="Thrust 5"
        title="Optimal &amp; Learning-based Control"
        description="We integrate optimization-based methods with AI-driven policies to achieve high-performance control at the physical edge. Our work pushes autonomous systems to operate at the limits of what is dynamically feasible."
        papers={[
          {
            title:
              'Discovering Dominant Dynamics for Nonlinear Continuum Robot Control',
            venue: 'npj Robotics',
            year: '2025',
            url: 'https://www.nature.com/articles/s44182-025-00021-8',
          },
          {
            title:
              'Transformer-based Model Predictive Control: Trajectory Optimization via Sequence Modeling',
            venue: 'IEEE RA-L',
            year: '2024',
            url: '/wp-content/papercite-data/pdf/Celestini.Gammelli.ea.RAL24.pdf',
          },
          {
            title:
              'Practical Deployment of Spectral Submanifold Reduction for Optimal Control of High-Dimensional Systems',
            venue: 'IFAC World Congress',
            year: '2023',
            url: '/wp-content/papercite-data/pdf/Alora.Cenedese.IFAC23.pdf',
          },
        ]}
        graphic={
          <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/10">
            <img alt="" src="/visual-highlights/2.jpg" className="w-full object-cover" />
          </div>
        }
      />

      {/* Thrust 6: Applications — dark band */}
      <div className="bg-gray-900 bg-[url(/dot-texture.svg)] py-8">
        <ThrustSection
          id="applications"
          eyebrow="Thrust 6"
          title="Applied Autonomy"
          description="We deploy autonomy in high-impact real-world settings, including unconventional space robotics, space foundation-model workflows, robotic manipulation, aerospace and defense mission scenarios, soft robots, quadruped navigation, and autonomous vehicles."
          papers={[
            {
              title:
                'Locomotion as manipulation with ReachBot',
              venue: 'Science Robotics',
              year: '2024',
              url: 'https://www.science.org/doi/abs/10.1126/scirobotics.adi9762',
            },
            {
              title:
                'Testing Gecko-Inspired Adhesives with Astrobee Aboard the ISS',
              venue: 'IEEE Robotics and Automation Magazine',
              year: '2022',
              url: 'https://ieeexplore.ieee.org/document/9783137',
            },
            {
              title:
                'Realistic Extreme Behavior Generation for Improved AV Testing',
              venue: 'IEEE ICRA',
              year: '2025',
              url: 'https://arxiv.org/pdf/2409.10669',
            },
          ]}
          dark
          reverse
          graphic={
            <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10">
              <img alt="" src="/visual-highlights/1.jpeg" className="w-full object-cover" />
            </div>
          }
        />
      </div>

      <Footer />
    </main>
  )
}
