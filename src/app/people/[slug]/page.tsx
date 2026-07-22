// Legacy URL support: the old lab site served profiles at /people/<slug>/ (still
// the URLs indexed by Google, e.g. /people/prof-marco-pavone/). Re-export the
// /team/[slug] profile so those links resolve to the same page.
export {
  default,
  generateStaticParams,
  generateMetadata,
} from '@/app/team/[slug]/page'
