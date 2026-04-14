import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './PaymentPage.module.css';

type PayStatus = 'pendiente' | 'revision' | 'aprobado' | 'rechazado';

const STEPS: { key: PayStatus; label: string }[] = [
  { key: 'pendiente', label: 'Pendiente' },
  { key: 'revision', label: 'En revisión' },
  { key: 'aprobado', label: 'Aprobado' },
  { key: 'rechazado', label: 'Rechazado' },
];

const STEP_INDEX: Record<PayStatus, number> = { pendiente: 0, revision: 1, aprobado: 2, rechazado: 3 };

const TIMELINE = [
  { label: 'En revisión', time: 'Hoy 09:30', color: '#16a34a' },
  { label: 'Pendiente', time: 'Ayer 15:12', color: '#f59e0b' },
];

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [status] = useState<PayStatus>('revision');
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const currentIdx = STEP_INDEX[status];
  const isRejected = status === 'rechazado';

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (file) setSubmitted(true);
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <div className={styles.header}>
          <h1 className={styles.title}>Inscripción & Pago</h1>
          <p className={styles.activeBadge}>
            <span className={styles.activeDot} /> 2026-1 · Activo
          </p>
        </div>

        <div className={styles.layout}>
          {/* ── Main ── */}
          <div className={styles.main}>
            {/* Stepper */}
            <div className={styles.stepperCard}>
              <div className={styles.stepper}>
                {STEPS.map((s, i) => {
                  const done = i < currentIdx && !(isRejected && i >= currentIdx);
                  const active = i === currentIdx;
                  const rejected = isRejected && i === STEPS.length - 1;
                  return (
                    <React.Fragment key={s.key}>
                      {i > 0 && (
                        <div className={`${styles.stepLine}
                          ${done || (isRejected && i <= currentIdx) ? styles.stepLineDone : ''}
                          ${isRejected && i >= currentIdx ? styles.stepLineRed : ''}`}
                        />
                      )}
                      <div className={styles.stepItem}>
                        <div className={`${styles.stepCircle}
                          ${done ? styles.stepDone : ''}
                          ${active && !isRejected ? styles.stepActive : ''}
                          ${rejected ? styles.stepRejected : ''}`}
                        >
                          {done ? '✓' : rejected ? '●' : '●'}
                        </div>
                        <span className={`${styles.stepLabel} ${active ? styles.stepLabelActive : ''}`}>
                          {s.label}
                        </span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Info del pago */}
            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <div><p className={styles.infoKey}>Equipo:</p><p className={styles.infoVal}>FC KERNEL</p></div>
                <div><p className={styles.infoKey}>Valor:</p><p className={styles.infoVal}>$80,000 COP</p></div>
                <div><p className={styles.infoKey}>Método:</p><p className={styles.infoVal}>NEQUI / EFECTIVO</p></div>
              </div>
            </div>

            {/* Upload */}
            <div className={styles.uploadCard}>
              <div className={styles.uploadIcon}>↑</div>
              <p className={styles.uploadTitle}>Sube el comprobante de tu pago</p>
              <p className={styles.uploadSub}>por NEQUI o efectivo</p>
              <p className={styles.uploadHint}>PNG, JPG, PDF, max 5MB</p>
              {file && <p className={styles.fileName}>📎 {file.name}</p>}
              <button className={styles.selectBtn} onClick={() => fileRef.current?.click()}>
                Seleccionar archivo
              </button>
              <input ref={fileRef} type="file" accept="image/*,.pdf" className={styles.hiddenInput} onChange={handleFile} />
              <button
                className={`${styles.submitBtn} ${(!file || submitted) ? styles.submitDisabled : ''}`}
                onClick={handleSubmit}
                disabled={!file || submitted}
              >
                {submitted ? 'Solicitud en revisión' : 'Subir nueva solicitud'}
              </button>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className={styles.sidebar}>
            {TIMELINE.map((t, i) => (
              <div key={i} className={styles.timelineItem}>
                <span className={styles.timelineDot} style={{ background: t.color }} />
                <div>
                  <p className={styles.timelineLabel} style={{ color: t.color }}>{t.label}</p>
                  <p className={styles.timelineTime}>{t.time}</p>
                </div>
              </div>
            ))}

            <div className={styles.sideNote}>
              <span>ℹ️</span>
              <span>El pago debe ser aprobado antes del inicio del torneo.</span>
            </div>
            <div className={styles.sideNote}>
              <span>ℹ️</span>
              <span>Para realizar el pago debe estar el equipo completo previamente</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
