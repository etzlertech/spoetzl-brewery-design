"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

interface MarkdownViewerProps {
  content: string
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:text-green-900 prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-a:text-blue-600 prose-code:text-purple-700 prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-img:rounded-lg prose-img:shadow-md prose-table:text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Custom image handler to support relative paths
          img: ({ node, ...props }: any) => {
            const srcValue = typeof props.src === 'string' ? props.src : ''
            const src = srcValue.startsWith('/research/')
              ? srcValue
              : srcValue.startsWith('http')
                ? srcValue
                : `/research/images/${srcValue}`
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img {...props} src={src} alt={props.alt || ''} loading="lazy" />
            )
          },
          // Custom table styling
          table: ({ node, ...props }: any) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full divide-y divide-gray-300 border border-gray-300" {...props} />
            </div>
          ),
          th: ({ node, ...props }: any) => (
            <th className="bg-green-50 px-4 py-3 text-left text-sm font-semibold text-green-900" {...props} />
          ),
          td: ({ node, ...props }: any) => (
            <td className="px-4 py-3 text-sm text-gray-700 border-t border-gray-200" {...props} />
          ),
          // Custom code block styling
          code: ({ node, ...props }: any) => {
            const inline = props.inline
            if (inline) {
              return <code className="bg-purple-50 px-1.5 py-0.5 rounded text-sm" {...props} />
            }
            return <code {...props} />
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

interface MarkdownLoaderProps {
  filePath: string
}

export function MarkdownLoader({ filePath }: MarkdownLoaderProps) {
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadMarkdown() {
      try {
        setLoading(true)
        const response = await fetch(`/research/${filePath}`)
        if (!response.ok) {
          throw new Error(`Failed to load document: ${response.statusText}`)
        }
        const text = await response.text()
        setContent(text)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load document")
      } finally {
        setLoading(false)
      }
    }

    loadMarkdown()
  }, [filePath])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Document</h3>
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  return <MarkdownViewer content={content} />
}
