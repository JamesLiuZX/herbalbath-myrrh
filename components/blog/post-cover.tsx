import Image from "next/image"

/**
 * A post's cover. Photos go through next/image (resized and re-encoded per
 * device); posts without one get a typographic cover instead of a placeholder.
 */
export function PostCover({
  image,
  title,
  alt,
  priority = false,
  sizes,
  className = "",
}: {
  image: string | null
  title: string
  alt?: string
  priority?: boolean
  sizes: string
  className?: string
}) {
  if (image) {
    return (
      <div className={`relative aspect-video overflow-hidden bg-stone-100 ${className}`}>
        <Image src={image} alt={alt ?? title} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    )
  }
  return (
    <div
      className={`relative flex aspect-video items-end overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-amber-600 p-6 ${className}`}
      role="img"
      aria-label={alt ?? title}
    >
      <div aria-hidden="true" className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
      <div aria-hidden="true" className="absolute right-16 top-14 h-24 w-24 rounded-full bg-amber-300/20" />
      <p className="relative font-serif text-2xl font-bold leading-snug text-white drop-shadow-sm line-clamp-3">{title}</p>
    </div>
  )
}
