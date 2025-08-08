import { useState } from 'react'
import './App.css'
import Button from './components/Button'
import { ServerStackIcon } from '@heroicons/react/24/solid'
import Card from './components/Card'
import { Basic as Dropzone } from './components/drop'

function App() {
  const [conversionDone, setConversionDone] = useState(false)

  return (
    <div className='App'>
      <section className="card-container">
        <Card
          title="LinkedIn Profile to Resume Generator"
         description={
           <>
             Step 2: Download your LinkedIn profile as a PDF. Need help?{' '}
             <a
  href="https://www.linkedin.com/help/linkedin/answer/a541960"
  target="_blank"
  rel="noopener noreferrer"
>
  Learn how to download your LinkedIn profile
</a>
           </>
         }
         description2="Step 3: Drag and drop your downloaded PDF file below."
  
          // downloadLink="#"
          // btn={{
          //   text: "Download",
          //   filled: true,
          //   type: "primary",
          //   href: "#",
          // }}
        >
          {/* You can add children here if needed, such as <Dropzone /> or other elements */}
        </Card>
      </section>
    </div>
  )
}

export default App
