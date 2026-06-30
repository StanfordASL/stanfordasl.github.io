import { Container } from '@/components/container'
import { EmbodiedAgentLoop } from '@/components/embodied-agent-loop'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { DataFlywheel } from '@/components/data-flywheel'
import { RobotFoundationDiagram } from '@/components/robot-foundation-diagram'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import { HashScroll } from '@/components/hash-scroll'
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
    <div id={id} className="scroll-mt-0">
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
      <HashScroll />
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <Header />

      {/* Thrust 1: Generalist Robot Learning and Reasoning — full-width figure, text + papers below */}
      <div id="foundations" className="scroll-mt-0">
        <Container className="py-28">
          <Subheading>Thrust 1</Subheading>
          <Heading as="h3" className="mt-2 !text-3xl sm:!text-5xl">
            Robot Foundation Models
          </Heading>
          <div className="mt-8 grid grid-cols-1 items-center gap-x-12 gap-y-8 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="aspect-[3/2] overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/10">
                <RobotFoundationDiagram className="h-full" />
              </div>
              <p className="mt-8 text-xs font-semibold tracking-[0.16em] uppercase text-gray-700">
                Representative Papers
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  {
                    title: 'Self-Supervised Bootstrapping of Action-Predictive Embodied Reasoning',
                    venue: 'RSS',
                    year: '2026',
                    url: 'https://arxiv.org/abs/2602.08167',
                  },
                  {
                    title: 'Scan, Materialize, Simulate: A Generalizable Framework for Physically Grounded Robot Planning',
                    venue: 'ICRA',
                    year: '2026',
                    url: 'https://arxiv.org/abs/2505.14938',
                  },
                  {
                    title: 'RoboMonkey: Scaling Test-Time Sampling and Verification for Vision-Language-Action Models',
                    venue: 'CoRL',
                    year: '2025',
                    url: 'https://arxiv.org/abs/2506.17811',
                  },
                ].map((paper) => (
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
                      <span className="text-gray-600">
                        {' · '}
                        <span className="whitespace-nowrap">{paper.venue}, {paper.year}</span>
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2 text-base/7 text-gray-600">
              <p>A central goal of modern robotics is to move beyond systems engineered for a single task toward generalist robots that operate across many tasks, objects, and embodiments. Recent progress has been driven by robot foundation models trained on large and diverse data: vision-language-action (VLA) models that map perception and instructions directly to control, and world models that learn how the physical world responds to a robot&rsquo;s actions. These models offer broad competence, but they remain limited in reliability, physical grounding, and the deliberate reasoning that real-world deployment demands.</p>
              <p className="mt-4">We develop the learning and reasoning foundations that make such systems dependable. Our work spans test-time methods that improve the robustness and generalization of VLAs through sampling and verification rather than additional training; self-supervised approaches that let robots bootstrap action-predictive reasoning from their own interaction data; and physically grounded planning that couples 3D scene reconstruction, vision-language perception, and physics simulation so that robots can reason about the consequences of their actions before they act. Together, these efforts aim toward a new generation of robot foundation models that pair the breadth of large-scale learning with the reliability, physical grounding, and reasoning that real-world autonomy demands.</p>
            </div>
          </div>
        </Container>
      </div>

      {/* Thrust 2: Backbone — dark band */}
      <div className="bg-gray-900 bg-[url(/dot-texture.svg)] py-8">
        <ThrustSection
          id="backbone"
          eyebrow="Thrust 2"
          title="Embodied AI Agents"
          description={<>
            <p>Modern agentic systems can orchestrate complex work in the digital world, drawing on planning, tool use, and broad world knowledge. A natural next step is to extend these capabilities from digital tasks to physical ones, augmenting robotic systems with the same flexibility. Yet this translation is far from straightforward. Foundation models are largely trained on data that disregards the multi-modal signals central to robotics, and agentic reasoning has not been designed with embodied use cases in mind. At the same time, agentic systems excel precisely in the complex, open-ended settings that demand handling novel scenarios never encountered during training, which is exactly the regime in which future mobile robots must operate. Agentic systems therefore present a significant opportunity, alongside central difficulties.</p>
            <p className="mt-4">We develop methods that let agents control robotic embodiments, build a grounded understanding of their environments, and reason about the actions available to them. We study tool use both as a means of interacting with the physical world and as a way to resolve uncertainty by actively drawing information from the environment. Our extensive expertise in the optimization of large-scale systems offers a novel perspective on orchestration and lets us rethink reasoning in a robotic context, recognizing that embodied agents must form their understanding of the world from far richer sensory streams than VLMs or digital agentic systems. The central challenge, then, is interpreting this multi-modal input while respecting real-time compute constraints.</p>
          </>}
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
            <EmbodiedAgentLoop />
          }
        />
      </div>

      {/* Thrust 3: Safety — white, landscape layout */}
      <div id="safety" className="scroll-mt-0">
        <Container className="py-28">
          <Subheading>Thrust 3</Subheading>
          <Heading as="h3" className="mt-2 !text-3xl sm:!text-5xl">
            Physical AI Safety
          </Heading>
          <div className="mt-8 grid grid-cols-1 items-start gap-x-12 gap-y-8 lg:grid-cols-2">
            <div className="order-1 overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/10 lg:col-start-1 lg:row-start-1" style={{ aspectRatio: '2000/1513' }}>
              <img
                alt="Failure detection across diverse real-world scenarios — aerial robots identifying construction zones, high-temperature hazards, and safe landing sites."
                src="/visual-highlights/thrust3-safety.jpg"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-2 text-base/7 text-gray-600 lg:col-start-2 lg:row-start-1 lg:row-span-2">
              <p>
                Deploying AI systems in the physical world introduces a new
                category of risk: unlike digital systems, embodied agents must act
                under real-time constraints in a dynamic environment. A robot that
                fails to recognize an anomaly, misinterprets a sensor reading, or
                violates a safety constraint may present dangerous behavior.
                The environments that will demand the next generation of robot
                autonomy stacks, e.g., contact-rich manipulation, autonomous
                navigation in dynamic scenes, operation alongside humans, are
                too unpredictable to capture all corner cases in nominal
                training data. Closing the gap between in-distribution
                performance and real-world reliability is the central problem
                of physical AI safety.
              </p>
              <p className="mt-4">
                We develop algorithms that allow robot policies to detect,
                anticipate, and recover from potential failures while satisfying
                formal safety constraints. Our work spans runtime monitoring
                systems that identify out-of-distribution situations before they
                cause harm; mechanistic interpretability methods that probe the internal representations of
                robot foundation models to expose how behaviors and failure modes are
                encoded and can be steered as desired; safety filters that provably
                constrain policy outputs to safe sets; and reasoning-based frameworks that draw on the
                broad world knowledge of foundation models to recognize novel
                hazards and synthesize contingency plans on the fly. By
                understanding not just what robots do but when and why they fail,
                we aim to build physical AI systems that operators and society can
                depend on in high-stakes, real-world deployments.
              </p>
            </div>
            <div className="order-3 lg:col-start-1 lg:row-start-2">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-gray-700">
                Representative Papers
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  {
                    title: 'Observing and Controlling Features in Vision-Language-Action Models',
                    venue: 'arXiv',
                    year: '2026',
                    url: 'https://arxiv.org/abs/2603.05487',
                  },
                  {
                    title: 'Real-Time Out-of-Distribution Failure Prevention via Multi-Modal Reasoning',
                    venue: 'CoRL',
                    year: '2025',
                    url: 'https://arxiv.org/abs/2505.10547',
                  },
                  {
                    title: 'Real-Time Anomaly Detection and Reactive Planning with Large Language Models',
                    venue: 'RSS',
                    year: '2024',
                    url: 'https://arxiv.org/abs/2407.08735',
                  },
                ].map((paper) => (
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
                      <span className="text-gray-600">
                        {' · '}
                        <span className="whitespace-nowrap">{paper.venue}, {paper.year}</span>
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>

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
                'Realistic Extreme Behavior Generation for Improved AV Testing',
              venue: 'IEEE ICRA',
              year: '2025',
              url: 'https://arxiv.org/pdf/2409.10669',
            },
            {
              title:
                'CUPID: Curating Data your Robot Loves with Influence Functions',
              venue: 'CoRL',
              year: '2025',
              url: 'https://arxiv.org/abs/2506.19121',
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
        description={<>
          <p>Within the robotics stack, there are numerous problems to solve in planning and control, at various levels of abstraction, and with different frequency requirements. And in each layer, these problems generally can be divided into two classes: those that are easy to model (with a prescribed level of accuracy and computational expense), and those that are hard.</p>
          <p className="mt-4">For the modelable class, optimization-based techniques can lead to fast, globally-accurate solutions with hard constraint satisfaction (especially important for safety-critical systems). Whereas, for the hard-to-model class, we typically have to either make approximations, or turn to learning. When a policy is in-distribution, learning can bring high levels of capability to some of the hardest challenges in fields such as manipulation.</p>
          <p className="mt-4">In our research in ASL, we look at how these methods are complementary, rather than distinct, with a particular emphasis on safety and reliability for AI-driven systems. Considering these fields together allows us to push forward the frontier of performance and safety, allowing robots to be more capable while being confident about constraints.</p>
        </>}
        papers={[
          // {
          //   title:
          //     'Practical Deployment of Spectral Submanifold Reduction for Optimal Control of High-Dimensional Systems',
          //   venue: 'IFAC World Congress',
          //   year: '2023',
          //   url: '/wp-content/papercite-data/pdf/Alora.Cenedese.IFAC23.pdf',
          // },
          {
            title:
              'Discovering Dominant Dynamics for Nonlinear Continuum Robot Control',
            venue: 'npj Robotics',
            year: '2025',
            url: 'https://www.nature.com/articles/s44182-025-00021-8',
          },
          {
            title:
              'Safe, Task-Consistent Manipulation with Operational Space Control Barrier Functions',
            venue:
              'IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)',
            year: '2025',
            url: 'https://ieeexplore.ieee.org/document/11246389',
          },
          {
            title:
              'Transformer-based Model Predictive Control: Trajectory Optimization via Sequence Modeling',
            venue: 'IEEE RA-L',
            year: '2024',
            url: '/wp-content/papercite-data/pdf/Celestini.Gammelli.ea.RAL24.pdf',
          },
        ]}
        graphic={
          <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/10">
            <img alt="" src="/visual-highlights/2.jpg" className="w-full object-cover" />
          </div>
        }
      />

      {/* Thrust 6: Applications — dark band, landscape layout */}
      <div className="bg-gray-900 bg-[url(/dot-texture.svg)] py-8">
        <div id="applications" className="scroll-mt-0">
          <Container className="py-28">
            <Subheading dark>Thrust 6</Subheading>
            <Heading as="h3" className="mt-2 !text-3xl sm:!text-5xl" dark>
              Autonomy in the Field
            </Heading>
            <div className="mt-8 overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10" style={{ aspectRatio: '21/9' }}>
              <img
                alt=""
                src="/visual-highlights/thrust6.jpg"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-8 grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-[5fr_8fr]">
              <div className="order-2 lg:order-1">
                <p className="text-xs font-semibold tracking-[0.16em] uppercase text-gray-300">
                  Representative Papers
                </p>
                <ul className="mt-3 space-y-2">
                  {[
                    {
                      title: 'Discovering Dominant Dynamics for Nonlinear Continuum Robot Control',
                      venue: 'Nature Portfolio (npj Robotics)',
                      year: '2025',
                      url: 'https://www.nature.com/articles/s44182-025-00021-8',
                    },
                    {
                      title: 'Locomotion as manipulation with ReachBot',
                      venue: 'Science Robotics',
                      year: '2024',
                      url: 'https://www.science.org/doi/abs/10.1126/scirobotics.adi9762',
                    },
                    {
                      title: 'Testing Gecko-Inspired Adhesives with Astrobee Aboard the ISS',
                      venue: 'IEEE Robotics and Automation Magazine',
                      year: '2022',
                      url: 'https://ieeexplore.ieee.org/document/9783137',
                    },
                  ].map((paper) => (
                    <li key={paper.title} className="flex gap-2 text-sm/5">
                      <span className="mt-0.5 shrink-0 text-gray-500">•</span>
                      <span>
                        <a
                          href={paper.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium underline underline-offset-2 transition text-white decoration-gray-600 hover:decoration-white"
                        >
                          {paper.title}
                        </a>
                        <span className="text-gray-400">
                          {' · '}
                          <span className="whitespace-nowrap">{paper.venue}, {paper.year}</span>
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 lg:order-2 text-base/7 text-gray-400">
                <p>
                  Autonomous systems are increasingly central to modern society, becoming deeply embedded in critical infrastructure, human-facing services, and scientific discovery. From robotic exploration of extreme environments such as space, to autonomous vehicles navigating complex urban landscapes, to assistive robots operating alongside humans, autonomy is rapidly moving from research prototypes to indispensable real-world operations. These domains require systems that can reason under uncertainty, adapt to novel conditions, and operate robustly for extended periods with limited supervision. Bridging the gap between advances in robot autonomy and deployment in these real-world settings is therefore both a scientific challenge and an opportunity for broad societal impact.
                </p>
                <p className="mt-4">
                  We pursue application-driven autonomy in domains where intelligent robots can meaningfully advance science and benefit society. Our work spans space robotics, legged systems, humanoids, autonomous vehicles, soft robots, and robotic manipulation, with a focus on high-impact applications that demand robust autonomy in complex, potentially unstructured environments. Our research has been deployed in some of the world’s most challenging operational settings, including aboard the International Space Station, where autonomous robotic technologies developed by our group have been tested in microgravity. These deployments serve not only as application targets but also as rigorous testbeds that expose the fundamental limitations of current autonomy stacks.
                </p>
                <p className="mt-4">
                  By working in the field, we gain insights that drive our core research thrusts and ensure that our scientific contributions are grounded in the realities of real-world robotic systems.
                  Through this tight integration of fundamental research and real-world deployment, we aim to develop autonomous systems that expand the reach of human capability, accelerate scientific discovery, and create tangible societal value.
                </p>
              </div>
            </div>
          </Container>
        </div>
      </div>

      <Footer />
    </main>
  )
}
