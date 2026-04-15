import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './PaymentManagementPage.module.css';

type EstadoPago = 'pendiente' | 'aprobado' | 'rechazado';

interface Payment {
  id: number;
  equipo: string;
  capitan: string;
  monto: string;
  fecha: string;
  metodo: string;
  estado: EstadoPago;
  comprobante: string;
}

const INITIAL_PAYMENTS: Payment[] = [
  { id: 1, equipo: 'FC KERNEL',      capitan: 'Carlos Pérez',    monto: '$500',  fecha: '10 Mar 2026', metodo: 'Transferencia', estado: 'pendiente',  comprobante: 'COMP-2026-001' },
  { id: 2, equipo: 'LOS DEBUGGERS',  capitan: 'Santiago Mora',   monto: '$500',  fecha: '11 Mar 2026', metodo: 'Efectivo',      estado: 'aprobado',   comprobante: 'COMP-2026-002' },
  { id: 3, equipo: 'STACK OVERFLOW', capitan: 'Andrés Tapia',    monto: '$500',  fecha: '12 Mar 2026', metodo: 'Transferencia', estado: 'pendiente',  comprobante: 'COMP-2026-003' },
  { id: 4, equipo: 'NULL POINTERS',  capitan: 'Luis Salas',      monto: '$500',  fecha: '9 Mar 2026',  metodo: 'Tarjeta',       estado: 'rechazado',  comprobante: 'COMP-2026-004' },
  { id: 5, equipo: 'BYTE FORCE',     capitan: 'Pablo Herrera',   monto: '$500',  fecha: '13 Mar 2026', metodo: 'Transferencia', estado: 'pendiente',  comprobante: 'COMP-2026-005' },
];

const ESTADO_LABELS: Record<EstadoPago, string> = { pendiente: 'Pendiente', aprobado: 'Aprobado', rechazado: 'Rechazado' };
const ESTADO_COLORS: Record<EstadoPago, string> = { pendiente: '#d97706', aprobado: '#15803d', rechazado: '#dc2626' };
const ESTADO_BG:    Record<EstadoPago, string> = { pendiente: '#fffbeb', aprobado: '#f0fdf4', rechazado: '#fef2f2' };

export const PaymentManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments]         = useState<Payment[]>(INITIAL_PAYMENTS);
  const [filterEstado, setFilterEstado] = useState<EstadoPago | 'todos'>('todos');
  const [viewPayment, setViewPayment]   = useState<Payment | null>(null);

  const filtered = filterEstado === 'todos' ? payments : payments.filter(p => p.estado === filterEstado);

  const updateEstado = (id: number, estado: EstadoPago) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, estado } : p));
    setViewPayment(prev => prev?.id === id ? { ...prev, estado } : prev);
  };

  const counts = {
    todos: payments.length,
    pendiente: payments.filter(p => p.estado === 'pendiente').length,
    aprobado:  payments.filter(p => p.estado === 'aprobado').length,
    rechazado: payments.filter(p => p.estado === 'rechazado').length,
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <p className={styles.subtitle}>Panel de administración</p>

        <div className={styles.titleRow}>
          <h1 className={styles.title}>Gestión de Pagos</h1>
        </div>

        <div className={styles.summaryBar}>
          {(['todos', 'pendiente', 'aprobado', 'rechazado'] as const).map(e => (
            <button key={e} className={`${styles.summaryBtn} ${filterEstado === e ? styles.summaryBtnActive : ''}`}
              onClick={() => setFilterEstado(e)}>
              <span className={styles.summaryCount}>{counts[e]}</span>
              <span className={styles.summaryLabel}>{e === 'todos' ? 'Todos' : ESTADO_LABELS[e]}</span>
            </button>
          ))}
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Capitán</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Método</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td><span className={styles.teamName}>{p.equipo}</span></td>
                  <td className={styles.captainCell}>{p.capitan}</td>
                  <td className={styles.montoCell}>{p.monto}</td>
                  <td className={styles.fechaCell}>{p.fecha}</td>
                  <td className={styles.metodCell}>{p.metodo}</td>
                  <td>
                    <span className={styles.estadoBadge} style={{ background: ESTADO_BG[p.estado], color: ESTADO_COLORS[p.estado] }}>
                      {ESTADO_LABELS[p.estado]}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.viewBtn} onClick={() => setViewPayment(p)}>Ver</button>
                      {p.estado === 'pendiente' && (
                        <>
                          <button className={styles.approveBtn} onClick={() => updateEstado(p.id, 'aprobado')}>✓</button>
                          <button className={styles.rejectBtn}  onClick={() => updateEstado(p.id, 'rechazado')}>✕</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className={styles.empty}>No hay pagos en esta categoría</div>}
        </div>

        {viewPayment && (
          <div className={styles.modalOverlay} onClick={() => setViewPayment(null)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Detalle de pago</h2>
                <button className={styles.closeBtn} onClick={() => setViewPayment(null)}>✕</button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.detailRow}><span className={styles.detailKey}>Equipo</span><span className={styles.detailVal}>{viewPayment.equipo}</span></div>
                <div className={styles.detailRow}><span className={styles.detailKey}>Capitán</span><span className={styles.detailVal}>{viewPayment.capitan}</span></div>
                <div className={styles.detailRow}><span className={styles.detailKey}>Monto</span><span className={styles.detailVal}>{viewPayment.monto}</span></div>
                <div className={styles.detailRow}><span className={styles.detailKey}>Fecha</span><span className={styles.detailVal}>{viewPayment.fecha}</span></div>
                <div className={styles.detailRow}><span className={styles.detailKey}>Método</span><span className={styles.detailVal}>{viewPayment.metodo}</span></div>
                <div className={styles.detailRow}><span className={styles.detailKey}>Comprobante</span><span className={styles.detailVal}>{viewPayment.comprobante}</span></div>
                <div className={styles.detailRow}>
                  <span className={styles.detailKey}>Estado</span>
                  <span className={styles.estadoBadge} style={{ background: ESTADO_BG[viewPayment.estado], color: ESTADO_COLORS[viewPayment.estado] }}>
                    {ESTADO_LABELS[viewPayment.estado]}
                  </span>
                </div>
              </div>
              {viewPayment.estado === 'pendiente' && (
                <div className={styles.modalActions}>
                  <button className={styles.modalApprove} onClick={() => updateEstado(viewPayment.id, 'aprobado')}>✓ Aprobar pago</button>
                  <button className={styles.modalReject}  onClick={() => updateEstado(viewPayment.id, 'rechazado')}>✕ Rechazar pago</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
