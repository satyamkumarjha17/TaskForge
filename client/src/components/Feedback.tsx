import type { ReactNode } from 'react';
import { AlertCircle, LoaderCircle } from 'lucide-react';
export function Loading({ label = 'Loading' }: { label?: string }) { return <div className="state-line" role="status"><LoaderCircle size={17} className="spin" />{label}</div>; }
export function ErrorMessage({ message }: { message: string }) { return <div className="error-message" role="alert"><AlertCircle size={16} />{message}</div>; }
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) { return <div className="empty-state"><span className="empty-mark">TF</span><h3>{title}</h3><p>{description}</p>{action}</div>; }
