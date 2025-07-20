"use client"

import { useEffect } from 'react'

interface JsonLdProps {
  data: object | object[]
}

export function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    // Clean up any existing JSON-LD scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]')
    existingScripts.forEach(script => {
      if (script.textContent?.includes('"@context"')) {
        script.remove()
      }
    })
  }, [])

  const jsonLdData = Array.isArray(data) ? data : [data]

  return (
    <>
      {jsonLdData.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item, null, 2),
          }}
        />
      ))}
    </>
  )
}

// Convenience component for multiple schemas
export function MultipleJsonLd({ schemas }: { schemas: object[] }) {
  return <JsonLd data={schemas} />
}

// Server-side version for better performance
export function JsonLdScript({ data }: JsonLdProps) {
  const jsonLdData = Array.isArray(data) ? data : [data]

  return (
    <>
      {jsonLdData.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item),
          }}
        />
      ))}
    </>
  )
}