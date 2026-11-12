import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [onClose]);
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header className="modal-header"><h2 id="modal-title">{title}</h2><button className="icon-button" type="button" aria-label="Close dialog" onClick={onClose}><X size={18} /></button></header>{children}</section></div>;
}
