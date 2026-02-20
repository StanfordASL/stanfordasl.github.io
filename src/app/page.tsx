import { BentoCard } from '@/components/bento-card'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { ImageCarousel } from '@/components/image-carousel'
import { Link } from '@/components/link'
import { LogoCloud } from '@/components/logo-cloud'
import { DataFlywheel } from '@/components/data-flywheel'
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
    <div className="relative flex min-h-dvh flex-col">
      <Container className="relative">
        <Navbar />
      </Container>
      <Container className="relative flex flex-1 items-center">
        <div className="grid grid-cols-1 items-center gap-8 w-full xl:grid-cols-2">
          <div className="relative z-10 text-center xl:text-left">
            <h1 className="font-display text-6xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-8xl/[0.8] md:text-9xl/[0.8]">
              Autonomous Systems Lab
            </h1>
            <p className="mt-8 mx-auto xl:mx-0 max-w-lg text-xl/7 font-medium text-gray-600 sm:text-2xl/8">
              Bringing world-scale intelligence to real-world machines.
            </p>
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
      <Container className="pb-8">
        <LogoCloud />
      </Container>
    </div>
  )
}

function FeatureSection({ images }: { images: string[] }) {
  return (
    <div className="overflow-hidden">
      <Container className="py-24">
        <Heading as="h2" className="max-w-3xl">
          Visual Highlights
        </Heading>
        <ImageCarousel
          images={images}
          className="mt-16"
        />
      </Container>
    </div>
  )
}

function ContactUs() {
  return (
    <div className="mt-8 mb-2 bg-gray-900 bg-[url(/dot-texture.svg)] py-16">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <figure className="flex max-w-xl flex-col text-left">
              <div className="tracking-tight text-white">
                <p className="text-3xl font-bold lg:text-4xl">Contact Us</p>
                <p className="mt-4 text-base lg:text-lg">
                  Autonomous Systems Laboratory<br />
                  Stanford University<br />
                  Department of Aeronautics &amp; Astronautics<br />
                  William F. Durand Building, Rm. 009<br />
                  496 Lomita Mall<br />
                  Stanford, CA 94305-4035
                </p>
              </div>
            </figure>
          </div>
          <div className="w-full ml-auto">
            <div className="-m-2 rounded-4xl bg-white/15 shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5">
              <div className="rounded-4xl p-2 shadow-md shadow-black/5">
                <div className="overflow-hidden rounded-3xl shadow-2xl outline outline-1 -outline-offset-1 outline-black/10">
                  <iframe
                    width="100%"
                    height="320"
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
    </div>
  )
}

function BentoSection() {
  return (
    <Container className="pb-24">
      <Heading as="h3" className="max-w-3xl">
        Research Thrusts
      </Heading>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
        <Link href="/research#foundations" className="max-lg:rounded-t-4xl lg:col-span-3 lg:rounded-tl-4xl">
          <BentoCard
            eyebrow="Foundation Models"
            title="Build the next autonomy stack"
            description="We develop foundation models tailored for embodied intelligence, forming the core architecture for scalable, adaptive, and robust autonomous systems."
            graphic={
              <div className="h-80 bg-[url(/visual-highlights/1.jpeg)] bg-cover bg-center" />
            }
            className="h-full"
          />
        </Link>
        <Link href="/research#backbone" className="lg:col-span-3 lg:rounded-tr-4xl">
          <BentoCard
            eyebrow="Structured Policy Learning"
            title="From models to machines"
            description="We study how large-scale backbones can drive better robotic behavior, developing scaling laws and structured policies that translate directly to real-world performance."
            graphic={
              <div className="absolute inset-0 bg-[url(/visual-highlights/3.jpg)] bg-cover bg-center" />
            }
            className="h-full"
          />
        </Link>
        <Link href="/research#safety" className="lg:col-span-2 lg:rounded-bl-4xl">
          <BentoCard
            eyebrow="Trustworthiness in Physical AI"
            title="Safe and reliable autonomy"
            description="Our research integrates monitoring, guardrailing, and alignment techniques that keep embodied systems safe, predictable, and reliable in the real world."
            graphic={
              <div className="absolute inset-0 bg-[url(/visual-highlights/4.jpg)] bg-cover bg-center" />
            }
            className="h-full"
          />
        </Link>
        <Link href="/research#data-flywheel" className="lg:col-span-2">
          <BentoCard
            eyebrow="Data Flywheels for Robotics"
            title="Self-improving autonomy"
            description="We design automated evaluation and data pipelines that close feedback loops and enable continuously advancing robotic systems."
            graphic={<DataFlywheel />}
            className="h-full"
          />
        </Link>
        <Link href="/research#control" className="max-lg:rounded-b-4xl lg:col-span-2 lg:rounded-br-4xl">
          <BentoCard
            eyebrow="Optimal & Learning-based Control"
            title="Operate at the limits"
            description="We integrate optimization-based methods with AI-driven policies to achieve high-performance control at the physical edge."
            graphic={
              <div className="absolute inset-0 bg-[url(/visual-highlights/5.JPG)] bg-cover bg-center" />
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
      <GradientBackground />
      <Hero />
      <main>
        <div className="py-16">
          <BentoSection />
          <FeatureSection images={visualHighlights} />
        </div>
        <ContactUs />
      </main>
      <div className="bg-linear-to-b from-white from-50% to-gray-100">
        <Footer />
      </div>
    </div>
  )
}
