import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './TournamentConfigPage.module.css';

type Estado = 'Borrador' | 'Activo' | 'En Progreso' | 'Finalizado';

const ESTADOS: Estado[] = ['Borrador', 'Activo', 'En Progreso', 'Finalizado'];

const CANCHAS = [
  { nombre: 'Cancha 1', horario: 'Lunes y Miércoles · 2:00–6:00 PM' },
  { nombre: 'Cancha 2', horario: 'Martes y Jueves · 3:00–7:00 PM' },
  { nombre: 'Cancha 3', horario: 'Sábados · 8:00 AM–1:00 PM' },
];

const SANCIONES = [
  { tag: 'Tarjeta roja', tagColor: styles.tagRed, desc: 'Suspensión 1 partido' },
  { tag: '3 amarillas', tagColor: styles.tagAmber, desc: 'Suspensión 1 partido' },
  { tag: '5 amarillas', tagColor: styles.tagAmber2, desc: 'Suspensión 2 partidos' },
];

export const TournamentConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('2026-1');
  const [fechaInicio, setFechaInicio] = useState('2026-01-03');
  const [fechaFin, setFechaFin] = useState('2026-06-15');
  const [maxEquipos, setMaxEquipos] = useState('8');
  const [costo, setCosto] = useState('$80,000');
  const [estado, setEstado] = useState<Estado>('Activo');
  const [saved, setSaved] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const startDate = new Date(fechaInicio);
  const endDate = new Date(fechaFin);

  const errorInicio = fechaInicio && fechaInicio < today
    ? 'La fecha de inicio no puede ser menor a la fecha actual'
    : null;
  const errorFin = fechaFin && fechaFin <= fechaInicio
    ? fechaFin === fechaInicio
      ? 'La fecha de fin no puede ser igual a la fecha de inicio'
      : 'La fecha de fin no puede ser menor a la fecha de inicio'
    : null;

  const hasError = !!errorInicio || !!errorFin;

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <h1 className={styles.title}>⚙️ Configuración del Torneo</h1>
        <p className={styles.sub}>RF01 · RF02 --- 2026-1</p>

        <div className={styles.layout}>
          {/* Left column */}
          <div className={styles.leftCol}>
            {/* Datos generales */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>📄 Datos generales</div>

              <div className={styles.field}>
                <label className={styles.label}>Nombre del torneo <span className={styles.req}>*</span></label>
                <input
                  className={styles.input}
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                />
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label}>Fecha inicio <span className={styles.req}>*</span></label>
                  <input
                    type="date"
                    className={`${styles.input} ${errorInicio ? styles.inputErr : ''}`}
                    value={fechaInicio}
                    onChange={e => setFechaInicio(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Fecha fin <span className={styles.req}>*</span></label>
                  <input
                    type="date"
                    className={`${styles.input} ${errorFin ? styles.inputErr : ''}`}
                    value={fechaFin}
                    onChange={e => setFechaFin(e.target.value)}
                  />
                </div>
              </div>

              {(errorInicio || errorFin) && (
                <div className={styles.errorBox}>
                  ✗ {errorInicio || errorFin}
                </div>
              )}

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label}>Máx. equipos <span className={styles.req}>*</span></label>
                  <div className={styles.inputWithIcon}>
                    <input
                      type="number"
                      className={styles.input}
                      value={maxEquipos}
                      onChange={e => setMaxEquipos(e.target.value)}
                    />
                    <span className={styles.inputIconRight}>👤</span>
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Costo inscripción <span className={styles.req}>*</span></label>
                  <div className={styles.inputWithIcon}>
                    <input
                      className={styles.input}
                      value={costo}
                      onChange={e => setCosto(e.target.value)}
                    />
                    <span className={styles.inputIconRight}>🔥</span>
                  </div>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Estado del torneo</label>
                <div className={styles.estadoRow}>
                  {ESTADOS.map(e => (
                    <button
                      key={e}
                      className={estado === e ? styles.estadoActive : styles.estadoBtn}
                      onClick={() => setEstado(e)}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reglamento */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>📋 Reglamento</div>
              <div className={styles.reglamento}>
                <p>Cada equipo debe tener entre 7 y 12 jugadores.</p>
                <p>Más del 50% deben pertenecer a los programas elegibles.</p>
                <p>Una tarjeta roja implica suspensión del siguiente partido.</p>
                <p>Tres tarjetas amarillas equivalen a una suspensión automática...</p>
              </div>
              <button className={styles.editBtn}>📄 Editar reglamento</button>
            </div>
          </div>

          {/* Right column */}
          <div className={styles.rightCol}>
            {/* Canchas */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>⚽ Canchas y horarios</div>
              {CANCHAS.map((c, i) => (
                <div key={i} className={styles.canchaRow}>
                  <div className={styles.canchaInfo}>
                    <div className={styles.canchaName}>{c.nombre}</div>
                    <div className={styles.canchaHorario}>{c.horario}</div>
                  </div>
                  <span className={styles.activoBadge}>Activo</span>
                </div>
              ))}
              <button className={styles.addBtn}>+ Agregar cancha</button>
            </div>

            {/* Sanciones */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>⚠️ Sanciones automáticas</div>
              <div className={styles.rfTag}>RF18</div>
              <div className={styles.warnBox}>
                ⚠️ Las sanciones se aplican automáticamente al registrar resultados.
              </div>
              {SANCIONES.map((s, i) => (
                <div key={i} className={styles.sancionRow}>
                  <span className={s.tagColor}>{s.tag}</span>
                  <span className={styles.sancionDesc}>{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className={styles.bottomBtns}>
          <button className={styles.cancelBtn} onClick={() => navigate(-1)}>Cancelar</button>
          <button
            className={`${styles.saveBtn} ${hasError ? styles.saveBtnDisabled : ''}`}
            disabled={hasError}
            onClick={() => { if (!hasError) { setSaved(true); setTimeout(() => setSaved(false), 2000); } }}
          >
            👤 Guardar configuración
          </button>
        </div>
        {saved && <div className={styles.savedMsg}>✓ Configuración guardada correctamente</div>}
      </div>
    </MainLayout>
  );
};
