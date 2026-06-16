import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading } from '@/components/text'
import type { Metadata } from 'next'

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
}: {
  name: string
  description: React.ReactNode
  papers?: Paper[]
}) {
  return (
    <div className="border-t border-gray-100 py-20 first:border-t-0">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
        <PlaceholderImage />
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
        />

        <RobotSection
          name="Unitree G1 Humanoid"
          description={
            <>
              <p>
                The Unitree G1 is a full-size humanoid robot with 23 degrees
                of freedom, capable of standing, walking, and performing
                dexterous whole-body tasks. Its human-like morphology makes
                it well-suited for operating in environments designed for
                people, while its high degree-of-freedom kinematic structure
                presents rich challenges for whole-body control, motion
                imitation, and safe policy deployment.
              </p>
              <p>
                At ASL, we use the G1 to develop constraint-aware control
                frameworks that combine reinforcement learning with real-time
                safety guarantees. Our work enables policies trained entirely
                in simulation to satisfy complex physical constraints — joint
                limits, collision avoidance, and center-of-mass stability —
                at runtime on hardware, without retraining. This makes it
                possible to retrofit safety to any learned policy and adapt
                constraints on the fly as task requirements change.
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
                'Transformers for Trajectory Optimization with Application to Spacecraft Rendezvous',
              url: 'https://rendezvoustransformer.github.io/',
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
