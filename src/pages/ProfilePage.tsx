import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import { playerService } from '../api/playerService';
import styles from './ProfilePage.module.css';

type Posicion = 'Portero' | 'Defensa' | 'Mediocampista' | 'Delantero';
const POSICIONES: Posicion[] = ['Portero', 'Defensa', 'Mediocampista', 'Delantero'];
const POS_ICO: Record<Posicion, string> = { Portero: '🥅', Defensa: '🛡', Mediocampista: '⚽', Delantero: '🎯' };

const POS_TO_ENUM: Record<string, string> = {
  Portero: 'PORTERO', Defensa: 'DEFENSA', Mediocampista: 'MEDIOCAMPISTA', Delantero: 'DELANTERO',
};
const ENUM_TO_POS: Record<string, Posicion> = {
  PORTERO: 'Portero', DEFENSA: 'Defensa', MEDIOCAMPISTA: 'Mediocampista', DELANTERO: 'Delantero',
};

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: '', email: '', role: 'jugador' };
  const userId: number = user.userId ?? 0;

  const [preview, setPreview]           = useState<string | null>(user.avatar ?? null);
  const [posPrincipal, setPosPrincipal] = useState<Posicion | ''>('');
  const [posSecundaria, setPosSecundaria] = useState<Posicion | ''>('');
  const [dorsal, setDorsal]             = useState('');
  const [semester, setSemester]         = useState('');
  const [available, setAvailable]       = useState(false);
  const [saved, setSaved]               = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    playerService.getSportProfile(userId)
      .then((p: any) => {
        if (p.primaryPosition)   setPosPrincipal(ENUM_TO_POS[p.primaryPosition] ?? '');
        if (p.secondaryPosition) setPosSecundaria(ENUM_TO_POS[p.secondaryPosition] ?? '');
        if (p.jerseyNumber)      setDorsal(String(p.jerseyNumber));
        if (p.semester)          setSemester(String(p.semester));
        if (p.available !== undefined) setAvailable(p.available);
      })
      .catch(() => {}); // 404 es normal si todavía no tiene perfil
  }, [userId]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!posPrincipal) { setError('Selecciona una posición principal.'); return; }
    setLoading(true);
    setError(null);
    try {
      await playerService.createSportProfile(userId, {
        primaryPosition:   POS_TO_ENUM[posPrincipal],
        secondaryPosition: posSecundaria ? POS_TO_ENUM[posSecundaria] : null,
        jerseyNumber:      Number(dorsal) || 0,
        available,
        semester:          semester ? Number(semester) : null,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      const status = err?.response?.status;
      const msg    = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message;
      setError(`[${status ?? 'sin respuesta'}] ${msg ?? 'Error al guardar el perfil deportivo.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Mi Perfil Deportivo</h1>
          <p className={styles.subtitle}>RF03 · RF04 — Completa tu información para ser visible en el torneo</p>
        </div>

        <div className={styles.grid}>
          {/* ── Columna izquierda ── */}
          <div className={styles.leftCol}>
            <div className={styles.card}>
              <div className={styles.cardTitle}><span>👤</span> Información de perfil</div>

              <div className={styles.section}>
                <p className={styles.sectionLabel}>Foto de perfil</p>
                <div className={styles.photoRow}>
                  <div className={styles.photoCircle} onClick={() => fileRef.current?.click()}>
                    {preview ? <img src={preview} alt="avatar" className={styles.photoImg} /> : <span>📷</span>}
                  </div>
                  <div>
                    <p className={styles.photoAction}>Actualiza tu foto</p>
                    <p className={styles.photoHint}>JPG, PNG. Max: 5MB</p>
                    <button className={styles.fileBtn} onClick={() => fileRef.current?.click()}>↑ Seleccionar archivo</button>
                    <input ref={fileRef} type="file" accept="image/*" className={styles.hiddenInput} onChange={handleFile} />
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <p className={styles.sectionLabel}>Información personal</p>
                <div className={styles.infoList}>
                  {[
                    { ico: '👤', key: 'Nombre completo',       val: user.name },
                    { ico: '✉',  key: 'Correo institucional',  val: user.email },
                    { ico: '🛡', key: 'Rol',                   val: user.role ?? 'Jugador' },
                  ].map(r => (
                    <div key={r.key} className={styles.infoItem}>
                      <span className={styles.infoIco}>{r.ico}</span>
                      <div>
                        <p className={styles.infoKey}>{r.key}</p>
                        <p className={styles.infoVal}>{r.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.infoNote}>
                  ℹ️ Los datos personales son tomados de tu cuenta institucional y no pueden ser modificados aquí
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}><span>🛡</span> Información del equipo</div>
              <div className={styles.teamRow}>
                <div>
                  <p className={styles.teamName}>FC KERNEL</p>
                  <p className={styles.teamSub}>Mi equipo actual</p>
                </div>
                <button className={styles.btnSmallGreen} onClick={() => navigate('/teams')}>Ver equipo</button>
              </div>
              <div className={styles.teamRow}>
                <div>
                  <p className={styles.teamName}>Posición #1</p>
                  <p className={styles.teamSub}>En la tabla</p>
                </div>
                <button className={styles.btnSmallOutline} onClick={() => navigate('/tournament/1')}>Ver tabla</button>
              </div>
            </div>
          </div>

          {/* ── Columna derecha ── */}
          <div className={styles.rightCol}>
            <div className={styles.card}>
              <div className={styles.cardTitle}><span>⚽</span> Información deportiva</div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Posición de juego <span className={styles.posTag}>principal</span>
                  <span className={styles.req}>*</span>
                </label>
                <div className={styles.posGrid}>
                  {POSICIONES.map(p => (
                    <button key={p} type="button"
                      className={`${styles.posBtn} ${posPrincipal === p ? styles.posBtnSel : ''}`}
                      onClick={() => setPosPrincipal(p)}
                    >
                      <span>{POS_ICO[p]}</span> {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Posición de juego <span className={styles.posTagGray}>secundaria</span>
                </label>
                <div className={styles.posGrid}>
                  {POSICIONES.map(p => (
                    <button key={p} type="button"
                      className={`${styles.posBtn} ${posSecundaria === p ? styles.posBtnSel : ''}`}
                      onClick={() => setPosSecundaria(p)}
                    >
                      <span>{POS_ICO[p]}</span> {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.grid2col}>
                <div className={styles.field}>
                  <label className={styles.label}>Número de dorsal <span className={styles.req}>*</span></label>
                  <div className={styles.dorsalWrap}>
                    <span className={styles.dorsalIco}>👤</span>
                    <input type="number" min={1} max={99} value={dorsal}
                      onChange={e => setDorsal(e.target.value)}
                      className={styles.dorsalInput} placeholder="10" />
                  </div>
                  <span className={styles.hint}>Del 1 al 99</span>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Semestre</label>
                  <div className={styles.dorsalWrap}>
                    <span className={styles.dorsalIco}>📚</span>
                    <input type="number" min={1} max={10} value={semester}
                      onChange={e => setSemester(e.target.value)}
                      className={styles.dorsalInput} placeholder="5" />
                  </div>
                  <span className={styles.hint}>Del 1 al 10</span>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Disponibilidad</label>
                <button
                  type="button"
                  className={available ? styles.availableOn : styles.availableOff}
                  onClick={() => setAvailable(v => !v)}
                >
                  <span className={styles.availableDot} />
                  {available ? 'Disponible para equipos' : 'No disponible'}
                </button>
                <span className={styles.hint}>
                  {available
                    ? 'Los capitanes pueden encontrarte y enviarte invitaciones'
                    : 'No aparecerás en búsquedas de capitanes'}
                </span>
              </div>

              {error && <div className={styles.errorMsg}>{error}</div>}
              {saved && <div className={styles.savedMsg}>✓ Cambios guardados exitosamente</div>}

              <div className={styles.actionRow}>
                <button className={styles.btnCancel} onClick={() => navigate(-1)}>Cancelar</button>
                <button className={styles.btnSave} onClick={handleSave} disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>

              <button className={styles.btnLogout} onClick={() => { localStorage.clear(); navigate('/login'); }}>
                🚪 Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
