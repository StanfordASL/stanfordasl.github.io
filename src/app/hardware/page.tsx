import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading } from '@/components/text'
import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Hardware',
  description:
    'The robotic platforms used in research at the Autonomous Systems Lab at Stanford University.',
}

function PlaceholderImage() {
  return (
    <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-100 shadow-lg ring-1 ring-black/10">
      <span className="text-sm font-medium text-gray-400">Placeholder</span>
    </div>
  )
}

type Paper = { title: string; venue?: string; year?: string; url: string }

function RobotSection({
  name,
  description,
  papers = [],
  imageSrc,
}: {
  name: string
  description: React.ReactNode
  papers?: Paper[]
  imageSrc?: string
}) {
  return (
    <div className="border-t border-gray-100 py-20 first:border-t-0">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
        {imageSrc ? (
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-lg ring-1 ring-black/10">
            <Image
              src={imageSrc}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        ) : (
          <PlaceholderImage />
        )}
        <div>
          <Heading as="h2" className="!text-3xl sm:!text-4xl">
            {name}
          </Heading>
          <div className="mt-6 space-y-4 text-base/7 text-gray-600">
            {description}
          </div>
          {papers.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-gray-700">
                Representative Papers
              </p>
              <ul className="mt-3 space-y-2">
                {papers.map((paper) => (
                  <li key={paper.title} className="flex gap-2 text-sm/5">
                    <span className="mt-0.5 shrink-0 text-gray-400">•</span>
                    <span>
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-2 transition text-gray-900 decoration-gray-300 hover:decoration-gray-900"
                      >
                        {paper.title}
                      </a>
                      {paper.venue && (
                        <span className="text-gray-600">
                          {' · '}
                          <span className="whitespace-nowrap">
                            {paper.venue}{paper.year ? `, ${paper.year}` : ''}
                          </span>
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Hardware() {
  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>

      <Container className="mt-16">
        <Heading as="h1">Hardware</Heading>
        <p className="mt-6 max-w-3xl text-2xl font-medium text-gray-500">
          Our lab operates a range of robotic platforms that span legged
          locomotion, humanoid whole-body control, and spacecraft proximity
          operations — providing the physical testbeds that ground our
          algorithms in the real world.
        </p>
      </Container>

      <Container className="mt-16 pb-24">
        <RobotSection
          name="Unitree Go2 Quadruped"
          imageSrc="/hardware/quad.png"
          description={
            <>
              <p>
                The Unitree Go2 is a high-performance legged quadruped designed
                for agile locomotion over complex and unstructured terrain.
                Equipped with onboard compute, force-torque sensing at each
                leg, and a suite of depth cameras and LiDAR, it provides a
                capable and accessible platform for deploying learned
                locomotion and navigation policies in the real world.
              </p>
              <p>
                We use the Go2 to study how learning-based controllers
                transfer from simulation to physical hardware — enabling
                robots to traverse challenging environments, avoid obstacles,
                and execute long-horizon navigation tasks with minimal human
                supervision. The platform also serves as a testbed for
                real-time safety monitoring frameworks that must operate
                reliably under the physical constraints and sensor noise of
                outdoor deployment.
              </p>
            </>
          }
          papers={[
            {
              title: 'GLST: Global-Local Spatio-Temporal Memory Decomposition Framework for Online Chained-Goal Navigation',
              url: 'https://openreview.net/forum?id=xyFvvMLQRo#discussion',
            },
            {
              title: 'FARM: Find Anything using Relational Spatial Memory',
              url: 'https://openreview.net/forum?id=zCXivnAbeu#discussion',
            },
            {
              title: 'Structured World-State Reasoning for Agentic Robotic Search',
              url: 'https://openreview.net/forum?id=knMWgjCZvA#discussion',
            },
          ]}
        />

        <RobotSection
          name="Unitree G1 Humanoid"
          description={
            <>
              <p>
                The United G1 is a full-size humanoid robot with 29 degrees of
                freedom, capable of standing, walking, and performing dextrous
                whole-body tasks. Its human-like form factor is well-suited for
                operation in environments designed for people, and its high
                degree-of-freedom kinematic structure and hybrid dynamics pose
                rich challenges for whole-body control, motion imitation, and
                safe policy deployment.
              </p>
              <p>
                We use the G1 as a platform to develop and evaluate
                constraint-aware control frameworks that combine reinforcement
                learning with real-time safety filters. Our work enables
                policies trained entirely in simulation to satisfy complex
                physical constraints (including joint limits, collision
                avoidance, and center-of-mass stability) at runtime without
                retraining. This makes it possible to retrofit any learned
                policy with safety, and adapt to constraints on the fly, as
                task requirements change.
              </p>
            </>
          }
          papers={[
            {
              title: 'Constrained Whole-Body Tracking for Humanoid Robots',
              venue: 'arXiv',
              year: '2026',
              url: 'https://arxiv.org/abs/2606.00374',
            },
          ]}
        />

        <RobotSection
          name="FreeFlyer"
          imageSrc="/hardware/ff.png"
          description={
            <>
              <p>
                The FreeFlyer is an air-bearing spacecraft testbed that floats
                frictionlessly on a flat granite surface, enabling
                hardware-in-the-loop experiments that replicate the dynamics
                of orbital proximity operations. Equipped with onboard
                computing, cold-gas thrusters, and a vision system, the
                platform is ideal for validating algorithms for spacecraft
                rendezvous, autonomous docking, and guidance, navigation, and
                control (GNC) without requiring a full space environment.
              </p>
              <p>
                Our research on the FreeFlyer spans transformer-based
                trajectory optimization, model predictive control accelerated
                by learned initializations, and semantic language-guided
                mission planning — developing the algorithmic foundations for
                safe, autonomous spacecraft operations in the vicinity of
                other space objects. The platform bridges the gap between
                pure simulation and on-orbit validation, letting us stress-test
                algorithms under realistic actuation and sensing constraints
                before deployment.
              </p>
            </>
          }
          papers={[
            {
              title:
                'Design and Development of a Gecko-Adhesive Gripper for the Astrobee Free-Flying Robot',
              url: 'https://arxiv.org/abs/2009.09151',
            },
            {
              title:
                'Semantic Trajectory Generation for Goal-Oriented Spacecraft Rendezvous',
              url: 'https://semantic-guidance4space.github.io/',
            },
            {
              title:
                'Transformer-based Model Predictive Control: Trajectory Optimization via Sequence Modeling',
              venue: 'IEEE RA-L',
              year: '2024',
              url: 'https://transformermpc.github.io/',
            },
          ]}
        />
      </Container>

      <Footer />
    </main>
  )
}
