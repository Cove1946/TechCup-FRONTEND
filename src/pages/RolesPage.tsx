import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './RolesPage.module.css';

type Role = 'Coordinador' | 'Árbitro' | 'Capitan' | 'Jugador';

interface User {
  initials: string;
  name: string;
  rol: string;
  email: string;
  fullRole: string;
}

const INITIAL_USERS: User[] = [
  { initials: 'LM', name: 'Laura Mendoza',  rol: 'Coordinador', email: 'lmendoza@escuelaing.edu.co', fullRole: 'Coordinadora del Torneo' },
  { initials: 'RB', name: 'Rogelio B.',     rol: 'Estudiante',  email: 'rb@escuelaing.edu.co',       fullRole: 'Estudiante' },
  { initials: 'CB', name: 'Carlos Brotez',  rol: 'Capitan',     email: 'cb@escuelaing.edu.co',        fullRole: 'Capitán' },
  { initials: 'CG', name: 'Carlos Granma',  rol: 'Árbitro',     email: 'cg@escuelaing.edu.co',        fullRole: 'Árbitro' },
  { initials: 'CB', name: 'Carlos Brotez',  rol: 'Árbitro',     email: 'cb2@escuelaing.edu.co',       fullRole: 'Árbitro' },
  { initials: 'CP', name: 'Carlos Pérez',   rol: 'Estudiante',  email: 'cp@escuelaing.edu.co',        fullRole: 'Estudiante' },
  { initials: 'KP', name: 'Kanor Phonez',   rol: 'Árbitro',     email: 'kp@escuelaing.edu.co',        fullRole: 'Árbitro' },
  { initials: 'RB', name: 'Rogelio B.',     rol: 'Estudiante',  email: 'rb2@escuelaing.edu.co',       fullRole: 'Estudiante' },
];

const AVATAR_COLORS = ['#2563eb', '#9333ea', '#16a34a', '#d97706', '#0891b2', '#be185d', '#ea580c', '#6366f1'];
const ROLES: Role[] = ['Coordinador', 'Árbitro', 'Capitan', 'Jugador'];

export const RolesPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers]           = useState<User[]>(INITIAL_USERS);
  const [selectedUser, setSelectedUser] = useState(0);
  const [selectedRole, setSelectedRole] = useState<Role>('Coordinador');
  const [saved, setSaved]           = useState(false);
  const [confirmDel, setConfirmDel] = useState<number | null>(null);

  // ── Add user form ────────────────────────────────────────────────────────────
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName]  = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole]  = useState<Role>('Jugador');
  const [addError, setAddError] = useState('');

  const user = users[selectedUser] ?? users[0];

  const handleSelect = (i: number) => {
    setSelectedUser(i);
    setSelectedRole('Coordinador');
    setSaved(false);
    setConfirmDel(null);
  };

  const handleSave = () => {
    setUsers(prev => prev.map((u, i) =>
      i === selectedUser ? { ...u, rol: selectedRole, fullRole: selectedRole } : u
    ));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDelete = (i: number) => {
    setUsers(prev => prev.filter((_, idx) => idx !== i));
    setConfirmDel(null);
    setSelectedUser(0);
  };

  const handleAddUser = () => {
    if (!newName.trim()) { setAddError('El nombre es requerido'); return; }
    if (!newEmail.includes('@')) { setAddError('Ingresa un correo válido'); return; }
    const initials = newName.trim().split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    setUsers(prev => [...prev, { initials, name: newName.trim(), rol: newRole, email: newEmail.trim(), fullRole: newRole }]);
    setNewName(''); setNewEmail(''); setNewRole('Jugador'); setAddError('');
    setShowAddForm(false);
    setSelectedUser(users.length); // select the newly added user
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <h1 className={styles.title}>Gestión Roles</h1>
        <p className={styles.sub}>Administra los roles de los usuarios como administrador de la app</p>

        <div className={styles.layout}>
          {/* Left: users table */}
          <div className={styles.leftCol}>
            <div className={styles.card}>
              <div className={styles.tableTitle}>Usuarios ({users.length})</div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr
                      key={i}
                      className={selectedUser === i ? styles.rowSelected : ''}
                      onClick={() => handleSelect(i)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div className={styles.userCell}>
                          <div className={styles.avatar} style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                            {u.initials}
                          </div>
                          {u.name}
                        </div>
                      </td>
                      <td className={styles.rolCell}>{u.rol}</td>
                      <td onClick={e => e.stopPropagation()}>
                        {confirmDel === i ? (
                          <div className={styles.confirmRow}>
                            <button className={styles.actDel} onClick={() => handleDelete(i)}>✓</button>
                            <button className={styles.actView} onClick={() => setConfirmDel(null)}>✕</button>
                          </div>
                        ) : (
                          <div className={styles.actions}>
                            <button className={styles.actView} title="Ver / Seleccionar" onClick={() => handleSelect(i)}>👁</button>
                            <button className={styles.actEdit} title="Seleccionar para editar rol" onClick={() => { handleSelect(i); }}>✏️</button>
                            <button className={styles.actDel}  title="Eliminar usuario" onClick={() => setConfirmDel(i)}>🗑</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Add user form */}
              {showAddForm ? (
                <div className={styles.addForm}>
                  <input className={styles.addInput} placeholder="Nombre completo *" value={newName} onChange={e => setNewName(e.target.value)} />
                  <input className={styles.addInput} placeholder="Correo institucional *" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                  <select className={styles.addInput} value={newRole} onChange={e => setNewRole(e.target.value as Role)}>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {addError && <span className={styles.addError}>{addError}</span>}
                  <div className={styles.addBtns}>
                    <button className={styles.addBtn} onClick={handleAddUser}>✓ Agregar</button>
                    <button className={styles.cancelBtn} onClick={() => { setShowAddForm(false); setAddError(''); }}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <button className={styles.addBtn} onClick={() => setShowAddForm(true)}>+ Agregar usuario</button>
              )}
            </div>

            {!showAddForm && (
              <button className={styles.cancelBtn} onClick={() => navigate(-1)}>← Volver atrás</button>
            )}
          </div>

          {/* Right: user info + role editor */}
          <div className={styles.card}>
            <div className={styles.cardTitle}><span>👤</span> Información de usuario</div>

            <div className={styles.photoBig}>
              <span className={styles.cameraIco} style={{ background: AVATAR_COLORS[selectedUser % AVATAR_COLORS.length] }}>
                {user?.initials ?? '?'}
              </span>
            </div>

            <div className={styles.infoBox}>
              <div className={styles.infoBoxTitle}>Información personal</div>
              <div className={styles.infoItem}>
                <span className={styles.infoIco}>👤</span>
                <div><div className={styles.infoKey}>Nombre completo</div><div className={styles.infoVal}>{user?.name}</div></div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIco}>✉️</span>
                <div><div className={styles.infoKey}>Correo institucional</div><div className={styles.infoVal}>{user?.email}</div></div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIco}>🛡️</span>
                <div><div className={styles.infoKey}>Rol actual</div><div className={styles.infoVal}>{user?.fullRole}</div></div>
              </div>
            </div>

            <div className={styles.roleLabel}>Cambiar rol:</div>
            <div className={styles.roleSelector}>
              {ROLES.map(r => (
                <button
                  key={r}
                  className={selectedRole === r ? styles.roleBtnActive : styles.roleBtn}
                  onClick={() => setSelectedRole(r)}
                >
                  {r}
                </button>
              ))}
            </div>

            {saved && <div className={styles.savedMsg}>✓ Rol actualizado correctamente</div>}

            <button className={styles.saveBtn} onClick={handleSave}>Guardar cambios</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
