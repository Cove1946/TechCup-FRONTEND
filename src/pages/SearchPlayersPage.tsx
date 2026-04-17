import React, { useState, useEffect } from 'react';
import { MainLayout } from '@components/layout';
import { teamService } from '../api/teamService';
import styles from './SearchPlayersPage.module.css';

type Posicion = 'POR' | 'DEF' | 'MED' | 'DEL';
type Genero = 'All' | 'M' | 'F';

interface Player {
  id: number; initials: string; color: string;
  name: string; program: string;
  pos: Posicion; semestre: number; edad: number; genero: 'M' | 'F';
  available: boolean;
}

const SORT_OPTIONS = ['Nombre', 'Posición', 'Semestre', 'Edad'];
const PAGE_SIZE = 6;

// TODO: backend endpoint needed – obtain current user's teamId to pass to invitePlayer
const MY_TEAM_ID = 1;

export const SearchPlayersPage: React.FC = () => {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const [search, setSearch]         = useState('');
  const [posFilter, setPosFilter]   = useState<Posicion[]>([]);
  const [genero, setGenero]         = useState<Genero>('All');
  const [sortBy, setSortBy]         = useState('Nombre');
  const [invited, setInvited]       = useState<Set<number>>(new Set());
  const [searchError, setSearchError] = useState('');
  const [page, setPage]             = useState(1);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await teamService.getAvailablePlayers();
        setAllPlayers(data);
      } catch {
        setError('No se pudieron cargar los jugadores disponibles');
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const togglePos = (p: Posicion) => {
    setPosFilter(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    setPage(1);
  };

  // Client-side filtering applied to data received from backend
  let filtered = allPlayers.filter(p => {
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
    if (search.trim() && !allPlayers.some(p => p.name.toLowerCase().includes(search.toLowerCase()))) {
      setSearchError(`No se encontró "${search}"`);
    } else {
      setSearchError('');
    }
  };

  const handleClear = () => {
    setSearch(''); setPosFilter([]); setGenero('All');
    setSearchError(''); setPage(1);
  };

  const handleInvite = async (playerId: number) => {
    if (invited.has(playerId)) return;
    try {
      await teamService.invitePlayer(MY_TEAM_ID, { playerId });
      setInvited(prev => new Set([...prev, playerId]));
    } catch {
      // Invitation failed; do not mark as invited
    }
  };

  if (loading) return <MainLayout><div className={styles.page}>Cargando jugadores...</div></MainLayout>;
  if (error) return <MainLayout><div className={styles.page}>{error}</div></MainLayout>;

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
                          onClick={() => handleInvite(p.id)}
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
