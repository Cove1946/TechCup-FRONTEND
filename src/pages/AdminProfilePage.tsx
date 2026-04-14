import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './AdminProfilePage.module.css';

export const AdminProfilePage: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPhoto(URL.createObjectURL(f));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <h1 className={styles.title}>Mi Perfil Profesional</h1>
        <p className={styles.sub}>Administra tu perfil como administrador del sistema</p>

        <div className={styles.grid}>
          {/* Left */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>👤</span> Información de perfil
            </div>

            <div className={styles.sectionLabel}>Foto de perfil</div>
            <div className={styles.photoRow}>
              <div className={styles.photoCircle} onClick={() => fileRef.current?.click()}>
                {photo ? <img src={photo} alt="foto" className={styles.photoImg} /> : <span>📷</span>}
              </div>
              <div>
                <div className={styles.photoAction}>Actualiza tu foto</div>
                <div className={styles.photoHint}>JPG, PNG. Máx: 5MB</div>
                <button className={styles.fileBtn} onClick={() => fileRef.current?.click()}>↑ Seleccionar archivo</button>
                <input ref={fileRef} type="file" accept="image/*" className={styles.hidden} onChange={handleFile} />
              </div>
            </div>

            <div className={styles.infoBox}>
              <div className={styles.infoBoxTitle}>Información personal</div>
              <div className={styles.infoItem}>
                <span className={styles.infoIco}>👤</span>
                <div><div className={styles.infoKey}>Nombre completo</div><div className={styles.infoVal}>Ana Torres</div></div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIco}>✉️</span>
                <div><div className={styles.infoKey}>Correo institucional</div><div className={styles.infoVal}>atorres@escuelaing.edu.co</div></div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIco}>🛡️</span>
                <div><div className={styles.infoKey}>Rol</div><div className={styles.infoVal}>Administrador del Sistema</div></div>
              </div>
            </div>

            <div className={styles.note}>
              ℹ️ Los datos personales son tomados de tu cuenta institucional y no pueden ser modificados aquí
            </div>
          </div>

          {/* Right */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>🔑</span> Control del sistema
            </div>

            <div className={styles.statCard + ' ' + styles.statGreen}>
              <div className={styles.statHeader}><span>👥</span> Usuarios totales</div>
              <div className={styles.statNum + ' ' + styles.numGreen}>248</div>
              <div className={styles.statSub}>Registrados en el sistema</div>
            </div>

            <div className={styles.statCard + ' ' + styles.statPurple}>
              <div className={styles.statHeader}><span>🔒</span> Control total</div>
              <div className={styles.statNums}>
                <div>
                  <span className={styles.numPurple}>16</span>
                  <div className={styles.statSub}>Equipos</div>
                </div>
                <div>
                  <span className={styles.numPurple}>3</span>
                  <div className={styles.statSub}>Torneos</div>
                </div>
              </div>
            </div>

            <button className={styles.logoutBtn} onClick={handleLogout}>
              🗑️ Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
