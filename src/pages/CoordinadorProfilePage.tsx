import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './CoordinadorProfilePage.module.css';

const COORD = {
  name: 'Sofía Torres',
  email: 'storres@tecn.mx',
  initials: 'ST',
  phone: '+52 55 5555 1234',
  since: 'Enero 2025',
  torneos: 2,
  equipos: 12,
  incidencias: 5,
};

const TORNEOS = [
  { id: 1, nombre: 'TechCup Primavera 2026', equipos: 12, estado: 'Activo' },
  { id: 2, nombre: 'TechCup Otoño 2025', equipos: 10, estado: 'Finalizado' },
];

export const CoordinadorProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName]       = useState(COORD.name);
  const [email, setEmail]     = useState(COORD.email);
  const [phone, setPhone]     = useState(COORD.phone);
  const [saved, setSaved]     = useState(false);

  const handleSave = () => { setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <p className={styles.subtitle}>Perfil de coordinador</p>

        {saved && <div className={styles.savedBanner}>✓ Perfil actualizado correctamente</div>}

        <div className={styles.profileCard}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>{COORD.initials}</div>
            <div className={styles.rolBadge}>Coordinador</div>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoHeader}>
              <h1 className={styles.name}>{name}</h1>
              <button className={styles.editBtn} onClick={() => editing ? handleSave() : setEditing(true)}>
                {editing ? '💾 Guardar' : '✏️ Editar'}
              </button>
            </div>

            {editing ? (
              <div className={styles.editForm}>
                <label className={styles.fieldLabel}>Nombre</label>
                <input className={styles.input} value={name} onChange={e => setName(e.target.value)} />
                <label className={styles.fieldLabel}>Correo</label>
                <input className={styles.input} value={email} onChange={e => setEmail(e.target.value)} />
                <label className={styles.fieldLabel}>Teléfono</label>
                <input className={styles.input} value={phone} onChange={e => setPhone(e.target.value)} />
                <button className={styles.cancelBtn} onClick={() => setEditing(false)}>Cancelar</button>
              </div>
            ) : (
              <div className={styles.fieldList}>
                <div className={styles.fieldItem}><span className={styles.fieldKey}>Correo</span><span className={styles.fieldVal}>{email}</span></div>
                <div className={styles.fieldItem}><span className={styles.fieldKey}>Teléfono</span><span className={styles.fieldVal}>{phone}</span></div>
                <div className={styles.fieldItem}><span className={styles.fieldKey}>Coordinador desde</span><span className={styles.fieldVal}>{COORD.since}</span></div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{COORD.torneos}</span>
            <span className={styles.statLbl}>Torneos coordinados</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{COORD.equipos}</span>
            <span className={styles.statLbl}>Equipos gestionados</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{COORD.incidencias}</span>
            <span className={styles.statLbl}>Incidencias resueltas</span>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>Torneos a cargo</h3>
          {TORNEOS.map(t => (
            <div key={t.id} className={styles.torneoRow}>
              <div>
                <div className={styles.torneoName}>{t.nombre}</div>
                <div className={styles.torneoMeta}>{t.equipos} equipos</div>
              </div>
              <span className={styles.estadoBadge} style={{ background: t.estado === 'Activo' ? '#f0fdf4' : '#f3f4f6', color: t.estado === 'Activo' ? '#15803d' : '#6b7280' }}>
                {t.estado}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.actionsGrid}>
          <button className={styles.actionBtn} onClick={() => navigate('/organizer/config')}>⚙️ Configurar Torneo</button>
          <button className={styles.actionBtn} onClick={() => navigate('/organizer/payments')}>💳 Gestión de Pagos</button>
          <button className={styles.actionBtn} onClick={() => navigate('/teams')}>🏆 Ver Equipos</button>
          <button className={styles.actionBtn} onClick={() => navigate('/llaves')}>🔑 Ver Llaves</button>
        </div>
      </div>
    </MainLayout>
  );
};
