import { motion } from 'framer-motion'

interface Props {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  once?: boolean
  /** words to render in the accent color */
  accentWords?: string[]
}

export default function SplitText({ text, className = '', delay = 0, as = 'h2', once = true, accentWords = [] }: Props) {
  const Tag = motion[as]
  const words = text.split(' ')
  let charIndex = 0

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.6 }}
      aria-label={text}
    >
      {words.map((word, wi) => {
        const grad = accentWords.includes(word.replace(/[^\w']/g, ''))
        return (
          <span key={wi} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em] mr-[0.25em]" aria-hidden>
            {word.split('').map((ch, ci) => {
              const i = charIndex++
              return (
                <motion.span
                  key={ci}
                  className={`inline-block ${grad ? 'text-accent-soft' : ''}`}
                  variants={{
                    hidden: { y: '110%', rotate: 8, opacity: 0 },
                    visible: { y: '0%', rotate: 0, opacity: 1 },
                  }}
                  transition={{ duration: 0.8, delay: delay + i * 0.025, ease: [0.22, 1, 0.36, 1] }}
                >
                  {ch}
                </motion.span>
              )
            })}
          </span>
        )
      })}
    </Tag>
  )
}
