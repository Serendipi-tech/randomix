'use client';

interface ColorPickerSheetProps {
  open: boolean;
  onClose: () => void;
  colors: string[];
  selected: string;
  onSelect: (color: string) => void;
}

// Griglia di rettangoli pieni del colore stesso: il selezionato risalta a piena intensità, gli altri
// sono attenuati — nessun bordo/icona sopra il colore. Stesso concetto di ColorPickerSheet mobile.
export function ColorPickerSheet({ open, onClose, colors, selected, onSelect }: ColorPickerSheetProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-foreground p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-color">Scegli un colore</h2>
          <button onClick={onClose} className="text-disabled hover:text-text-color" aria-label="Chiudi">
            ✕
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {colors.map((color) => {
            const isSelected = selected === color;
            return (
              <button
                key={color}
                onClick={() => {
                  onSelect(color);
                  onClose();
                }}
                className={`h-12 rounded-xl ${isSelected ? '' : 'opacity-35'}`}
                style={{ backgroundColor: color }}
                aria-label={color}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
