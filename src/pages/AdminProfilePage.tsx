import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import { adminService } from '../api/adminService';
import styles from './AdminProfilePage.module.css';

export const AdminProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  let storedUser = { name: 'Administrador', email: '' };
  try { if (userStr) storedUser = JSON.parse(userStr); } catch { /* ignore */ }

  const initials = storedUser.name
    .split(' ').slice(0, 2).map((w: string) => w[0] ?? '').join('').toUpperCase();

  const [editing, setEditing] = useState(false);
  const [name, setName]     = useState(storedUser.name);
  const [email, setEmail]   = useState(storedUser.email);
  const [phone, setPhone]   = useState('');
  const [saved, setSaved]   = useState(false);
  const [stats, setStats]   = useState({ torneos: 0, equipos: 0, partidos: 0 });

  useEffect(() => {
    adminService.getStats().then(setStats).catch(() => {});
  }, []);

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
            <div className={styles.avatar}>{initials}</div>
            <div className={styles.rolBadge}>Administrador</div>
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
                <div className={styles.fieldItem}><span className={styles.fieldKey}>Rol</span><span className={styles.fieldVal}>Administrador</span></div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{stats.torneos}</span>
            <span className={styles.statLbl}>Torneos gestionados</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{stats.equipos}</span>
            <span className={styles.statLbl}>Equipos registrados</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{stats.partidos}</span>
            <span className={styles.statLbl}>Partidos programados</span>
          </div>
        </div>

        <div className={styles.actionsGrid}>
          <button className={styles.actionBtn} onClick={() => navigate('/admin/roles')}>👥 Gestión de Roles</button>
          <button className={styles.actionBtn} onClick={() => navigate('/organizer/payments')}>💳 Gestión de Pagos</button>
          <button className={styles.actionBtn} onClick={() => navigate('/torneos')}>⚙️ Gestionar Torneos</button>
          <button className={styles.actionBtn} onClick={() => navigate('/teams')}>🏆 Ver Equipos</button>
        </div>
      </div>
    </MainLayout>
  );
};
