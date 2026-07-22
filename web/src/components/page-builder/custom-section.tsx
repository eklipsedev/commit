import {cn} from '@/lib/cn'
import {Container} from '@/components/ui/container'
import {Section} from '@/components/ui/section'
import {CustomModuleRenderer} from '@/components/custom/custom-module-renderer'
import type {PageBuilderBlock} from '@/sanity/types'

type CustomModule = {_key?: string; _type?: string; [key: string]: unknown}

type CustomSectionBlock = PageBuilderBlock & {
  modules?: CustomModule[]
}

/**
 * Stack modules with tight gaps after taglines (rule → headline/list)
 * and more breathing room between larger content blocks.
 */
export function CustomSection({block}: {block: CustomSectionBlock}) {
  const modules = block.modules ?? []

  return (
    <Section {...block}>
      <Container className="flex flex-col">
        {modules.map((module, index) => {
          const prev = modules[index - 1]
          const tightToPrev = prev?._type === 'moduleTagline'
          const afterSpacer = prev?._type === 'moduleSpacer'
          return (
            <div
              key={module._key ?? `${module._type}-${index}`}
              className={cn(
                index > 0 &&
                  !afterSpacer &&
                  (tightToPrev ? 'mt-7 md:mt-8' : 'mt-10 md:mt-14'),
              )}
            >
              <CustomModuleRenderer module={module} />
            </div>
          )
        })}
      </Container>
    </Section>
  )
}
