import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import { teamService } from '../api/teamService';
import styles from './CreateTeamPage.module.css';

const COLORS = [
  '#16a34a', '#dc2626', '#2563eb', '#d97706', '#7c3aed',
  '#0891b2', '#db2777', '#111827', '#ffffff',
];

export const CreateTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};
  const captainId: number = user.userId ?? 0;

  const [preview, setPreview] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [mainColor, setMainColor] = useState('#16a34a');
  const [secondaryColor, setSecondaryColor] = useState('#ffffff');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, foto: 'Máximo 5MB' }));
      return;
    }
    setErrors(prev => ({ ...prev, foto: '' }));
    setPreview(URL.createObjectURL(f));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!nombre.trim()) e.nombre = 'El nombre es requerido';
    if (nombre.length > 100) e.nombre = 'Máximo 100 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!captainId) { setApiError('Sesión inválida. Inicia sesión de nuevo.'); return; }
    setLoading(true);
    setApiError(null);
    try {
      const team = await teamService.createTeam(captainId, {
        name: nombre.trim(),
        shieldUrl: null,
        mainColor,
        secondaryColor,
      });
      if (team?.id) {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...u, teamId: team.id }));
      }
      navigate('/teams');
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message;
      setApiError(`[${status ?? 'sin respuesta'}] ${msg ?? 'Error al crear el equipo.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        <h1 className={styles.title}>Crear Nuevo Equipo</h1>
        <p className={styles.sub}>Completa la información para inscribir tu equipo al torneo</p>

        {/* Escudo */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Escudo del equipo</h2>
          <div className={styles.shieldArea}>
            <div className={styles.shieldCircle} onClick={() => fileRef.current?.click()}>
              {preview
                ? <img src={preview} alt="escudo" className={styles.shieldImg} />
                : <span className={styles.shieldIco}>📷</span>}
            </div>
            <div className={styles.shieldInfo}>
              <p className={styles.uploadTitle}>Sube tu foto</p>
              <p className={styles.uploadHint}>Formatos: JPG, PNG. Tamaño máximo: 5MB</p>
              <button className={styles.fileBtn} onClick={() => fileRef.current?.click()}>
                ↑ Seleccionar archivo
              </button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png" className={styles.hiddenInput} onChange={handleFile} />
            </div>
          </div>
          {errors.foto && <div className={styles.errorBox}>✗ {errors.foto}</div>}
        </div>

        {/* Nombre */}
        <div className={styles.field}>
          <label className={styles.label}>Nombre del equipo <span className={styles.req}>*</span></label>
          <input
            className={`${styles.input} ${errors.nombre ? styles.inputErr : ''}`}
            placeholder="FC KERNEL"
            value={nombre}
            maxLength={110}
            onChange={e => { setNombre(e.target.value); setErrors(p => ({ ...p, nombre: '' })); }}
          />
          <span className={styles.charHint}>{nombre.length}/100 caracteres</span>
          {errors.nombre && <div className={styles.errorBox}>✗ {errors.nombre}</div>}
        </div>

        {/* Colores */}
        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.label}>Color principal</label>
            <div className={styles.colorRow}>
              {COLORS.map(c => (
                <button
                  key={c} type="button"
                  className={`${styles.colorDot} ${mainColor === c ? styles.colorDotSel : ''}`}
                  style={{ background: c, border: c === '#ffffff' ? '1.5px solid #d1d5db' : undefined }}
                  onClick={() => setMainColor(c)}
                />
              ))}
            </div>
            <div className={styles.colorPreview} style={{ background: mainColor, border: mainColor === '#ffffff' ? '1px solid #d1d5db' : undefined }} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Color secundario</label>
            <div className={styles.colorRow}>
              {COLORS.map(c => (
                <button
                  key={c} type="button"
                  className={`${styles.colorDot} ${secondaryColor === c ? styles.colorDotSel : ''}`}
                  style={{ background: c, border: c === '#ffffff' ? '1.5px solid #d1d5db' : undefined }}
                  onClick={() => setSecondaryColor(c)}
                />
              ))}
            </div>
            <div className={styles.colorPreview} style={{ background: secondaryColor, border: secondaryColor === '#ffffff' ? '1px solid #d1d5db' : undefined }} />
          </div>
        </div>

        <div className={styles.infoBox}>
          ℹ️ Estos datos podrán ser modificados después
        </div>

        {apiError && <div className={styles.errorBox}>{apiError}</div>}

        <div className={styles.rowBtns}>
          <button className={styles.btnCancel} onClick={() => navigate(-1)}>Cancelar</button>
          <button className={styles.btnConfirm} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creando...' : 'Confirmar Inscripción'}
          </button>
        </div>
      </div>
    </MainLayout>
  );
};
