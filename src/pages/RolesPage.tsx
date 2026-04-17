import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import { adminService } from '../api/adminService';
import styles from './RolesPage.module.css';

type Role = 'jugador' | 'capitan' | 'coordinador' | 'arbitro' | 'admin';

interface User {
  id: number;
  name: string;
  email: string;
  rol: Role;
}

const ROLE_LABELS: Record<Role, string> = {
  jugador: 'Jugador',
  capitan: 'Capitán',
  coordinador: 'Coordinador',
  arbitro: 'Árbitro',
  admin: 'Admin',
};

const ROLE_COLORS: Record<Role, string> = {
  jugador: '#6b7280',
  capitan: '#15803d',
  coordinador: '#1e3a8a',
  arbitro: '#7c3aed',
  admin: '#dc2626',
};

export const RolesPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers]           = useState<User[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [editId, setEditId]         = useState<number | null>(null);
  const [editRol, setEditRol]       = useState<Role>('jugador');
  const [confirmDel, setConfirmDel] = useState<number | null>(null);
  const [showAdd, setShowAdd]       = useState(false);
  const [newName, setNewName]       = useState('');
  const [newEmail, setNewEmail]     = useState('');
  const [newRol, setNewRol]         = useState<Role>('jugador');
  const [saved, setSaved]           = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminService.getAdministrators();
        setUsers(data);
      } catch {
        setError('No se pudieron cargar los usuarios');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleEdit = (u: User) => { setEditId(u.id); setEditRol(u.rol); };

  const handleSave = async (id: number) => {
    try {
      await adminService.assignRole(id, { role: editRol });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, rol: editRol } : u));
      setEditId(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // Error handled silently; state remains unchanged
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminService.deleteAdministrator(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      setConfirmDel(null);
    } catch {
      // Error handled silently
    }
  };

  const handleAdd = async () => {
    if (!newName.trim() || !newEmail.trim()) return;
    try {
      const created = await adminService.createAdministrator({
        name: newName.trim(),
        email: newEmail.trim(),
        role: newRol,
      });
      setUsers(prev => [...prev, created]);
      setNewName(''); setNewEmail(''); setNewRol('jugador'); setShowAdd(false);
    } catch {
      // Error handled silently
    }
  };

  if (loading) return <MainLayout><div className={styles.page}>Cargando usuarios...</div></MainLayout>;
  if (error) return <MainLayout><div className={styles.page}>{error}</div></MainLayout>;

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <p className={styles.subtitle}>Panel de administración</p>

        <div className={styles.titleRow}>
          <h1 className={styles.title}>Gestión de Roles</h1>
          <button className={styles.btnPrimary} onClick={() => setShowAdd(s => !s)}>
            {showAdd ? '✕ Cancelar' : '+ Agregar usuario'}
          </button>
        </div>

        {saved && <div className={styles.savedBanner}>✓ Rol actualizado correctamente</div>}

        {showAdd && (
          <div className={styles.addForm}>
            <h3 className={styles.addFormTitle}>Nuevo usuario</h3>
            <div className={styles.addFormFields}>
              <input className={styles.input} placeholder="Nombre completo" value={newName} onChange={e => setNewName(e.target.value)} />
              <input className={styles.input} placeholder="Correo electrónico" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
              <select className={styles.select} value={newRol} onChange={e => setNewRol(e.target.value as Role)}>
                {(Object.keys(ROLE_LABELS) as Role[]).map(r => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
              <button className={styles.btnPrimary} onClick={handleAdd}>Agregar</button>
            </div>
          </div>
        )}

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Rol actual</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar} style={{ background: ROLE_COLORS[u.rol] }}>
                        {u.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <span className={styles.userName}>{u.name}</span>
                    </div>
                  </td>
                  <td className={styles.emailCell}>{u.email}</td>
                  <td>
                    {editId === u.id ? (
                      <select className={styles.select} value={editRol} onChange={e => setEditRol(e.target.value as Role)}>
                        {(Object.keys(ROLE_LABELS) as Role[]).map(r => (
                          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={styles.roleLabel} style={{ background: ROLE_COLORS[u.rol] + '22', color: ROLE_COLORS[u.rol] }}>
                        {ROLE_LABELS[u.rol]}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {editId === u.id ? (
                        <>
                          <button className={styles.btnSave} onClick={() => handleSave(u.id)}>Guardar</button>
                          <button className={styles.btnCancel} onClick={() => setEditId(null)}>Cancelar</button>
                        </>
                      ) : (
                        <>
                          <button className={styles.btnEdit} onClick={() => handleEdit(u)}>Editar rol</button>
                          {confirmDel === u.id ? (
                            <>
                              <button className={styles.btnDanger} onClick={() => handleDelete(u.id)}>Confirmar</button>
                              <button className={styles.btnCancel} onClick={() => setConfirmDel(null)}>No</button>
                            </>
                          ) : (
                            <button className={styles.btnDelete} onClick={() => setConfirmDel(u.id)}>Eliminar</button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.summary}>
          {(Object.keys(ROLE_LABELS) as Role[]).map(r => {
            const count = users.filter(u => u.rol === r).length;
            return (
              <div key={r} className={styles.summaryItem}>
                <span className={styles.summaryCount} style={{ color: ROLE_COLORS[r] }}>{count}</span>
                <span className={styles.summaryLabel}>{ROLE_LABELS[r]}{count !== 1 ? 's' : ''}</span>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};
