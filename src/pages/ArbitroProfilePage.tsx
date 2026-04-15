import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './ArbitroProfilePage.module.css';

const ARBITRO = {
  name: 'Luis Durán',
  email: 'lduran@tecn.mx',
  initials: 'LD',
  phone: '+52 55 9876 5432',
  since: 'Febrero 2025',
  categoria: 'Principal',
  partidos: 14,
  tarjetasAmarillas: 22,
  tarjetasRojas: 3,
};

const PARTIDOS_RECIENTES = [
  { id: 1, local: 'FC KERNEL', visitante: 'LOS DEBUGGERS', fecha: '15 Mar', resultado: '3-1', cancha: 'Cancha A' },
  { id: 2, local: 'STACK OVERFLOW', visitante: 'NULL POINTERS', fecha: '10 Mar', resultado: '2-2', cancha: 'Cancha B' },
  { id: 3, local: 'BYTE FORCE', visitante: 'FC KERNEL', fecha: '5 Mar', resultado: '0-2', cancha: 'Cancha A' },
];

export const ArbitroProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName]       = useState(ARBITRO.name);
  const [email, setEmail]     = useState(ARBITRO.email);
  const [phone, setPhone]     = useState(ARBITRO.phone);
  const [saved, setSaved]     = useState(false);

  const handleSave = () => { setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <p className={styles.subtitle}>Perfil de árbitro</p>

        {saved && <div className={styles.savedBanner}>✓ Perfil actualizado correctamente</div>}

        <div className={styles.profileCard}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>{ARBITRO.initials}</div>
            <div className={styles.rolBadge}>🟡 Árbitro</div>
            <div className={styles.catBadge}>{ARBITRO.categoria}</div>
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
                <div className={styles.fieldItem}><span className={styles.fieldKey}>Árbitro desde</span><span className={styles.fieldVal}>{ARBITRO.since}</span></div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{ARBITRO.partidos}</span>
            <span className={styles.statLbl}>Partidos arbitrados</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum} style={{ color: '#d97706' }}>{ARBITRO.tarjetasAmarillas}</span>
            <span className={styles.statLbl}>Tarjetas amarillas</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum} style={{ color: '#dc2626' }}>{ARBITRO.tarjetasRojas}</span>
            <span className={styles.statLbl}>Tarjetas rojas</span>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>Partidos arbitrados recientes</h3>
          {PARTIDOS_RECIENTES.map(p => (
            <div key={p.id} className={styles.matchRow}>
              <div className={styles.matchTeams}>
                <span className={styles.matchTeam}>{p.local}</span>
                <span className={styles.matchScore}>{p.resultado}</span>
                <span className={styles.matchTeam}>{p.visitante}</span>
              </div>
              <div className={styles.matchMeta}>📅 {p.fecha} · 📍 {p.cancha}</div>
              <button className={styles.detailBtn} onClick={() => navigate('/arbitro')}>Ver detalles</button>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};
