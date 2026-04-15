import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './CreateTeamPage.module.css';

const PROGRAMAS = ['Ingeniería de Sistemas', 'Ingeniería Inteligencia Artificial', 'Ingeniería Biotecnologia', 'Ingeniería Estadistica', 'Ingeniería en Ciberseguridad'];
const CAPITANES = ['Carlos Pérez', 'María González', 'Pedro Martínez', 'Ana Torres', 'Luis Rodríguez'];

export const CreateTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [programa, setPrograma] = useState('');
  const [capitan, setCapitan] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, foto: 'La foto tiene que pesar máximo 2MB' }));
      return;
    }
    setErrors(prev => ({ ...prev, foto: '' }));
    setPreview(URL.createObjectURL(f));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (nombre.length > 100) e.nombre = 'El nombre excede el número de caracteres límite';
    if (!programa) e.programa = 'Escoge una de las opciones de programa';
    if (!capitan) e.capitan = 'Selecciona un capitán';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) navigate('/teams');
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
          <span className={styles.charHint}>La cantidad máxima de caracteres son 100</span>
          {errors.nombre && <div className={styles.errorBox}>✗ {errors.nombre}</div>}
        </div>

        {/* Programa + Capitán */}
        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.label}>Programa <span className={styles.req}>*</span></label>
            <div className={styles.selectWrap}>
              <select
                className={`${styles.select} ${errors.programa ? styles.inputErr : ''}`}
                value={programa}
                onChange={e => { setPrograma(e.target.value); setErrors(p => ({ ...p, programa: '' })); }}
              >
                <option value="">Ingeniería de Sistemas</option>
                {PROGRAMAS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            {errors.programa && <div className={styles.errorBox}>✗ {errors.programa}</div>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Capitán <span className={styles.req}>*</span></label>
            <div className={styles.selectWrap}>
              <select
                className={`${styles.select} ${errors.capitan ? styles.inputErr : ''}`}
                value={capitan}
                onChange={e => { setCapitan(e.target.value); setErrors(p => ({ ...p, capitan: '' })); }}
              >
                <option value="">Carlos Pérez</option>
                {CAPITANES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {errors.capitan && <div className={styles.errorBox}>✗ {errors.capitan}</div>}
          </div>
        </div>

        <div className={styles.infoBox}>
          ℹ️ Estos datos podrán ser modificados después
        </div>

        <div className={styles.rowBtns}>
          <button className={styles.btnCancel} onClick={() => navigate(-1)}>Cancelar</button>
          <button className={styles.btnConfirm} onClick={handleSubmit}>Confirmar Inscripción</button>
        </div>
      </div>
    </MainLayout>
  );
};
