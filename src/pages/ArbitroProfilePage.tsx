import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './ArbitroProfilePage.module.css';

export const ArbitroProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPhoto(URL.createObjectURL(f));
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <h1 className={styles.title}>Mi Perfil Profesional</h1>
        <p className={styles.sub}>Gestiona tu perfil como árbitro del torneo</p>

        <div className={styles.grid}>
          {/* Left: profile info */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span className={styles.cardIco}>👤</span> Información de perfil
            </div>

            <div className={styles.section}>
              <div className={styles.sectionLabel}>Foto de perfil</div>
              <div className={styles.photoRow}>
                <div className={styles.photoCircle} onClick={() => fileRef.current?.click()}>
                  {photo
                    ? <img src={photo} alt="foto" className={styles.photoImg} />
                    : <span className={styles.cameraIco}>📷</span>
                  }
                </div>
                <div>
                  <div className={styles.photoAction}>Actualiza tu foto</div>
                  <div className={styles.photoHint}>JPG, PNG. Máx: 5MB</div>
                  <button className={styles.fileBtn} onClick={() => fileRef.current?.click()}>
                    ↑ Seleccionar archivo
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className={styles.hidden} onChange={handleFile} />
                </div>
              </div>
            </div>

            <div className={styles.infoBox}>
              <div className={styles.infoBoxTitle}>Información personal</div>
              <div className={styles.infoItem}>
                <span className={styles.infoIco}>👤</span>
                <div>
                  <div className={styles.infoKey}>Nombre completo</div>
                  <div className={styles.infoVal}>Roberto Sánchez</div>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIco}>✉️</span>
                <div>
                  <div className={styles.infoKey}>Correo institucional</div>
                  <div className={styles.infoVal}>rsanchez@escuelaing.edu.co</div>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIco}>🛡️</span>
                <div>
                  <div className={styles.infoKey}>Rol</div>
                  <div className={styles.infoVal}>Árbitro Certificado</div>
                </div>
              </div>
            </div>

            <div className={styles.note}>
              ℹ️ Los datos personales son tomados de tu cuenta institucional y no pueden ser modificados aquí
            </div>
          </div>

          {/* Right: arbitraje actions */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span className={styles.cardIco}>📊</span> Acciones de arbitraje
            </div>

            <div className={styles.statCard + ' ' + styles.statGreen}>
              <div className={styles.statHeader}>
                <span>📊</span> Partidos arbitrados
              </div>
              <div className={styles.statNum + ' ' + styles.numGreen}>24</div>
              <div className={styles.statSub}>En el torneo actual</div>
            </div>

            <div className={styles.statCard + ' ' + styles.statAmber}>
              <div className={styles.statHeader}>
                <span>🟨</span> Tarjetas mostradas
              </div>
              <div className={styles.statNums}>
                <div>
                  <span className={styles.numAmber}>48</span>
                  <div className={styles.statSub}>Amarillas</div>
                </div>
                <div>
                  <span className={styles.numRed}>8</span>
                  <div className={styles.statSub}>Rojas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
