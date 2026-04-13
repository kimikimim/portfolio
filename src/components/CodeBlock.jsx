import { useState } from 'react'
import hljs from 'highlight.js/lib/core'
import python from 'highlight.js/lib/languages/python'
import 'highlight.js/styles/github-dark.css'
import styles from './CodeBlock.module.css'

hljs.registerLanguage('python', python)

export default function CodeBlock({ code, language = 'python' }) {
  const [copied, setCopied] = useState(false)

  const highlighted = hljs.highlight(code.trim(), { language })

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.lang}>{language}</span>
        <button className={styles.copy} onClick={handleCopy}>
          {copied ? '✓ 복사됨' : '복사'}
        </button>
      </div>
      <pre className={styles.pre}>
        <code dangerouslySetInnerHTML={{ __html: highlighted.value }} />
      </pre>
    </div>
  )
}
