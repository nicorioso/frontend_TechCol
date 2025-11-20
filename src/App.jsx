import { useState } from 'react'
import HomePage from './layouts/home/home.jsx';

export default function App() {
  const [count, setCount] = useState('');

  return (
    <HomePage/>
  )
}