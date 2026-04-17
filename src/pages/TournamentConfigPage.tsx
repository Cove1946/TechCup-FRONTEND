import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import { tournamentService } from '../api/tournamentService';
import styles from './TournamentConfigPage.module.css';

export const TournamentConfigPage: React.FC = () => {
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  let userId = 0;
  try { if (userStr) userId = JSON.parse(userStr).userId ?? 0; } catch { /* ignore */ }

  const [nombre, setNombre]                   = useState('');
  const [fechaInicio, setFechaInicio]         = useState('');
  const [fechaFin, setFechaFin]               = useState('');
  const [maxEquipos, setMaxEquipos]           = useState('16');
  const [jugadoresPorEquipo, setJugadoresPorEquipo] = useState('7');
  const [inscripcion, setInscripcion]         = useState('500');
  const [descripcion, setDescripcion]         = useState('');
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState<string | null>(null);
  const [saved, setSaved]                     = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) { setError('No se pudo obtener el ID del usuario. Vuelve a iniciar sesión.'); return; }
    setLoading(true);
    setError(null);
    try {
      await tournamentService.createTournament(userId, {
        name: nombre,
        startDate: fechaInicio,
        endDate: fechaFin,
        totalTeams: Number(maxEquipos),
        registrationCost: Number(inscripcion),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al crear el torneo. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <p className={styles.subtitle}>Panel de administración</p>

        <div className={styles.titleRow}>
          <h1 className={styles.title}>Crear Torneo</h1>
        </div>

        {saved  && <div className={styles.savedBanner}>✓ Torneo creado correctamente</div>}
        {error  && <div className={styles.errorBanner}>{error}</div>}

        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Información general</h2>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label}>Nombre del torneo *</label>
                <input className={styles.input} value={nombre} onChange={e => setNombre(e.target.value)} required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Descripción</label>
                <input className={styles.input} value={descripcion} onChange={e => setDescripcion(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Fecha de inicio *</label>
                <input className={styles.input} type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Fecha de fin *</label>
                <input className={styles.input} type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} required />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Configuración de equipos</h2>
            <div className={styles.grid3}>
              <div className={styles.field}>
                <label className={styles.label}>Máx. equipos *</label>
                <input className={styles.input} type="number" min={2} max={64} value={maxEquipos} onChange={e => setMaxEquipos(e.target.value)} required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Jugadores por equipo</label>
                <input className={styles.input} type="number" min={5} max={11} value={jugadoresPorEquipo} onChange={e => setJugadoresPorEquipo(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Cuota de inscripción ($) *</label>
                <input className={styles.input} type="number" min={0} value={inscripcion} onChange={e => setInscripcion(e.target.value)} required />
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.btnCancel} onClick={() => navigate(-1)}>Cancelar</button>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Creando...' : '💾 Crear torneo'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};
