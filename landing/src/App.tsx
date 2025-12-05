import {
  Navbar,
  Hero,
  Features,
  Installation,
  Examples,
  ApiDocs,
  Architecture,
  Footer,
} from './components/sections'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Installation />
        <Examples />
        <ApiDocs />
        <Architecture />
      </main>
      <Footer />
    </div>
  )
}

export default App
