import React, { useState, useEffect } from 'react';
import { MainLayout } from '@components/layout';
import { teamService } from '../api/teamService';
import styles from './SearchPlayersPage.module.css';

type PosShort = 'POR' | 'DEF' | 'MED' | 'DEL';

interface Player {
  id: number;
  userId: number;
  initials: string;
  color: string;
  name: string;
  pos: PosShort;
  posLabel: string;
  semestre: number | null;
  available: boolean;
}

const POS_MAP: Record<string, PosShort> = {
  PORTERO: 'POR', DEFENSA: 'DEF', MEDIOCAMPISTA: 'MED', DELANTERO: 'DEL',
};
const POS_LABEL: Record<string, string> = {
  PORTERO: 'Portero', DEFENSA: 'Defensa', MEDIOCAMPISTA: 'Mediocampista', DELANTERO: 'Delantero',
};
const AVATAR_COLORS = ['#16a34a','#2563eb','#d97706','#7c3aed','#dc2626','#0891b2','#db2777'];

function mapProfile(p: any): Player {
  const firstName: string = p.firstName ?? '';
  const lastName: string  = p.lastName ?? '';
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
  const color = AVATAR_COLORS[(p.userId ?? p.id ?? 0) % AVATAR_COLORS.length];
  const posKey: string = p.primaryPosition ?? '';
  return {
    id:       p.id,
    userId:   p.userId,
    initials,
    color,
    name:     `${firstName} ${lastName}`.trim() || 'Sin nombre',
    pos:      POS_MAP[posKey] ?? 'DEF',
    posLabel: POS_LABEL[posKey] ?? posKey,
    semestre: p.semester ?? null,
    available: p.available ?? false,
  };
}

const SORT_OPTIONS = ['Nombre', 'Posición', 'Semestre'];
const PAGE_SIZE = 6;

export const SearchPlayersPage: React.FC = () => {
  const userStr = localStorage.getItem('user');
  const userObj = userStr ? JSON.parse(userStr) : {};
  const captainId: number = userObj.userId ?? 0;
  const teamId: number    = userObj.teamId  ?? 0;

  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [search, setSearch]         = useState('');
  const [posFilter, setPosFilter]   = useState<PosShort[]>([]);
  const [sortBy, setSortBy]         = useState('Nombre');
  const [invited, setInvited]       = useState<Set<number>>(new Set());
  const [searchError, setSearchError] = useState('');
  const [page, setPage]             = useState(1);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await teamService.getAvailablePlayers();
        setAllPlayers((data as any[]).map(mapProfile));
      } catch {
        setError('No se pudieron cargar los jugadores disponibles');
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const togglePos = (p: PosShort) => {
    setPosFilter(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    setPage(1);
  };

  let filtered = allPlayers.filter(p => {
    if (posFilter.length > 0 && !posFilter.includes(p.pos)) return false;
    if (search.trim() && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'Nombre')   return a.name.localeCompare(b.name);
    if (sortBy === 'Posición') return a.pos.localeCompare(b.pos);
    if (sortBy === 'Semestre') return (a.semestre ?? 0) - (b.semestre ?? 0);
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
    setSearch(''); setPosFilter([]);
    setSearchError(''); setPage(1);
  };

  const handleInvite = (player: Player) => {
    if (invited.has(player.userId)) return;
    setInvited(prev => new Set([...prev, player.userId]));
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
                  const isInvited = invited.has(p.userId);
                  return (
                    <div key={p.id} className={styles.playerCard}>
                      <div className={styles.avatar} style={{ background: p.color }}>{p.initials}</div>
                      <p className={styles.playerName}>{p.name}</p>
                      <div className={styles.playerTags}>
                        <span className={styles.posTag}>{p.posLabel}</span>
                        {p.semestre != null && <span className={styles.infoTag}>Sem. {p.semestre}</span>}
                      </div>
                      <span className={`${styles.availBadge} ${p.available ? styles.availYes : styles.availNo}`}>
                        {p.available ? 'Disponible' : 'No disponible'}
                      </span>
                      {p.available ? (
                        <button className={`${styles.inviteBtn} ${isInvited ? styles.invitedBtn : ''}`}
                          onClick={() => handleInvite(p)}
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
