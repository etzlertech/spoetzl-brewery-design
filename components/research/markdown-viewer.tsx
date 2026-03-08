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
    <article className="article-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Article-style headings
          h1: ({ node, ...props }: any) => (
            <h1 className="article-title" {...props} />
          ),
          h2: ({ node, ...props }: any) => (
            <h2 className="article-heading-2" {...props} />
          ),
          h3: ({ node, ...props }: any) => (
            <h3 className="article-heading-3" {...props} />
          ),
          // Paragraphs with better typography
          p: ({ node, ...props }: any) => (
            <p className="article-paragraph" {...props} />
          ),
          // Lists
          ul: ({ node, ...props }: any) => (
            <ul className="article-list" {...props} />
          ),
          ol: ({ node, ...props }: any) => (
            <ol className="article-list-ordered" {...props} />
          ),
          li: ({ node, ...props }: any) => (
            <li className="article-list-item" {...props} />
          ),
          // Blockquotes as pull quotes
          blockquote: ({ node, ...props }: any) => (
            <blockquote className="article-pullquote" {...props} />
          ),
          // Images
          img: ({ node, ...props }: any) => {
            const srcValue = typeof props.src === 'string' ? props.src : ''
            const src = srcValue.startsWith('/research/')
              ? srcValue
              : srcValue.startsWith('http')
                ? srcValue
                : `/research/images/${srcValue}`
            return (
              <figure className="article-figure">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  {...props}
                  src={src}
                  alt={props.alt || ''}
                  loading="lazy"
                  className="article-image"
                />
                {props.alt && (
                  <figcaption className="article-caption">{props.alt}</figcaption>
                )}
              </figure>
            )
          },
          // Tables
          table: ({ node, ...props }: any) => (
            <div className="article-table-wrapper">
              <table className="article-table" {...props} />
            </div>
          ),
          thead: ({ node, ...props }: any) => (
            <thead className="article-table-head" {...props} />
          ),
          th: ({ node, ...props }: any) => (
            <th className="article-table-header" {...props} />
          ),
          td: ({ node, ...props }: any) => (
            <td className="article-table-cell" {...props} />
          ),
          // Code
          code: ({ node, ...props }: any) => {
            const inline = props.inline
            if (inline) {
              return <code className="article-inline-code" {...props} />
            }
            return <code className="article-code-block" {...props} />
          },
          // Links
          a: ({ node, ...props }: any) => (
            <a className="article-link" {...props} />
          ),
          // Strong/Bold text
          strong: ({ node, ...props }: any) => (
            <strong className="article-bold" {...props} />
          ),
          // Emphasis/Italic text
          em: ({ node, ...props }: any) => (
            <em className="article-italic" {...props} />
          ),
          // Horizontal rule
          hr: ({ node, ...props }: any) => (
            <hr className="article-divider" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
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
      <div className="flex items-center justify-center py-20">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl bg-red-50 border-l-4 border-red-500 p-8 my-12">
        <h3 className="text-xl font-bold text-red-900 mb-3">Unable to Load Article</h3>
        <p className="text-red-700 leading-relaxed">{error}</p>
      </div>
    )
  }

  return <MarkdownViewer content={content} />
}
