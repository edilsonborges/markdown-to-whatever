interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
}

const placeholder = `Cole ou digite seu Markdown aqui...

# Exemplo de título

Seu texto aparecerá no preview ao lado →`;

export function EditorPane({ value, onChange }: EditorPaneProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 border-r border-border">
      <div className="px-4 py-2 bg-secondary border-b border-border">
        <span className="text-sm font-medium text-gray-600">Editor</span>
      </div>
      <textarea
        className="editor-textarea flex-1 w-full p-4 bg-secondary text-text text-sm leading-relaxed"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        aria-label="Editor de Markdown"
      />
    </div>
  );
}
