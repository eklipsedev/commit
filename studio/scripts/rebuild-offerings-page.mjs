/**
 * Recompose the /offerings landing page to match the current page-builder design.
 *
 * Usage (from studio/):
 *   node --env-file=.env.local scripts/rebuild-offerings-page.mjs
 */
import {createClient} from '@sanity/client'

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '9khzz3db',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2026-02-01',
  token,
  useCdn: false,
})

const key = () => crypto.randomUUID().replace(/-/g, '').slice(0, 12)
const ref = (_ref) => ({_type: 'reference', _ref, _key: key()})
const richText = (text) => [
  {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: key(), marks: [], text}],
  },
]
const button = ({label, pageId, textColor, hoverBackgroundColor, hoverTextColor}) => ({
  _type: 'button',
  label,
  textColor,
  hoverBackgroundColor,
  hoverTextColor,
  link: {
    _type: 'link',
    linkType: 'internal',
    openInNewTab: false,
    internalLink: {_type: 'reference', _ref: pageId},
  },
})
const listItems = (items) =>
  items.map((text) => ({_type: 'stringListItem', _key: key(), text}))

const pageBuilder = [
  {
    _type: 'hero',
    _key: key(),
    headline: richText('Our\nOfferings.'),
    collapsePaddingBottom: true,
  },
  {
    _type: 'cta',
    _key: key(),
    headingSize: 'md',
    headingFont: 'sans',
    headline: richText(
      'We guide you from scratch paper ideation to powerful launch-ready work, with offerings built to meet the unique needs of each of our core audiences.',
    ),
  },
  {
    _type: 'cardsText',
    _key: key(),
    tagline: 'OFFERINGS FOR THE WAY YOU WORK',
    heading: 'Offerings built for people like you.',
    headingFont: 'display',
    headingSize: 'md',
    cardsSource: 'salesPages',
  },
  {
    _type: 'customSection',
    _key: key(),
    backgroundColor: 'sage',
    modules: [
      {
        _type: 'moduleTagline',
        _key: key(),
        text: 'AN EXTENSION OF YOUR TEAM',
      },
      {
        _type: 'moduleHeadline',
        _key: key(),
        text: richText('Our full suite of capabilities.'),
        headingFont: 'display',
        headingSize: 'md',
      },
      {
        _type: 'moduleStringList',
        _key: key(),
        columns: 3,
        itemSize: 'sm',
        showRules: false,
        items: listItems([
          'Brand Strategy',
          'Brand Identity',
          'Naming',
          'Messaging & Copywriting',
          'Creative Design',
          'UX/UI',
          'Motion Design',
          'Campaign Development',
          'Website Creation',
          'Social Media Planning',
          'Digital Marketing',
          'Email Marketing Strategy',
          'Performance Marketing Analytics',
          'Paid Media',
          'PR',
        ]),
      },
    ],
  },
  {
    _type: 'customSection',
    _key: key(),
    modules: [
      {
        _type: 'moduleTagline',
        _key: key(),
        text: 'THE WAY WE WORK WITH YOU',
      },
      {
        _type: 'moduleSplit',
        _key: key(),
        layout: 2,
        left: [
          {
            _type: 'moduleHeadline',
            _key: key(),
            text: richText('Our zero waste\napproach.'),
            headingFont: 'display',
            headingSize: 'md',
          },
          {
            _type: 'moduleBody',
            _key: key(),
            textSize: 'sm',
            text: richText('We build brands and campaigns in creative intensives that disrupt the typical agency model. You get an entire team passionately focused on you and your idea.'),
          },
        ],
        right: [
          {
            _type: 'moduleSteps',
            _key: key(),
            arrangement: 'stack',
            steps: listItems([
              'A creative team custom-built for your needs.',
              'A facilitated process that is high-touch and nimble.',
              'Sprints that reduce back-and-forth.',
            ]).map((item) => ({
              _type: 'moduleStep',
              _key: key(),
              text: item.text,
            })),
          },
        ],
      },
    ],
  },
  {
    _type: 'twoColCards',
    _key: key(),
    tagline: 'OUR WORK',
    heading: 'What we’ve built for\nclients like you.',
    headingFont: 'display',
    headingSize: 'md',
    button: button({
      label: 'View All',
      pageId: 'a45fb8ff-c15b-4ee3-b64b-2d5b15f98f16',
      textColor: 'charcoal',
      hoverBackgroundColor: 'yellow',
      hoverTextColor: 'charcoal',
    }),
    projectsSource: 'manual',
    projects: [
      ref('141d7954-63a1-4100-8743-8878cd054a4a'),
      ref('15c76c8d-af5c-4f84-9136-bd6c1ec0df4b'),
      ref('1ec17560-cbab-4374-af2a-5cbc013206d9'),
      ref('8417a6c4-9e89-4668-91cc-ac4ec0c81d9d'),
    ],
  },
  {
    _type: 'sliderTestimonials',
    _key: key(),
    testimonials: [ref('9ec75f31-ec5e-4a85-9478-9da8eabafb14')],
  },
  {
    _type: 'cta',
    _key: key(),
    tagline: 'THE NEXT STEP',
    headline: richText('Let’s get your Big Idea out into the world where it belongs.'),
    headingSize: 'lg',
    button: button({
      label: 'Work With Us',
      pageId: 'contactPage',
      textColor: 'charcoal',
      hoverBackgroundColor: 'yellow',
      hoverTextColor: 'charcoal',
    }),
  },
]

const page = await client.fetch(`*[_type == "page" && slug.current == "offerings"][0]{_id}`)
if (!page?._id) {
  throw new Error('Could not find the /offerings page.')
}

await client.patch(page._id).set({pageBuilder}).commit()
console.log(`Rebuilt /offerings (${page._id}).`)
