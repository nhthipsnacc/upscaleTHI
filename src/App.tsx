import { useState } from 'react'
import './App.css'
import { ImageUpload } from './components/ImageUpload'
import { ResultDisplay } from './components/ResultDisplay'
import { upscaleImage } from './api/upscale'

function App() {
  const [image, setImage] = useState<string | null>(null)
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleImageUpload = async (file: File) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      if (e.target?.result) {
        const dataUrl = e.target.result as string
        setImage(dataUrl)
        setLoading(true)
        try {
          const upscaled = await upscaleImage(dataUrl)
          setUpscaledImage(upscaled)
        } catch (error) {
          console.error('Upscale failed', error)
        } finally {
          setLoading(false)
        }
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <main className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold">AI Image Studio</h1>
          <p className="text-gray-400 mt-2">Upload an image to get started</p>
        </header>

        <ImageUpload onImageUpload={handleImageUpload} />

        {loading && <div className="text-center mt-4">Upscaling...</div>}

        {image && upscaledImage && !loading && (
          <div className="mt-8">
            <ResultDisplay originalImage={image} upscaledImage={upscaledImage} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
