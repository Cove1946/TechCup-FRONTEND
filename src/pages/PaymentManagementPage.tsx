import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './PaymentManagementPage.module.css';

type Filter = 'Todos' | 'Pendiente' | 'Aprobado' | 'Rechazado';
type EstadoPago = 'Pendiente' | 'Aprobado' | 'Rechazado';

interface Payment {
  jugador: string;
  equipo: string;
  monto: string;
  metodo: string;
  fecha: string;
  estado: EstadoPago;
}

const PAYMENTS: Payment[] = [
  { jugador: 'Carlos Pérez', equipo: 'FC KERNEL', monto: '$80.000', metodo: 'Transferencia', fecha: '28/2/2025', estado: 'Pendiente' },
  { jugador: 'Ricardo P.', equipo: 'FC KERNEL', monto: '$80.000', metodo: 'Nequi', fecha: '1/3/2025', estado: 'Pendiente' },
  { jugador: 'Juan García', equipo: 'FC KERNEL', monto: '$80.000', metodo: 'Daviplata', fecha: '1/3/2025', estado: 'Aprobado' },
  { jugador: 'Tomás H.', equipo: 'LOS DEBUGGERS', monto: '$80.000', metodo: 'Transferencia', fecha: '2/3/2025', estado: 'Pendiente' },
  { jugador: 'Diego Cano', equipo: 'LOS DEBUGGERS', monto: '$80.000', metodo: 'Nequi', fecha: '2/3/2025', estado: 'Rechazado' },
  { jugador: 'Felipe R.', equipo: 'NULL PTR FC', monto: '$80.000', metodo: 'Transferencia', fecha: '3/3/2025', estado: 'Aprobado' },
];

export const PaymentManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('Todos');
  const [search, setSearch] = useState('');
  const [payments, setPayments] = useState<Payment[]>(PAYMENTS);
  const [viewPayment, setViewPayment] = useState<Payment | null>(null);

  const updateEstado = (jugador: string, equipo: string, newEstado: EstadoPago) => {
    setPayments(prev => prev.map(p =>
      p.jugador === jugador && p.equipo === equipo ? { ...p, estado: newEstado } : p
    ));
  };

  const filtered = payments.filter(p => {
    const matchFilter = filter === 'Todos' || p.estado === filter;
    const matchSearch = p.jugador.toLowerCase().includes(search.toLowerCase()) ||
      p.equipo.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const pending = payments.filter(p => p.estado === 'Pendiente').length;
  const approved = payments.filter(p => p.estado === 'Aprobado').length;
  const rejected = payments.filter(p => p.estado === 'Rechazado').length;

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <h1 className={styles.title}>💳 Gestión de Pagos</h1>
        <p className={styles.sub}>RF18 — Validación de comprobantes de pago</p>

        {/* Stats row */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>⏳</span>
            <span className={styles.statNum + ' ' + styles.numOrange}>{pending}</span>
            <span className={styles.statLabel}>Pendientes</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>✅</span>
            <span className={styles.statNum + ' ' + styles.numGreen}>{approved}</span>
            <span className={styles.statLabel}>Aprobados</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>✗</span>
            <span className={styles.statNum + ' ' + styles.numRed}>{rejected}</span>
            <span className={styles.statLabel}>Rechazados</span>
          </div>
          <div className={styles.statCardGreen}>
            <span className={styles.statIconWhite}>💰</span>
            <span className={styles.totalNum}>$160.000</span>
            <span className={styles.totalLabel}>Total recaudado</span>
          </div>
        </div>

        {/* Search + filters */}
        <div className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIco}>🔍</span>
            <input
              className={styles.searchInput}
              placeholder="Buscar por jugador o equipo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.filters}>
            {(['Todos', 'Pendiente', 'Aprobado', 'Rechazado'] as Filter[]).map(f => (
              <button
                key={f}
                className={filter === f ? styles.filterActive : styles.filterBtn}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Jugador</th>
                <th>Equipo</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={i}>
                  <td className={styles.bold}>{p.jugador}</td>
                  <td>{p.equipo}</td>
                  <td className={styles.bold}>{p.monto}</td>
                  <td>{p.metodo}</td>
                  <td>{p.fecha}</td>
                  <td>
                    <span className={
                      p.estado === 'Pendiente' ? styles.badgePending :
                      p.estado === 'Aprobado' ? styles.badgeApproved :
                      styles.badgeRejected
                    }>
                      {p.estado === 'Pendiente' ? '⏳' : p.estado === 'Aprobado' ? '✅' : '✗'} {p.estado}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actRow}>
                      <button className={styles.actView} title="Ver comprobante" onClick={() => setViewPayment(p)}>👁</button>
                      {p.estado === 'Pendiente' && <>
                        <button className={styles.actApprove} title="Aprobar" onClick={() => updateEstado(p.jugador, p.equipo, 'Aprobado')}>✓</button>
                        <button className={styles.actReject} title="Rechazar" onClick={() => updateEstado(p.jugador, p.equipo, 'Rechazado')}>✗</button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment detail modal */}
        {viewPayment && (
          <div className={styles.modalOverlay} onClick={() => setViewPayment(null)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <span className={styles.modalTitle}>Detalle del comprobante</span>
                <button className={styles.modalClose} onClick={() => setViewPayment(null)}>✕</button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.modalRows}>
                  <div className={styles.modalRow}><span>Jugador</span><strong>{viewPayment.jugador}</strong></div>
                  <div className={styles.modalRow}><span>Equipo</span><strong>{viewPayment.equipo}</strong></div>
                  <div className={styles.modalRow}><span>Monto</span><strong>{viewPayment.monto}</strong></div>
                  <div className={styles.modalRow}><span>Método</span><strong>{viewPayment.metodo}</strong></div>
                  <div className={styles.modalRow}><span>Fecha</span><strong>{viewPayment.fecha}</strong></div>
                  <div className={styles.modalRow}><span>Estado</span>
                    <span className={
                      viewPayment.estado === 'Pendiente' ? styles.badgePending :
                      viewPayment.estado === 'Aprobado' ? styles.badgeApproved :
                      styles.badgeRejected
                    }>{viewPayment.estado}</span>
                  </div>
                </div>
                {viewPayment.estado === 'Pendiente' && (
                  <div className={styles.modalActions}>
                    <button className={styles.actApprove} onClick={() => { updateEstado(viewPayment.jugador, viewPayment.equipo, 'Aprobado'); setViewPayment(null); }}>✓ Aprobar</button>
                    <button className={styles.actReject} onClick={() => { updateEstado(viewPayment.jugador, viewPayment.equipo, 'Rechazado'); setViewPayment(null); }}>✗ Rechazar</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
