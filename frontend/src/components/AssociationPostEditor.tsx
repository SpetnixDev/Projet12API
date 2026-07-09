"use client"

import { useMemo, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type Props = {
  associationId: string
  action: (formData: FormData) => void | Promise<void>
  postCreated?: boolean
  postError?: string | null
  postId?: number
  initialTitle?: string
  initialContent?: string
  submitLabel?: string
}

type MarkdownAction = {
  label: string
  title: string
  apply: (selected: string) => {
    text: string
    cursorOffset?: number
  }
}

const markdownActions: MarkdownAction[] = [
  {
    label: "H2",
    title: "Titre niveau 2",
    apply: (selected) => ({ text: `## ${selected || "Titre"}` }),
  },
  {
    label: "B",
    title: "Gras",
    apply: (selected) => {
      const value = selected || "texte"
      return {
        text: `**${value}**`,
      }
    },
  },
  {
    label: "I",
    title: "Italique",
    apply: (selected) => {
      const value = selected || "texte"
      return {
        text: `*${value}*`,
      }
    },
  },
  {
    label: "Lien",
    title: "Lien",
    apply: (selected) => {
      const value = selected || "texte du lien"
      return {
        text: `[${value}](https://example.com)`,
      }
    },
  },
  {
    label: "Liste",
    title: "Liste a puces",
    apply: (selected) => {
      if (!selected) {
        return {
          text: "- Element 1\n- Element 2",
        }
      }

      const lines = selected
        .split("\n")
        .map((line) => (line.startsWith("- ") ? line : `- ${line}`))
      return {
        text: lines.join("\n"),
      }
    },
  },
  {
    label: "Code",
    title: "Bloc de code",
    apply: (selected) => {
      const value = selected || "const message = 'Hello'"
      return {
        text: `\n\`\`\`ts\n${value}\n\`\`\`\n`,
      }
    },
  },
]

function toPreviewPlaceholder() {
  return [
    "## Apercu",
    "Ton rendu Markdown apparaitra ici.",
    "",
    "Exemple:",
    "- Liste",
    "- **Gras**",
    "- [Lien](https://example.com)",
  ].join("\n")
}

export default function AssociationPostEditor({
  associationId,
  action,
  postCreated = false,
  postError = null,
  postId,
  initialTitle = "",
  initialContent = "",
  submitLabel = "Publier",
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [tab, setTab] = useState<"write" | "preview">("write")

  const markdownForPreview = useMemo(() => {
    return content.trim() ? content : toPreviewPlaceholder()
  }, [content])

  function applyMarkdown(markdownAction: MarkdownAction) {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = textarea.value.slice(start, end)
    const before = textarea.value.slice(0, start)
    const after = textarea.value.slice(end)

    const result = markdownAction.apply(selected)
    const nextValue = `${before}${result.text}${after}`
    setContent(nextValue)

    requestAnimationFrame(() => {
      textarea.focus()
      const nextCursor = before.length + result.text.length + (result.cursorOffset ?? 0)
      textarea.setSelectionRange(nextCursor, nextCursor)
    })
  }

  return (
    <form action={action} className="mt-4 space-y-3">
      <input type="hidden" name="associationId" value={associationId} />
      {postId !== undefined ? <input type="hidden" name="postId" value={postId} /> : null}

      {postCreated ? <p className="text-sm text-emerald-200">Post publié avec succès.</p> : null}
      {postError ? <p className="text-sm text-red-200">{postError}</p> : null}

      <label className="block space-y-1">
        <span className="text-sm text-white/75">Titre</span>
        <input
          type="text"
          name="title"
          required
          maxLength={255}
          placeholder="Titre du post"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none ring-0 transition focus:border-white/30"
        />
      </label>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-white/75">Contenu (Markdown)</span>

          <div className="inline-flex overflow-hidden rounded-lg border border-white/15">
            <button
              type="button"
              onClick={() => setTab("write")}
              className={
                "px-3 py-1.5 text-xs font-semibold transition " +
                (tab === "write"
                  ? "bg-white/20 text-white"
                  : "bg-black/20 text-white/70 hover:bg-white/10 hover:text-white")
              }
            >
              Ecrire
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={
                "px-3 py-1.5 text-xs font-semibold transition " +
                (tab === "preview"
                  ? "bg-white/20 text-white"
                  : "bg-black/20 text-white/70 hover:bg-white/10 hover:text-white")
              }
            >
              Apercu
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {markdownActions.map((item) => (
            <button
              key={item.label}
              type="button"
              title={item.title}
              onClick={() => applyMarkdown(item)}
              className="rounded-md border border-white/15 bg-black/20 px-2.5 py-1 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "write" ? (
          <textarea
            ref={textareaRef}
            name="contentSource"
            required
            rows={14}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Commencer à écrire un post..."
            className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none ring-0 transition focus:border-white/30 font-mono"
          />
        ) : (
          <div className="min-h-64 rounded-xl border border-white/15 bg-black/20 p-4 text-sm text-white/85">
            <article className="post-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownForPreview}</ReactMarkdown>
            </article>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button type="submit" className="ui-button rounded-xl px-4 py-2 text-sm">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
