import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './TournamentConfigPage.module.css';

export const TournamentConfigPage: React.FC = () => {
  const navigate = useNavigate();

  const [nombre, setNombre]       = useState('TechCup Primavera 2026');
  const [fechaInicio, setFechaInicio] = useState('2026-03-01');
  const [fechaFin, setFechaFin]   = useState('2026-06-30');
  const [maxEquipos, setMaxEquipos] = useState('16');
  const [jugadoresPorEquipo, setJugadoresPorEquipo] = useState('7');
  const [formato, setFormato]     = useState('eliminacion');
  const [cancha, setCancha]       = useState('Cancha Principal TecNM');
  const [inscripcion, setInscripcion] = useState('500');
  const [descripcion, setDescripcion] = useState('Torneo universitario de fútbol rápido.');
  const [saved, setSaved]         = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <p className={styles.subtitle}>Panel de administración</p>

        <div className={styles.titleRow}>
          <h1 className={styles.title}>Configurar Torneo</h1>
        </div>

        {saved && <div className={styles.savedBanner}>✓ Configuración guardada correctamente</div>}

        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Información general</h2>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label}>Nombre del torneo</label>
                <input className={styles.input} value={nombre} onChange={e => setNombre(e.target.value)} required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Cancha principal</label>
                <input className={styles.input} value={cancha} onChange={e => setCancha(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Fecha de inicio</label>
                <input className={styles.input} type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Fecha de fin</label>
                <input className={styles.input} type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Descripción</label>
              <textarea className={styles.textarea} value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={3} />
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Configuración de equipos</h2>
            <div className={styles.grid3}>
              <div className={styles.field}>
                <label className={styles.label}>Máx. equipos</label>
                <input className={styles.input} type="number" min={2} max={64} value={maxEquipos} onChange={e => setMaxEquipos(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Jugadores por equipo</label>
                <input className={styles.input} type="number" min={5} max={11} value={jugadoresPorEquipo} onChange={e => setJugadoresPorEquipo(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Cuota de inscripción ($)</label>
                <input className={styles.input} type="number" min={0} value={inscripcion} onChange={e => setInscripcion(e.target.value)} />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Formato del torneo</h2>
            <div className={styles.formatoGrid}>
              {[
                { val: 'eliminacion', label: 'Eliminación directa', desc: 'Los equipos se eliminan con una sola derrota.' },
                { val: 'grupos', label: 'Fase de grupos', desc: 'Grupos clasificatorios y luego eliminación.' },
                { val: 'todos', label: 'Todos contra todos', desc: 'Cada equipo juega contra todos los demás.' },
              ].map(f => (
                <button type="button" key={f.val}
                  className={formato === f.val ? styles.formatoCardActive : styles.formatoCard}
                  onClick={() => setFormato(f.val)}>
                  <span className={styles.formatoLabel}>{f.label}</span>
                  <span className={styles.formatoDesc}>{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.btnCancel} onClick={() => navigate(-1)}>Cancelar</button>
            <button type="submit" className={styles.btnPrimary}>💾 Guardar configuración</button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};
