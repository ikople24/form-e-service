import { useState } from 'react'

import './App.css'
import RequestForm from './pages/RequestForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <RequestForm/>
    </div>
    
    </>
  )
}

export default App
