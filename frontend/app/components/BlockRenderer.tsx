import React from 'react'

import Cta from '@/app/components/Cta'
import Info from '@/app/components/InfoSection'
import TextBlock from '@/app/components/TextBlock'
import TwoColumnLayout from '@/app/components/TwoColumnLayout'
import ThreeColumnLayout from '@/app/components/ThreeColumnLayout'
import FullWidthLayout from '@/app/components/FullWidthLayout'
import {dataAttr} from '@/sanity/lib/utils'

type BlocksType = {
  [key: string]: React.FC<any>
}

type BlockType = {
  _type: string
  _key: string
}

type BlockProps = {
  index: number
  block: BlockType
  pageId: string
  pageType: string
}

const Blocks: BlocksType = {
  callToAction: Cta,
  infoSection: Info,
  textBlock: TextBlock,
  twoColumnLayout: TwoColumnLayout,
  threeColumnLayout: ThreeColumnLayout,
  fullWidthLayout: FullWidthLayout,
}

/**
 * Used by the <PageBuilder>, this component renders a the component that matches the block type.
 */
export default function BlockRenderer({block, index, pageId, pageType}: BlockProps) {
  // Block does exist
  if (typeof Blocks[block._type] !== 'undefined') {
    return (
      <div
        key={block._key}
        data-sanity={dataAttr({
          id: pageId,
          type: pageType,
          path: `pageBuilder[_key=="${block._key}"]`,
        }).toString()}
      >
        {React.createElement(Blocks[block._type], {
          key: block._key,
          block: block,
          index: index,
        })}
      </div>
    )
  }
  // Block doesn't exist yet
  return React.createElement(
    () => (
      <div className="w-full bg-gray-100 text-center text-gray-500 p-20 rounded">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    {key: block._key},
  )
}
