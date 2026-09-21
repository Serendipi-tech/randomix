'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useAdminFeedbacks, type AdminFeedbackRow } from '@/utils/useAdminFeedbacks';
import { TAB_LABELS, STATUS_LABELS, STATUS_COLORS, TYPE_LABELS, type FeedbackTab } from '@/utils/feedbackLabels';
import { Badge } from '@/components/atoms/Badge';
import { FeedbackDetailModal } from '@/components/organisms/FeedbackDetailModal';

const dateFormatter = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });

const TABS: FeedbackTab[] = ['received', 'progress', 'concluded'];

export default function FeedbackPage() {
  const {
    feedbacks,
    counts,
    tab,
    setTab,
    search,
    setSearch,
    importantOnly,
    setImportantOnly,
    loading,
    updateStatus,
    updateSeen,
    updateImportant,
    updateNote,
    savingNote,
  } = useAdminFeedbacks();
  const [selected, setSelected] = useState<AdminFeedbackRow | null>(null);

  return (
    <main className="flex flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold text-text-color">Feedback</h1>

      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-3.5 py-2 text-sm ${
              tab === t ? 'bg-primary text-white' : 'bg-foreground text-text-color hover:bg-background'
            }`}
          >
            {TAB_LABELS[t]}
            {t === 'received' && counts.unread > 0 && ` (${counts.unread})`}
            {t === 'progress' && counts.progress > 0 && ` (${counts.progress})`}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca per titolo, testo o autore..."
          className="min-w-64 rounded-[10px] border-[1.5px] border-border bg-foreground px-3.5 py-2.5 text-sm text-text-color"
        />
        <label className="flex items-center gap-2 text-sm text-text-color">
          <input type="checkbox" checked={importantOnly} onChange={(e) => setImportantOnly(e.target.checked)} />
          Solo importanti
        </label>
      </div>

      <div className="flex flex-col gap-2">
        {loading && feedbacks.length === 0 && <p className="text-sm text-disabled">Caricamento…</p>}
        {!loading && feedbacks.length === 0 && <p className="text-sm text-disabled">Nessun feedback in questa vista</p>}
        {feedbacks.map((fb) => (
          <button
            key={fb.id}
            onClick={() => setSelected(fb)}
            className="flex flex-col gap-1.5 rounded-2xl border border-border bg-foreground p-4 text-left hover:bg-background"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-disabled">
                {!fb.seen && <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />}
                {fb.senderUsername ?? 'Utente eliminato'} · {dateFormatter.format(new Date(fb.createdAt))}
              </span>
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateImportant(fb.id, !fb.isImportant);
                }}
                aria-label={fb.isImportant ? 'Rimuovi importante' : 'Segna importante'}
              >
                <Star size={16} color="var(--warning)" fill={fb.isImportant ? 'var(--warning)' : 'none'} />
              </span>
            </div>
            <p className="font-semibold text-text-color">{fb.title ?? fb.text.slice(0, 60)}</p>
            <p className="line-clamp-2 text-sm text-text-color opacity-80">{fb.text}</p>
            <div className="flex flex-wrap gap-2">
              <Badge label={TYPE_LABELS[fb.type]} color="var(--primary)" />
              <Badge label={fb.page} color="var(--disabled)" />
              <Badge label={STATUS_LABELS[fb.status]} color={STATUS_COLORS[fb.status]} />
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <FeedbackDetailModal
          feedback={selected}
          onClose={() => setSelected(null)}
          onChangeStatus={(status) => {
            updateStatus(selected.id, status);
            setSelected({ ...selected, status });
          }}
          onToggleSeen={(seen) => {
            updateSeen(selected.id, seen);
            setSelected({ ...selected, seen });
          }}
          onToggleImportant={(isImportant) => {
            updateImportant(selected.id, isImportant);
            setSelected({ ...selected, isImportant });
          }}
          onSaveNote={(note) => updateNote(selected.id, note)}
          savingNote={savingNote}
        />
      )}
    </main>
  );
}
