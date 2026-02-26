import { getStyleOptions } from '../styles/previewStyles';
import type { StyleType } from '../types';

interface StyleSelectorProps {
  selectedStyle: StyleType;
  onStyleChange: (style: StyleType) => void;
}

export function StyleSelector({ selectedStyle, onStyleChange }: StyleSelectorProps) {
  const styles = getStyleOptions();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="style-selector" className="text-sm font-medium text-text hidden sm:inline">
        Estilo:
      </label>
      <select
        id="style-selector"
        value={selectedStyle}
        onChange={(e) => onStyleChange(e.target.value as StyleType)}
        className="px-3 py-1.5 text-sm border border-border rounded-md bg-white text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent cursor-pointer hover:bg-neutral-50 transition-colors"
        data-testid="style-selector"
        aria-label="Selecionar estilo do documento"
      >
        {styles.map((style) => (
          <option key={style.id} value={style.id}>
            {style.name}
          </option>
        ))}
      </select>
    </div>
  );
}
