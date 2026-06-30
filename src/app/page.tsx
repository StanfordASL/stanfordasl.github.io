import { BentoCard } from '@/components/bento-card'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { ImageCarousel } from '@/components/image-carousel'
import { Link } from '@/components/link'
import { SocialLinks } from '@/components/logo-cloud'
import { DataFlywheel } from '@/components/data-flywheel'
import { AutonomyStackDiagram } from '@/components/autonomy-stack-diagram'
import { RobotFoundationDiagram } from '@/components/robot-foundation-diagram'
import { Navbar } from '@/components/navbar'
import { GradientBackground } from '@/components/gradient'
import { Heading } from '@/components/text'
import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'

export const metadata: Metadata = {
  description:
    'Bringing world-scale intelligence to real-world machines.',
}

// Get all images from visual-highlights directory
function getVisualHighlights() {
  const imagesDirectory = path.join(process.cwd(), 'public/visual-highlights')

  try {
    const filenames = fs.readdirSync(imagesDirectory)
    // Filter for image files only
    const imageFiles = filenames.filter(name =>
      /\.(jpg|jpeg|png|gif|webp|JPG|JPEG|PNG)$/i.test(name)
    )
    return imageFiles
  } catch (error) {
    console.error('Error reading visual-highlights directory:', error)
    return []
  }
}

function Hero() {
  return (
    <div className="relative">
      <GradientBackground />
      <Container className="relative">
        <Navbar />
      </Container>
      <Container className="relative mt-16 pb-16">
        <div className="grid grid-cols-1 items-center gap-8 w-full xl:grid-cols-2">
          <div className="relative z-10 text-center xl:text-left">
            <h1 className="font-display font-medium tracking-tight text-balance text-gray-950 text-[clamp(2.75rem,11vw,110px)] leading-[0.95] sm:leading-[0.85] xl:leading-[0.8]">
              Autonomous Systems Lab
            </h1>
            <p className="mt-8 xl:mx-0 max-w-lg text-xl/7 font-medium text-gray-600 sm:text-2xl/8">
              Bringing world-scale intelligence to real-world machines.
            </p>
            <SocialLinks className="mt-8" />
          </div>
          <div className="flex justify-center xl:justify-end xl:-mr-32">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="max-h-[420px] w-auto object-contain"
            >
              <source src="/Freeflyer.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </Container>
    </div>
  )
}

function FeatureSection({ images }: { images: string[] }) {
  return (
    <div className="overflow-hidden pt-8 pb-24">
      <Container>
        <Heading as="h2" className="max-w-3xl">
          Visual Highlights
        </Heading>
      </Container>
      <ImageCarousel
        images={images}
        className="mt-16 w-full"
      />
    </div>
  )
}

function BentoSection() {
  return (
    <Container className="pb-24">
      <Heading as="h3" className="max-w-3xl">
        Research Thrusts
      </Heading>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
        <Link href="/research#foundations">
          <BentoCard
            eyebrow="Robot Foundation Models"
            title="Generalist robot policies"
            description="We develop the learning and reasoning foundations behind generalist robot policies — making vision-language-action and world models dependable through test-time scaling, reasoning, and physically grounded simulation and modeling."
            graphic={<RobotFoundationDiagram className="h-full" />}
            className="h-full"
          />
        </Link>
        <Link href="/research#backbone">
          <BentoCard
            eyebrow="Embodied AI Agents"
            title="From digital to physical"
            description="We extend the orchestration, planning, and world knowledge of modern agentic systems to physical robots, grounding them in multi-modal perception and online interaction."
            graphic={
              <AutonomyStackDiagram className="h-full" />
            }
            className="h-full"
          />
        </Link>
        <Link href="/research#safety">
          <BentoCard
            eyebrow="Physical AI Safety"
            title="Safe and reliable autonomy"
            description="Our research integrates monitoring, guardrailing, and alignment techniques that keep embodied systems safe, predictable, and reliable in the real world."
            graphic={
              <div className="absolute inset-0 bg-[url(/visual-highlights/thrust3-safety.jpg)] bg-cover bg-center" />
            }
            className="h-full"
          />
        </Link>
        <Link href="/research#data-flywheel">
          <BentoCard
            eyebrow="Data Flywheels for Robotics"
            title="Self-improving autonomy"
            description="We design automated evaluation and data pipelines that close feedback loops and enable continuously advancing robotic systems."
            graphic={<DataFlywheel />}
            className="h-full"
          />
        </Link>
        <Link href="/research#control">
          <BentoCard
            eyebrow="Optimal & Learning-based Control"
            title="Operate at the limits"
            description="We look at the complementary nature of optimization-based and learning-based control and planning methods. At their interface, we can bring the speed, interpretability, and constraint satisfaction of optimization to the broad capabilities and generalization of machine learning."
            graphic={
              <div className="absolute inset-0 bg-[url(/visual-highlights/2.jpg)] bg-cover bg-center" />
            }
            className="h-full"
          />
        </Link>
        <Link href="/research#applications">
          <BentoCard
            eyebrow="Applied Autonomy"
            title="Deploy in high-impact domains"
            description="We deploy autonomy in the field — spanning space robotics, legged and humanoid systems, autonomous vehicles, and manipulation — where operating in the world's most challenging environments grounds and drives our core research."
            graphic={
              <div className="absolute inset-0 bg-[url(/visual-highlights/thrust6.jpg)] bg-cover bg-center" />
            }
            className="h-full"
          />
        </Link>
      </div>
    </Container>
  )
}

export default function Home() {
  const visualHighlights = getVisualHighlights()

  return (
    <div className="overflow-hidden">
      <Hero />
      <main>
        <div className="py-16">
          <BentoSection />
          <FeatureSection images={visualHighlights} />
        </div>
      </main>
      <div className="bg-linear-to-b from-white from-50% to-gray-100">
        <Footer />
      </div>
    </div>
  )
}
