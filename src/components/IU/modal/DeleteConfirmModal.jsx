import { TriangleAlert, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  entityName = 'registro',
  itemLabel = '',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(248,113,113,0.12),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.9))] px-6 py-5 dark:border-slate-700 dark:bg-[radial-gradient(circle_at_top_left,rgba(248,113,113,0.15),transparent_40%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(15,23,42,0.92))]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300">
                <TriangleAlert className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-rose-500 dark:text-rose-300">
                  Confirmacion requerida
                </p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Eliminar {entityName.toLowerCase()}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Esta acción eliminará el registro seleccionado y no se puede deshacer.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Cerrar confirmación"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-800/70">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
              Registro seleccionado
            </p>
            <p className="mt-2 break-words text-sm font-medium text-slate-700 dark:text-slate-200">
              {itemLabel || 'Sin identificador visible'}
            </p>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-600 bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-rose-700 hover:bg-rose-700"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar definitivamente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
