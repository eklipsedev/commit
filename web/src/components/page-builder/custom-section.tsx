import {cn} from '@/lib/cn'
import {Container} from '@/components/ui/container'
import {FadeIn, FADE_IN_STAGGER_MS} from '@/components/ui/fade-in'
import {Section} from '@/components/ui/section'
import {CustomModuleRenderer} from '@/components/custom/custom-module-renderer'
import {moduleStackGapClass} from '@/lib/module-stack'
import type {PageBuilderBlock} from '@/sanity/types'

type CustomModule = {_key?: string; _type?: string; [key: string]: unknown}

type CustomSectionBlock = PageBuilderBlock & {
  modules?: CustomModule[]
}

/**
 * Stack modules with tight gaps after taglines (rule → headline/list)
 * and more breathing room between larger content blocks.
 * Each module floats in on scroll (spacer modules excluded).
 */
export function CustomSection({block}: {block: CustomSectionBlock}) {
  const modules = block.modules ?? []

  let revealIndex = 0

  return (
    <Section {...block}>
      <Container className="flex flex-col">
        {modules.map((module, index) => {
          const prev = modules[index - 1]
          const tightToPrev = prev?._type === 'moduleTagline'
          const afterSpacer = prev?._type === 'moduleSpacer'
          const isSpacer = module._type === 'moduleSpacer'
          const delay = isSpacer ? 0 : revealIndex++ * FADE_IN_STAGGER_MS

          const body = <CustomModuleRenderer module={module} />
          const wrapped = isSpacer ? (
            body
          ) : (
            <FadeIn delay={Math.min(delay, FADE_IN_STAGGER_MS * 4)}>{body}</FadeIn>
          )

          return (
            <div
              key={module._key ?? `${module._type}-${index}`}
              className={cn(
                index > 0 && !afterSpacer && moduleStackGapClass({tightToPrev}),
              )}
            >
              {wrapped}
            </div>
          )
        })}
      </Container>
    </Section>
  )
}
