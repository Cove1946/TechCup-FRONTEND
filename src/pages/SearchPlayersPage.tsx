import React, { useState } from 'react';
import { MainLayout } from '@components/layout';
import styles from './SearchPlayersPage.module.css';

type Posicion = 'POR' | 'DEF' | 'MED' | 'DEL';
type Genero = 'All' | 'M' | 'F';

interface Player {
  id: number; initials: string; color: string;
  name: string; program: string;
  pos: Posicion; semestre: number; edad: number; genero: 'M' | 'F';
  available: boolean; invited?: boolean;
}

const PLAYERS: Player[] = [
  { id: 1, initials: 'SM', color: '#6366f1', name: 'Sofía Martínez', program: 'Ingeniería de Sistemas', pos: 'POR', semestre: 4, edad: 20, genero: 'F', available: true },
  { id: 2, initials: 'CRG', color: '#10b981', name: 'Cristian Guerrero', program: 'Ingeniería de Sistemas', pos: 'DEF', semestre: 5, edad: 20, genero: 'M', available: true },
  { id: 3, initials: 'JNT', color: '#f59e0b', name: 'Juan Tellez', program: 'Ingeniería de Sistemas', pos: 'DEF', semestre: 6, edad: 22, genero: 'M', available: false },
  { id: 4, initials: 'DNP', color: '#06b6d4', name: 'Daniela Plazas', program: 'Ingeniería en Ciberseguridad', pos: 'POR', semestre: 2, edad: 18, genero: 'M', available: true },
  { id: 5, initials: 'LRS', color: '#a855f7', name: 'Laura Sanchez', program: 'Ingeniería de Sistemas', pos: 'DEF', semestre: 3, edad: 19, genero: 'F', available: false },
  { id: 6, initials: 'ADC', color: '#f97316', name: 'Adrian Ducara', program: 'Ingeniería de Sistemas', pos: 'POR', semestre: 6, edad: 22, genero: 'M', available: true },
];

const SORT_OPTIONS = ['Posición', 'Nombre', 'Semestre', 'Edad'];

export const SearchPlayersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [posFilter, setPosFilter] = useState<Posicion[]>([]);
  const [semRange] = useState<[number, number]>([1, 10]);
  const [edadRange] = useState<[number, number]>([16, 30]);
  const [genero, setGenero] = useState<Genero>('All');
  const [sortBy, setSortBy] = useState('Posición');
  const [invited, setInvited] = useState<Set<number>>(new Set());
  const [searchError, setSearchError] = useState('');
  const [searched, setSearched] = useState(false);

  const togglePos = (p: Posicion) => {
    setPosFilter(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const filtered = PLAYERS.filter(p => {
    if (posFilter.length > 0 && !posFilter.includes(p.pos)) return false;
    if (genero !== 'All' && p.genero !== genero) return false;
    if (p.semestre < semRange[0] || p.semestre > semRange[1]) return false;
    if (p.edad < edadRange[0] || p.edad > edadRange[1]) return false;
    return true;
  });

  const handleSearch = () => {
    setSearched(true);
    if (search.trim()) {
      const found = filtered.some(p => p.name.toLowerCase().includes(search.toLowerCase()));
      setSearchError(found ? '' : `No se encontró un jugador con ese nombre o ID "${search}"`);
    } else {
      setSearchError('');
    }
  };

  const handleClear = () => {
    setSearch(''); setPosFilter([]); setGenero('All');
    setSearchError(''); setSearched(false);
  };

  const handleInvite = (id: number) => {
    setInvited(prev => new Set([...prev, id]));
  };

  const available = filtered.filter(p => p.available).length;

  return (
    <MainLayout>
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Buscar Jugadores</h1>
            <p className={styles.sub}>RF04 — Encuentra al jugador ideal para tu equipo</p>
          </div>
          <span className={styles.badge}>2026-1 Activo</span>
        </div>

        {/* Stats + sort */}
        <div className={styles.topBar}>
          <p className={styles.stats}>
            <strong>{filtered.length} jugadores</strong> encontrados&nbsp;&nbsp;
            <strong>{available} disponibles</strong>
          </p>
          <div className={styles.sortRow}>
            <span className={styles.sortLabel}>ℹ️ Puedes enviar hasta 5 invitaciones por día</span>
            <div className={styles.sortSelect}>
              <span className={styles.sortText}>Ordenar por:</span>
              <select className={styles.select} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.layout}>
          {/* ── Sidebar filtros ── */}
          <div className={styles.sidebar}>
            <h3 className={styles.filterTitle}>Filtros</h3>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Nombre o ID</label>
              <input
                className={styles.filterInput}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder=""
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Posición</label>
              <div className={styles.checkGrid}>
                {(['POR', 'DEF', 'MED', 'DEL'] as Posicion[]).map(p => (
                  <label key={p} className={styles.checkLabel}>
                    <input type="checkbox" checked={posFilter.includes(p)} onChange={() => togglePos(p)} />
                    {p}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Semestre</label>
              <div className={styles.rangeInfo}>
                <span>1</span><span>10</span>
              </div>
              <input type="range" min={1} max={10} className={styles.range} defaultValue={10} />
              <div className={styles.rangeVals}><span>1</span><span>10</span></div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Edad</label>
              <div className={styles.rangeInfo}>
                <span>16</span><span>30</span>
              </div>
              <input type="range" min={16} max={30} className={styles.range} defaultValue={30} />
              <div className={styles.rangeVals}><span>16</span><span>30</span></div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Género</label>
              <div className={styles.radioRow}>
                {(['All', 'M', 'F'] as Genero[]).map(g => (
                  <label key={g} className={styles.radioLabel}>
                    <input type="radio" name="genero" checked={genero === g} onChange={() => setGenero(g)} />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filterActions}>
              <button className={styles.btnSearch} onClick={handleSearch}>Buscar</button>
              <button className={styles.btnClear} onClick={handleClear}>Limpiar filtros</button>
            </div>
          </div>

          {/* ── Grid jugadores ── */}
          <div className={styles.main}>
            {searchError && (
              <div className={styles.searchError}>✗ {searchError}</div>
            )}

            <div className={styles.playersGrid}>
              {filtered.map(p => {
                const isInvited = invited.has(p.id);
                return (
                  <div key={p.id} className={styles.playerCard}>
                    <div className={styles.avatar} style={{ background: p.color }}>
                      {p.initials}
                    </div>
                    <p className={styles.playerName}>{p.name}</p>
                    <p className={styles.playerProgram}>{p.program}</p>
                    <p className={styles.playerInfo}>
                      {p.pos} · Sem. {p.semestre} · {p.edad} años · {p.genero}
                    </p>
                    <span className={`${styles.availBadge} ${p.available ? styles.availYes : styles.availNo}`}>
                      {p.available ? 'Disponible' : 'No disponible'}
                    </span>
                    {p.available ? (
                      <button
                        className={`${styles.inviteBtn} ${isInvited ? styles.invitedBtn : ''}`}
                        onClick={() => !isInvited && handleInvite(p.id)}
                        disabled={isInvited}
                      >
                        ✉ {isInvited ? 'Invitacion Enviada' : 'Invitar'}
                      </button>
                    ) : (
                      <button className={styles.disabledBtn} disabled>✉ No disponible</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
