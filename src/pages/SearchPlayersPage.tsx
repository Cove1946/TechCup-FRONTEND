import React, { useState } from 'react';
import { MainLayout } from '@components/layout';
import styles from './SearchPlayersPage.module.css';

type Posicion = 'POR' | 'DEF' | 'MED' | 'DEL';
type Genero = 'All' | 'M' | 'F';

interface Player {
  id: number; initials: string; color: string;
  name: string; program: string;
  pos: Posicion; semestre: number; edad: number; genero: 'M' | 'F';
  available: boolean;
}

const PLAYERS: Player[] = [
  { id: 1,  initials: 'SM',  color: '#6366f1', name: 'Sofía Martínez',     program: 'Ingeniería de Sistemas',       pos: 'POR', semestre: 4, edad: 20, genero: 'F', available: true  },
  { id: 2,  initials: 'CRG', color: '#10b981', name: 'Cristian Guerrero',   program: 'Ingeniería de Sistemas',       pos: 'DEF', semestre: 5, edad: 20, genero: 'M', available: true  },
  { id: 3,  initials: 'JNT', color: '#f59e0b', name: 'Juan Tellez',         program: 'Ingeniería de Sistemas',       pos: 'DEF', semestre: 6, edad: 22, genero: 'M', available: false },
  { id: 4,  initials: 'DNP', color: '#06b6d4', name: 'Daniela Plazas',      program: 'Ing. en Ciberseguridad',       pos: 'POR', semestre: 2, edad: 18, genero: 'F', available: true  },
  { id: 5,  initials: 'LRS', color: '#a855f7', name: 'Laura Sanchez',       program: 'Ingeniería de Sistemas',       pos: 'DEF', semestre: 3, edad: 19, genero: 'F', available: false },
  { id: 6,  initials: 'ADC', color: '#f97316', name: 'Adrian Ducara',       program: 'Ingeniería de Sistemas',       pos: 'POR', semestre: 6, edad: 22, genero: 'M', available: true  },
  { id: 7,  initials: 'MJR', color: '#ec4899', name: 'María Jiménez',       program: 'Ing. Industrial',              pos: 'MED', semestre: 4, edad: 21, genero: 'F', available: true  },
  { id: 8,  initials: 'CPV', color: '#14b8a6', name: 'Carlos Pedraza',      program: 'Ingeniería de Sistemas',       pos: 'DEL', semestre: 5, edad: 21, genero: 'M', available: true  },
  { id: 9,  initials: 'ARL', color: '#8b5cf6', name: 'Andrés Rojas',        program: 'Ing. Electrónica',             pos: 'MED', semestre: 7, edad: 23, genero: 'M', available: false },
  { id: 10, initials: 'VSG', color: '#0ea5e9', name: 'Valentina Soto',      program: 'Ing. en Ciberseguridad',       pos: 'DEL', semestre: 3, edad: 19, genero: 'F', available: true  },
  { id: 11, initials: 'JMO', color: '#16a34a', name: 'Julián Moreno',       program: 'Ingeniería de Sistemas',       pos: 'DEF', semestre: 6, edad: 22, genero: 'M', available: true  },
  { id: 12, initials: 'KBT', color: '#dc2626', name: 'Karen Bautista',      program: 'Ing. Industrial',              pos: 'MED', semestre: 2, edad: 18, genero: 'F', available: true  },
];

const SORT_OPTIONS = ['Nombre', 'Posición', 'Semestre', 'Edad'];
const PAGE_SIZE = 6;

export const SearchPlayersPage: React.FC = () => {
  const [search, setSearch]         = useState('');
  const [posFilter, setPosFilter]   = useState<Posicion[]>([]);
  const [genero, setGenero]         = useState<Genero>('All');
  const [sortBy, setSortBy]         = useState('Nombre');
  const [invited, setInvited]       = useState<Set<number>>(new Set());
  const [searchError, setSearchError] = useState('');
  const [page, setPage]             = useState(1);

  const togglePos = (p: Posicion) => {
    setPosFilter(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    setPage(1);
  };

  let filtered = PLAYERS.filter(p => {
    if (posFilter.length > 0 && !posFilter.includes(p.pos)) return false;
    if (genero !== 'All' && p.genero !== genero) return false;
    if (search.trim() && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'Nombre')    return a.name.localeCompare(b.name);
    if (sortBy === 'Posición')  return a.pos.localeCompare(b.pos);
    if (sortBy === 'Semestre')  return a.semestre - b.semestre;
    if (sortBy === 'Edad')      return a.edad - b.edad;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page-1) * PAGE_SIZE, page * PAGE_SIZE);
  const available  = filtered.filter(p => p.available).length;

  const handleSearch = () => {
    setPage(1);
    if (search.trim() && !PLAYERS.some(p => p.name.toLowerCase().includes(search.toLowerCase()))) {
      setSearchError(`No se encontró "${search}"`);
    } else {
      setSearchError('');
    }
  };

  const handleClear = () => {
    setSearch(''); setPosFilter([]); setGenero('All');
    setSearchError(''); setPage(1);
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Buscar Jugadores</h1>
            <p className={styles.sub}>Encuentra al jugador ideal para tu equipo</p>
          </div>
          <span className={styles.badge}>2026-1 Activo</span>
        </div>

        <div className={styles.topBar}>
          <p className={styles.stats}>
            <strong>{filtered.length}</strong> jugadores encontrados &nbsp;·&nbsp; <strong>{available}</strong> disponibles
          </p>
          <div className={styles.sortRow}>
            <span className={styles.sortLabel}>ℹ️ Hasta 5 invitaciones por día</span>
            <div className={styles.sortSelect}>
              <span className={styles.sortText}>Ordenar:</span>
              <select className={styles.select} value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}>
                {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.layout}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <h3 className={styles.filterTitle}>Filtros</h3>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Nombre o ID</label>
              <input className={styles.filterInput} value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Buscar..." />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Posición</label>
              <div className={styles.checkGrid}>
                {(['POR', 'DEF', 'MED', 'DEL'] as Posicion[]).map(p => (
                  <label key={p} className={styles.checkLabel}>
                    <input type="checkbox" checked={posFilter.includes(p)} onChange={() => togglePos(p)} /> {p}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Género</label>
              <div className={styles.radioRow}>
                {(['All', 'M', 'F'] as Genero[]).map(g => (
                  <label key={g} className={styles.radioLabel}>
                    <input type="radio" name="genero" checked={genero === g} onChange={() => { setGenero(g); setPage(1); }} />
                    {g === 'All' ? 'Todos' : g === 'M' ? 'Masc.' : 'Fem.'}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filterActions}>
              <button className={styles.btnSearch} onClick={handleSearch}>Buscar</button>
              <button className={styles.btnClear} onClick={handleClear}>Limpiar</button>
            </div>
          </div>

          {/* Grid */}
          <div className={styles.main}>
            {searchError && <div className={styles.searchError}>✗ {searchError}</div>}

            {paginated.length === 0 ? (
              <div className={styles.emptyState}>No se encontraron jugadores con los filtros aplicados</div>
            ) : (
              <div className={styles.playersGrid}>
                {paginated.map(p => {
                  const isInvited = invited.has(p.id);
                  return (
                    <div key={p.id} className={styles.playerCard}>
                      <div className={styles.avatar} style={{ background: p.color }}>{p.initials}</div>
                      <p className={styles.playerName}>{p.name}</p>
                      <p className={styles.playerProgram}>{p.program}</p>
                      <div className={styles.playerTags}>
                        <span className={styles.posTag}>{p.pos}</span>
                        <span className={styles.infoTag}>Sem. {p.semestre}</span>
                        <span className={styles.infoTag}>{p.edad} años</span>
                        <span className={styles.infoTag}>{p.genero}</span>
                      </div>
                      <span className={`${styles.availBadge} ${p.available ? styles.availYes : styles.availNo}`}>
                        {p.available ? 'Disponible' : 'No disponible'}
                      </span>
                      {p.available ? (
                        <button className={`${styles.inviteBtn} ${isInvited ? styles.invitedBtn : ''}`}
                          onClick={() => !isInvited && setInvited(prev => new Set([...prev, p.id]))}
                          disabled={isInvited}>
                          ✉ {isInvited ? 'Invitación enviada' : 'Invitar al equipo'}
                        </button>
                      ) : (
                        <button className={styles.disabledBtn} disabled>✉ No disponible</button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button className={styles.pgBtn} onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>← Anterior</button>
                <div className={styles.pgNumbers}>
                  {Array.from({ length: totalPages }, (_, i) => i+1).map(n => (
                    <button key={n} className={`${styles.pgNum} ${n === page ? styles.pgActive : ''}`}
                      onClick={() => setPage(n)}>{n}</button>
                  ))}
                </div>
                <button className={styles.pgBtn} onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>Siguiente →</button>
              </div>
            )}

            <p className={styles.pageInfo}>
              Mostrando {(page-1)*PAGE_SIZE + 1}–{Math.min(page*PAGE_SIZE, filtered.length)} de {filtered.length} jugadores
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
