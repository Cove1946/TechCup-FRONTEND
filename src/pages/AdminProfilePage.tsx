import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './AdminProfilePage.module.css';

const ADMIN = {
  name: 'Carlos Pérez',
  email: 'cperez@tecn.mx',
  rol: 'Administrador',
  initials: 'CP',
  phone: '+52 55 1234 5678',
  since: 'Enero 2025',
  torneos: 3,
  equipos: 18,
  partidos: 42,
};

export const AdminProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName]     = useState(ADMIN.name);
  const [email, setEmail]   = useState(ADMIN.email);
  const [phone, setPhone]   = useState(ADMIN.phone);
  const [saved, setSaved]   = useState(false);

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <p className={styles.subtitle}>Panel de administración</p>

        {saved && <div className={styles.savedBanner}>✓ Perfil actualizado correctamente</div>}

        <div className={styles.profileCard}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>{ADMIN.initials}</div>
            <div className={styles.rolBadge}>{ADMIN.rol}</div>
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
                <div className={styles.fieldItem}><span className={styles.fieldKey}>Administrador desde</span><span className={styles.fieldVal}>{ADMIN.since}</span></div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{ADMIN.torneos}</span>
            <span className={styles.statLbl}>Torneos gestionados</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{ADMIN.equipos}</span>
            <span className={styles.statLbl}>Equipos registrados</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{ADMIN.partidos}</span>
            <span className={styles.statLbl}>Partidos programados</span>
          </div>
        </div>

        <div className={styles.actionsGrid}>
          <button className={styles.actionBtn} onClick={() => navigate('/admin/roles')}>👥 Gestión de Roles</button>
          <button className={styles.actionBtn} onClick={() => navigate('/organizer/payments')}>💳 Gestión de Pagos</button>
          <button className={styles.actionBtn} onClick={() => navigate('/organizer/config')}>⚙️ Configurar Torneo</button>
          <button className={styles.actionBtn} onClick={() => navigate('/teams')}>🏆 Ver Equipos</button>
        </div>
      </div>
    </MainLayout>
  );
};
