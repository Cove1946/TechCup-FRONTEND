import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import { tournamentService } from '../api/tournamentService';
import styles from './TournamentConfigPage.module.css';

export const TournamentConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;

  const userStr = localStorage.getItem('user');
  let userId = 0;
  try { if (userStr) userId = JSON.parse(userStr).userId ?? 0; } catch { /* ignore */ }

  const [nombre, setNombre]                         = useState('');
  const [fechaInicio, setFechaInicio]               = useState('');
  const [fechaFin, setFechaFin]                     = useState('');
  const [maxEquipos, setMaxEquipos]                 = useState('16');
  const [jugadoresPorEquipo, setJugadoresPorEquipo] = useState('7');
  const [inscripcion, setInscripcion]               = useState('500');
  const [descripcion, setDescripcion]               = useState('');
  const [loading, setLoading]                       = useState(false);
  const [loadingData, setLoadingData]               = useState(isEditing);
  const [error, setError]                           = useState<string | null>(null);
  const [saved, setSaved]                           = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    tournamentService.getTournament(id!)
      .then((t: any) => {
        setNombre(t.name ?? '');
        setFechaInicio(t.startDate ?? '');
        setFechaFin(t.endDate ?? '');
        setMaxEquipos(String(t.totalTeams ?? 16));
        setInscripcion(String(t.registrationCost ?? 500));
      })
      .catch(() => setError('No se pudo cargar el torneo.'))
      .finally(() => setLoadingData(false));
  }, [id, isEditing]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing && !userId) {
      setError('No se pudo obtener el ID del usuario. Vuelve a iniciar sesión.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: nombre,
        startDate: fechaInicio,
        endDate: fechaFin,
        totalTeams: Number(maxEquipos),
        registrationCost: Number(inscripcion),
      };
      if (isEditing) {
        await tournamentService.updateTournament(id!, payload);
      } else {
        await tournamentService.createTournament(userId, payload);
      }
      setSaved(true);
      setTimeout(() => { setSaved(false); navigate('/torneos'); }, 1500);
    } catch (err: any) {
      const status = err?.response?.status;
      const msg    = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message;
      setError(msg ? `[${status}] ${msg}` : `Error al ${isEditing ? 'actualizar' : 'crear'} el torneo (HTTP ${status ?? 'sin respuesta'}).`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <MainLayout><div className={styles.page}>Cargando torneo...</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <p className={styles.subtitle}>Panel de administración</p>

        <div className={styles.titleRow}>
          <h1 className={styles.title}>{isEditing ? 'Editar Torneo' : 'Crear Torneo'}</h1>
        </div>

        {saved  && <div className={styles.savedBanner}>✓ Torneo {isEditing ? 'actualizado' : 'creado'} correctamente</div>}
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
              {loading ? (isEditing ? 'Guardando...' : 'Creando...') : (isEditing ? '💾 Guardar cambios' : '💾 Crear torneo')}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};
