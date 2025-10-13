import {stegaClean} from '@sanity/client/stega'
import {Image} from 'next-sanity/image'
import {getImageDimensions} from '@sanity/asset-utils'
import {urlForImage} from '@/sanity/lib/utils'
import { IMAGE_SIZES } from '@/sanity/lib/imageUtils'

interface CoverImageProps {
  image: any
  priority?: boolean
  sizes?: string
  className?: string
}

export default function CoverImage(props: CoverImageProps) {
  const {image: source, priority, sizes, className = "object-cover"} = props
  const image = source?.asset?._ref ? (
    <Image
      className={className}
      width={getImageDimensions(source).width}
      height={getImageDimensions(source).height}
      alt={stegaClean(source?.alt) || ''}
      src={urlForImage(source)?.url() as string}
      sizes={sizes || IMAGE_SIZES.content}
      priority={priority}
    />
  ) : null

  return <div className="relative">{image}</div>
}
