import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '@assets/Logo.png';
import styles from './RegisterPage.module.css';

type TipoUsuario = 'Estudiante' | 'Graduado' | 'Profesor' | 'Familiar';
type Posicion = 'Portero' | 'Defensa' | 'Mediocampista' | 'Delantero';

interface FormData {
  nombre: string;
  apellido: string;
  tipoUsuario: TipoUsuario | '';
  email: string;
  password: string;
  confirmPassword: string;
  foto: File | null;
  posicion: Posicion | '';
  dorsal: string;
}

const TIPOS: TipoUsuario[] = ['Estudiante', 'Graduado', 'Profesor', 'Familiar'];
const POSICIONES: Posicion[] = ['Portero', 'Defensa', 'Mediocampista', 'Delantero'];

const STEP_LABELS = ['Datos básicos', 'Datos jugador', 'Confirmación'];

const Stepper: React.FC<{ current: number }> = ({ current }) => (
  <div className={styles.stepper}>
    {STEP_LABELS.map((label, i) => {
      const n = i + 1;
      const done = current > n;
      const active = current === n;
      return (
        <React.Fragment key={n}>
          {i > 0 && (
            <div className={`${styles.stepLine} ${current > n ? styles.stepLineDone : ''}`} />
          )}
          <div className={styles.stepItem}>
            <div className={`${styles.stepCircle} ${active ? styles.stepActive : ''} ${done ? styles.stepDone : ''}`}>
              {done ? '✓' : n}
            </div>
            <span className={`${styles.stepLabel} ${active ? styles.stepLabelActive : ''}`}>
              {label}
            </span>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [data, setData] = useState<FormData>({
    nombre: '', apellido: '', tipoUsuario: '', email: '',
    password: '', confirmPassword: '',
    foto: null, posicion: '', dorsal: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const set = (field: keyof FormData, value: string | File | null) => {
    setData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep1 = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!data.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!data.apellido.trim()) e.apellido = 'El apellido es requerido';
    if (!data.tipoUsuario) e.tipoUsuario = 'Selecciona un tipo de usuario';
    if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Ingresa un correo válido';
    if (data.password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (data.password !== data.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!data.posicion) e.posicion = 'Selecciona una posición';
    const d = Number(data.dorsal);
    if (!data.dorsal || d < 1 || d > 99) e.dorsal = 'Ingresa un número del 1 al 99';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) { setStep(2); return; }
    if (step === 2 && validateStep2()) {
      localStorage.setItem('token', 'mock-token-123');
      localStorage.setItem('user', JSON.stringify({
        name: `${data.nombre} ${data.apellido}`,
        email: data.email,
        role: data.tipoUsuario,
        posicion: data.posicion,
        dorsal: data.dorsal,
        avatar: previewUrl ?? undefined,
      }));
      setStep(3);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    set('foto', file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const subHeader: Record<number, string> = {
    1: 'Únete al torneo semestral de ingeniería',
    2: 'Completa tu perfil deportivo',
    3: 'Confirma tu información',
  };

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <img src={logoImage} alt="TechCup" className={styles.headerLogo} />
          <div>
            <h1 className={styles.headerTitle}>Crear cuenta</h1>
            <p className={styles.headerSub}>{subHeader[step]}</p>
          </div>
        </div>
        <Stepper current={step} />
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>

        {/* Step 1 — Datos básicos */}
        {step === 1 && (
          <div className={styles.card}>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Nombre <span className={styles.req}>*</span></label>
                <input
                  className={`${styles.input} ${errors.nombre ? styles.inputErr : ''}`}
                  placeholder="Juan Sebastian"
                  value={data.nombre}
                  onChange={e => set('nombre', e.target.value)}
                />
                {errors.nombre && <span className={styles.errMsg}>{errors.nombre}</span>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Apellido <span className={styles.req}>*</span></label>
                <input
                  className={`${styles.input} ${errors.apellido ? styles.inputErr : ''}`}
                  placeholder="García"
                  value={data.apellido}
                  onChange={e => set('apellido', e.target.value)}
                />
                {errors.apellido && <span className={styles.errMsg}>{errors.apellido}</span>}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Tipo de usuario <span className={styles.req}>*</span></label>
              <div className={styles.optionGrid}>
                {TIPOS.map(t => (
                  <button
                    key={t} type="button"
                    className={`${styles.optionBtn} ${data.tipoUsuario === t ? styles.optionSelected : ''}`}
                    onClick={() => set('tipoUsuario', t)}
                  >{t}</button>
                ))}
              </div>
              {errors.tipoUsuario && <span className={styles.errMsg}>{errors.tipoUsuario}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Correo electrónico <span className={styles.req}>*</span></label>
              <div className={`${styles.iconInput} ${errors.email ? styles.inputErr : ''}`}>
                <span className={styles.icoLeft}>✉</span>
                <input
                  className={styles.icoInner}
                  type="email"
                  placeholder="j.garcia@escuelaing.edu.co"
                  value={data.email}
                  onChange={e => set('email', e.target.value)}
                />
              </div>
              <span className={styles.hint}>Correo institucional o Gmail para familiares</span>
              {errors.email && <span className={styles.errMsg}>{errors.email}</span>}
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Contraseña <span className={styles.req}>*</span></label>
                <div className={`${styles.iconInput} ${errors.password ? styles.inputErr : ''}`}>
                  <span className={styles.icoLeft}>🔒</span>
                  <input
                    className={styles.icoInner}
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={data.password}
                    onChange={e => set('password', e.target.value)}
                  />
                </div>
                {errors.password && <span className={styles.errMsg}>{errors.password}</span>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Confirmar contraseña <span className={styles.req}>*</span></label>
                <div className={`${styles.iconInput} ${errors.confirmPassword ? styles.inputErr : ''}`}>
                  <span className={styles.icoLeft}>🔒</span>
                  <input
                    className={styles.icoInner}
                    type="password"
                    placeholder="Repite tu contraseña"
                    value={data.confirmPassword}
                    onChange={e => set('confirmPassword', e.target.value)}
                  />
                </div>
                {errors.confirmPassword && <span className={styles.errMsg}>{errors.confirmPassword}</span>}
              </div>
            </div>

            <p className={styles.terms}>
              Acepto los <Link to="/terms" className={styles.termsLink}>términos y condiciones</Link>
            </p>

            <button className={styles.btnPrimary} onClick={handleNext}>Continuar →</button>
            <p className={styles.altRow}>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className={styles.altLink}>Inicia sesión</Link>
            </p>
          </div>
        )}

        {/* Step 2 — Datos jugador */}
        {step === 2 && (
          <div className={styles.card}>
            {/* Foto */}
            <div className={styles.photoSection}>
              <p className={styles.photoTitle}>Foto de perfil</p>
              <div className={styles.photoRow}>
                <button type="button" className={styles.photoCircle} onClick={() => fileInputRef.current?.click()}>
                  {previewUrl
                    ? <img src={previewUrl} alt="preview" className={styles.photoImg} />
                    : <span className={styles.photoIco}>📷</span>}
                </button>
                <div>
                  <p className={styles.photoSubTitle}>Sube tu foto</p>
                  <p className={styles.photoHint}>Formatos: JPG, PNG. Tamaño máximo: 5MB</p>
                  <button type="button" className={styles.fileBtn} onClick={() => fileInputRef.current?.click()}>
                    ↑ Seleccionar archivo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className={styles.hiddenInput}
                    onChange={handleFile}
                  />
                </div>
              </div>
            </div>

            {/* Posición */}
            <div className={styles.field}>
              <label className={styles.label}>Posición de juego <span className={styles.req}>*</span></label>
              <div className={styles.optionGrid}>
                {POSICIONES.map(p => (
                  <button
                    key={p} type="button"
                    className={`${styles.optionBtn} ${data.posicion === p ? styles.optionSelected : ''}`}
                    onClick={() => set('posicion', p)}
                  >{p}</button>
                ))}
              </div>
              {errors.posicion && <span className={styles.errMsg}>{errors.posicion}</span>}
            </div>

            {/* Dorsal */}
            <div className={styles.field} style={{ maxWidth: 380 }}>
              <label className={styles.label}>Número de dorsal <span className={styles.req}>*</span></label>
              <div className={`${styles.iconInput} ${errors.dorsal ? styles.inputErr : ''}`}>
                <span className={styles.icoLeft}>👤</span>
                <input
                  className={styles.icoInner}
                  type="number"
                  min={1} max={99}
                  placeholder="Ej: 10"
                  value={data.dorsal}
                  onChange={e => set('dorsal', e.target.value)}
                />
              </div>
              <span className={styles.hint}>Elige un número del 1 al 99</span>
              {errors.dorsal && <span className={styles.errMsg}>{errors.dorsal}</span>}
            </div>

            <div className={styles.infoBox}>
              ℹ️ Estos datos podrán ser modificados después en tu perfil
            </div>

            <div className={styles.rowBtns}>
              <button className={styles.btnSecondary} onClick={() => setStep(1)}>← Atrás</button>
              <button className={styles.btnPrimary} onClick={handleNext}>Continuar →</button>
            </div>
          </div>
        )}

        {/* Step 3 — Confirmación */}
        {step === 3 && (
          <div className={styles.card}>
            <div className={styles.successBadge}>✓</div>
            <h2 className={styles.successTitle}>¡Registro exitoso!</h2>
            <p className={styles.successSub}>Verifica los datos de tu cuenta</p>

            <div className={styles.userCard}>
              <div className={styles.userAvatarWrap}>
                {previewUrl
                  ? <img src={previewUrl} alt="avatar" className={styles.userAvatarImg} />
                  : <div className={styles.userAvatarEmpty} />}
              </div>
              <div className={styles.userDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Tipo de usuario</span>
                  <span className={styles.detailValue}>🎓 {data.tipoUsuario}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Posición</span>
                  <span className={styles.detailValue}>{data.posicion || 'No especificada'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Número de dorsal</span>
                  <span className={styles.detailValue}>#{data.dorsal || 'N° asignado'}</span>
                </div>
              </div>
            </div>

            <div className={styles.infoBox}>
              🎉 Tu cuenta ha sido creada exitosamente. Ahora puedes acceder al dashboard y comenzar a participar en el torneo.
            </div>

            <div className={styles.rowBtns}>
              <button className={styles.btnSecondary} onClick={() => setStep(2)}>← Editar</button>
              <button className={styles.btnPrimary} onClick={() => navigate('/dashboard')}>
                Ir al Dashboard 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
