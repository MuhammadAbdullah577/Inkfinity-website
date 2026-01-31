import { motion } from 'motion/react'
import Header from './Header'
import Footer from './Footer'
import { pageTransition } from '../../animations/variants'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <motion.main
        className="flex-1 pt-16 lg:pt-20"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  )
}
