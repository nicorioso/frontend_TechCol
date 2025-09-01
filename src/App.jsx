import { useState } from 'react'
import ContactForm from './layouts/contact_form.jsx'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <ContactForm/>

  )
}

export default App
