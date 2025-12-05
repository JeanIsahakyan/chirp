import { motion } from 'framer-motion'
import { cn } from '../../utils/utils'

interface ShinyButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function ShinyButton({ children, className, onClick }: ShinyButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative rounded-lg px-6 py-2 font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow',
        'bg-gradient-to-r from-primary/80 to-primary text-primary-foreground',
        'hover:shadow-[0_0_20px_hsl(var(--primary)/30%)]',
        className
      )}
    >
      <span className="relative block h-full w-full text-sm tracking-wide">
        {children}
      </span>
    </motion.button>
  )
}
