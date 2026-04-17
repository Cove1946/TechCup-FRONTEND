import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import { paymentService } from '../api/paymentService';
import { tournamentService } from '../api/tournamentService';
import { teamService } from '../api/teamService';
import styles from './PaymentPage.module.css';

type PayStatus = 'pendiente' | 'revision' | 'aprobado' | 'rechazado';
type PageStep  = 'select' | 'pay';

interface Torneo {
  id: number;
  name?: string;
  startDate: string;
  endDate: string;
  totalTeams: number;
  registrationCost: number;
  status: string;
}

interface Step { key: PayStatus; label: string; }
const STEPS: Step[] = [
  { key: 'pendiente', label: 'Pendiente' },
  { key: 'revision',  label: 'En revisión' },
  { key: 'aprobado',  label: 'Aprobado' },
];

const STATUS_INDEX: Record<PayStatus, number> = { pendiente: 0, revision: 1, aprobado: 2, rechazado: -1 };

export const PaymentPage: React.FC = () => {
  const navigate  = useNavigate();
  const fileRef   = useRef<HTMLInputElement>(null);

  const userStr = localStorage.getItem('user');
  let captainId: number | string = 0;
  try { if (userStr) { const u = JSON.parse(userStr); captainId = u.id ?? u.userId ?? 0; } } catch { /* ignore */ }

  // ── Step state ──
  const [pageStep, setPageStep]         = useState<PageStep>('select');
  const [torneos, setTorneos]           = useState<Torneo[]>([]);
  const [loadingTorneos, setLoadingTorneos] = useState(true);
  const [teamId, setTeamId]             = useState<number | null>(null);
  const [loadingTeam, setLoadingTeam]   = useState(true);
  const [noTeamError, setNoTeamError]   = useState(false);
  const [selectedTorneo, setSelectedTorneo] = useState<Torneo | null>(null);
  const [registrationId, setRegistrationId] = useState<number | null>(null);
  const [registering, setRegistering]   = useState<number | null>(null);
  const [registerError, setRegisterError] = useState('');

  // ── Payment state ──
  const [status, setStatus]     = useState<PayStatus>('pendiente');
  const [file, setFile]         = useState<File | null>(null);
  const [fileError, setFileError]   = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [timeline, setTimeline] = useState([
    { label: 'Pendiente', time: 'Hoy 08:00', color: '#f59e0b' },
  ]);

  const isRejected = status === 'rechazado';
  const currentIdx = STATUS_INDEX[status] ?? 0;

  useEffect(() => {
    if (!captainId) { setLoadingTeam(false); setNoTeamError(true); return; }
    teamService.getTeamByCaptain(captainId)
      .then((data: { id: number }) => setTeamId(data.id))
      .catch(() => setNoTeamError(true))
      .finally(() => setLoadingTeam(false));
  }, []);

  useEffect(() => {
    tournamentService.getTournaments()
      .then((data: Torneo[]) => setTorneos(data.filter(t => t.status === 'ACTIVE')))
      .catch(() => {})
      .finally(() => setLoadingTorneos(false));
  }, []);

  const handleSelectTorneo = async (torneo: Torneo) => {
    setRegistering(torneo.id);
    setRegisterError('');
    try {
      const reg = await paymentService.registerPayment(captainId, { tournamentId: torneo.id, teamId });
      setRegistrationId(reg.id);
      setSelectedTorneo(torneo);
      setPageStep('pay');
    } catch (err: any) {
      setRegisterError(err?.response?.data?.message ?? 'Error al registrarse. Intenta nuevamente.');
    } finally {
      setRegistering(null);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFileError('');
    if (!selected) return;
    if (selected.type !== 'application/pdf') {
      setFileError('Solo se aceptan archivos PDF. Por favor selecciona un archivo con extensión .pdf');
      setFile(null);
      e.target.value = '';
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setFileError('El archivo supera el límite de 5 MB');
      setFile(null);
      e.target.value = '';
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const formData = new FormData();
      formData.append('comprobante', file);
      if (registrationId) formData.append('registrationId', String(registrationId));
      if (captainId)      formData.append('captainId', String(captainId));
      await paymentService.submitPayment(formData);

      const now = new Date();
      const timeStr = `Hoy ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
      setStatus('revision');
      setTimeline(prev => [{ label: 'En revisión', time: timeStr, color: '#16a34a' }, ...prev]);
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch {
      setSubmitError('Error al enviar el comprobante. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render: tournament selection ──
  if (pageStep === 'select') {
    return (
      <MainLayout>
        <div className={styles.page}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
          <div className={styles.header}>
            <h1 className={styles.title}>Inscripción & Pago</h1>
            <p className={styles.subtitle}>Selecciona el torneo al que quieres inscribir tu equipo</p>
          </div>

          {noTeamError && (
            <div className={styles.registerError}>
              ⚠️ No tienes un equipo creado. Debes crear tu equipo antes de inscribirte a un torneo.
            </div>
          )}

          {registerError && <div className={styles.registerError}>⚠️ {registerError}</div>}

          {loadingTorneos || loadingTeam ? (
            <p className={styles.loadingText}>Cargando torneos disponibles...</p>
          ) : torneos.length === 0 ? (
            <div className={styles.emptyTorneos}>
              <p>No hay torneos activos disponibles para inscripción en este momento.</p>
            </div>
          ) : (
            <div className={styles.torneoList}>
              {torneos.map(t => (
                <div key={t.id} className={styles.torneoCard}>
                  <div className={styles.torneoInfo}>
                    <h2 className={styles.torneoName}>{t.name ?? `Torneo #${t.id}`}</h2>
                    <div className={styles.torneoMeta}>
                      <span>📅 {t.startDate} → {t.endDate}</span>
                      <span>👥 {t.totalTeams} equipos máx.</span>
                      <span>💵 ${t.registrationCost.toLocaleString()} COP</span>
                    </div>
                  </div>
                  <button
                    className={styles.btnSeleccionar}
                    onClick={() => handleSelectTorneo(t)}
                    disabled={registering === t.id || !teamId}
                  >
                    {registering === t.id ? 'Registrando...' : 'Seleccionar →'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </MainLayout>
    );
  }

  // ── Render: payment form ──
  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => setPageStep('select')}>← Cambiar torneo</button>
        <div className={styles.header}>
          <h1 className={styles.title}>Inscripción & Pago</h1>
          <p className={styles.activeBadge}>
            <span className={styles.activeDot} />
            {selectedTorneo?.name ?? 'Torneo'} · Activo
          </p>
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>

            <div className={styles.stepperCard}>
              {isRejected ? (
                <div className={styles.rejectedBanner}>
                  🚫 Tu comprobante fue <strong>rechazado</strong>. Por favor sube un nuevo comprobante válido.
                </div>
              ) : (
                <div className={styles.stepper}>
                  {STEPS.map((s, i) => {
                    const done   = i < currentIdx;
                    const active = i === currentIdx;
                    return (
                      <React.Fragment key={s.key}>
                        {i > 0 && <div className={`${styles.stepLine} ${done ? styles.stepLineDone : ''}`} />}
                        <div className={styles.stepItem}>
                          <div className={`${styles.stepCircle} ${done ? styles.stepDone : ''} ${active ? styles.stepActive : ''}`}>
                            {done ? '✓' : i + 1}
                          </div>
                          <span className={`${styles.stepLabel} ${active ? styles.stepLabelActive : ''} ${done ? styles.stepLabelDone : ''}`}>
                            {s.label}
                          </span>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <div><p className={styles.infoKey}>Torneo</p><p className={styles.infoVal}>{selectedTorneo?.name ?? `#${selectedTorneo?.id}`}</p></div>
                <div><p className={styles.infoKey}>Valor</p><p className={styles.infoVal}>${selectedTorneo?.registrationCost?.toLocaleString()} COP</p></div>
                <div><p className={styles.infoKey}>Método</p><p className={styles.infoVal}>NEQUI / Efectivo</p></div>
                <div>
                  <p className={styles.infoKey}>Estado</p>
                  <p className={styles.infoVal} style={{ color: isRejected ? '#dc2626' : status === 'aprobado' ? '#16a34a' : status === 'revision' ? '#d97706' : '#6b7280' }}>
                    {isRejected ? 'Rechazado' : status === 'aprobado' ? 'Aprobado' : status === 'revision' ? 'En revisión' : 'Pendiente'}
                  </p>
                </div>
              </div>
            </div>

            {status !== 'aprobado' && (
              <div className={styles.uploadCard}>
                <div className={styles.uploadIcon}>📄</div>
                <p className={styles.uploadTitle}>Sube el comprobante de pago</p>
                <p className={styles.uploadSub}>NEQUI o pago en efectivo</p>
                <p className={styles.uploadHint}>Solo se acepta formato <strong>PDF</strong> · Máximo 5 MB</p>

                {file && (
                  <div className={styles.fileSelected}>
                    <span>📎</span>
                    <span className={styles.fileName}>{file.name}</span>
                    <button className={styles.fileRemove} onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }}>✕</button>
                  </div>
                )}

                {fileError   && <div className={styles.fileError}>⚠️ {fileError}</div>}
                {submitError && <div className={styles.fileError}>⚠️ {submitError}</div>}

                <button className={styles.selectBtn} onClick={() => fileRef.current?.click()}>
                  {file ? 'Cambiar archivo' : 'Seleccionar PDF'}
                </button>
                <input ref={fileRef} type="file" accept=".pdf,application/pdf" className={styles.hiddenInput} onChange={handleFile} />

                <button
                  className={`${styles.submitBtn} ${(!file || submitting) ? styles.submitDisabled : ''}`}
                  onClick={handleSubmit}
                  disabled={!file || submitting}
                >
                  {submitting ? 'Enviando...' : status === 'revision' ? '🔄 Reenviar comprobante' : '📤 Enviar comprobante'}
                </button>

                {status === 'revision' && (
                  <p className={styles.revisionNote}>Tu comprobante está siendo revisado. Puedes reenviar uno nuevo si fue incorrecto.</p>
                )}
              </div>
            )}

            {status === 'aprobado' && (
              <div className={styles.approvedCard}>
                <span className={styles.approvedIcon}>✅</span>
                <div>
                  <p className={styles.approvedTitle}>Pago aprobado</p>
                  <p className={styles.approvedSub}>Tu inscripción está confirmada para {selectedTorneo?.name ?? 'el torneo'}</p>
                </div>
              </div>
            )}
          </div>

          <div className={styles.sidebar}>
            <div className={styles.sideTitle}>Historial</div>
            {timeline.map((t, i) => (
              <div key={i} className={styles.timelineItem}>
                <span className={styles.timelineDot} style={{ background: t.color }} />
                <div>
                  <p className={styles.timelineLabel} style={{ color: t.color }}>{t.label}</p>
                  <p className={styles.timelineTime}>{t.time}</p>
                </div>
              </div>
            ))}
            <div className={styles.sideNote}><span>ℹ️</span><span>El pago debe ser aprobado antes del inicio del torneo.</span></div>
            <div className={styles.sideNote}><span>ℹ️</span><span>El equipo debe estar completo antes de realizar el pago.</span></div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
