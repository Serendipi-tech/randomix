'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import type { AdminFeedbackRow } from '@/utils/useAdminFeedbacks';
import { FEEDBACK_STATUSES, STATUS_LABELS, TYPE_LABELS, type FeedbackStatus } from '@/utils/feedbackLabels';
import { Badge } from '@/components/atoms/Badge';

interface FeedbackDetailModalProps {
  feedback: AdminFeedbackRow;
  onClose: () => void;
  onChangeStatus: (status: FeedbackStatus) => void;
  onToggleSeen: (seen: boolean) => void;
  onToggleImportant: (isImportant: boolean) => void;
  onSaveNote: (note: string) => void;
  savingNote: boolean;
}

const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function FeedbackDetailModal({
  feedback,
  onClose,
  onChangeStatus,
  onToggleSeen,
  onToggleImportant,
  onSaveNote,
  savingNote,
}: FeedbackDetailModalProps) {
  const [note, setNote] = useState(feedback.adminNote ?? '');
  const [justSaved, setJustSaved] = useState(false);

  // All'apertura, se non era ancora letto, viene marcato automaticamente come letto (comportamento
  // da preservare, non un dettaglio implementativo legato al DOM — vedi UX_FLOWS.md Flow 3).
  useEffect(() => {
    if (!feedback.seen) onToggleSeen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback.id]);

  const saveNote = () => {
    onSaveNote(note);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-2xl border border-border bg-foreground p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-color">{feedback.title ?? feedback.text.slice(0, 60)}</h2>
            <p className="text-sm text-disabled">da {feedback.senderUsername ?? 'Utente eliminato'}</p>
          </div>
          <button onClick={onClose} className="text-disabled hover:text-text-color" aria-label="Chiudi">
            ✕
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge label={TYPE_LABELS[feedback.type]} color="var(--primary)" />
          <Badge label={feedback.page} color="var(--disabled)" />
          <button
            onClick={() => onToggleImportant(!feedback.isImportant)}
            className="ml-auto"
            aria-label={feedback.isImportant ? 'Rimuovi importante' : 'Segna importante'}
          >
            <Star size={18} color="var(--warning)" fill={feedback.isImportant ? 'var(--warning)' : 'none'} />
          </button>
        </div>

        <p className="whitespace-pre-wrap text-sm text-text-color">{feedback.text}</p>

        <p className="text-xs text-disabled">Inviato il {dateFormatter.format(new Date(feedback.createdAt))}</p>

        <div className="flex flex-col gap-1.5 border-t border-border pt-4">
          <span className="text-sm font-semibold text-text-color">Stato</span>
          <select
            value={feedback.status}
            onChange={(e) => onChangeStatus(e.target.value as FeedbackStatus)}
            className="w-full rounded-[10px] border-[1.5px] border-border bg-foreground px-3.5 py-3 text-sm text-text-color"
          >
            {FEEDBACK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-text-color">
          <input type="checkbox" checked={feedback.seen} onChange={(e) => onToggleSeen(e.target.checked)} />
          Letto
        </label>

        <div className="flex flex-col gap-1.5 border-t border-border pt-4">
          <span className="text-sm font-semibold text-text-color">Nota interna</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full rounded-[10px] border-[1.5px] border-border bg-foreground px-3.5 py-3 text-sm text-text-color"
            placeholder="Visibile solo al team, mai all'utente"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={saveNote}
              disabled={savingNote}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              Salva nota
            </button>
            {justSaved && <span className="text-xs text-success">Salvato</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
