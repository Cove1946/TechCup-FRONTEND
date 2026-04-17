import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  WelcomePage,
  LoginPage,
  RegisterPage,
  DashboardPage,
  ProfilePage,
  ArbitroProfilePage,
  AdminProfilePage,
  CoordinadorProfilePage,
  TeamsPage,
  CalendarPage,
  TournamentDetailPage,
  ResultadosPage,
  CreateTeamPage,
  PaymentPage,
  SearchPlayersPage,
  ArbitroPage,
  RolesPage,
  PaymentManagementPage,
  TournamentConfigPage,
  TorneosPage,
  EstadisticasPage,
  MyTeamPage,
  TablaPosicionesPage,
  LlavesPage,
  AlineacionPage,
  VSAlineacionPage,
} from '@pages';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Perfil por rol */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/arbitro" element={<ArbitroProfilePage />} />
        <Route path="/profile/admin" element={<AdminProfilePage />} />
        <Route path="/profile/coordinador" element={<CoordinadorProfilePage />} />

        {/* Mi Equipo */}
        <Route path="/my-team" element={<MyTeamPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/teams/create" element={<CreateTeamPage />} />
        <Route path="/teams/:id" element={<TournamentDetailPage />} />
        <Route path="/search-players" element={<SearchPlayersPage />} />
        <Route path="/payment" element={<PaymentPage />} />

        {/* Partidos */}
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/results" element={<ResultadosPage />} />
        <Route path="/tabla" element={<TablaPosicionesPage />} />
        <Route path="/estadisticas" element={<EstadisticasPage />} />
        <Route path="/llaves" element={<LlavesPage />} />
        <Route path="/alineacion/:matchId" element={<AlineacionPage />} />
        <Route path="/alineacion" element={<AlineacionPage />} />
        <Route path="/vs/alineacion" element={<VSAlineacionPage />} />

        {/* Torneos */}
        <Route path="/torneos" element={<TorneosPage />} />
        <Route path="/tournament/:id" element={<TournamentDetailPage />} />

        {/* Árbitro */}
        <Route path="/arbitro" element={<ArbitroPage />} />

        {/* Admin / Coordinador */}
        <Route path="/admin/roles" element={<RolesPage />} />
        <Route path="/organizer/payments" element={<PaymentManagementPage />} />
        <Route path="/organizer/config" element={<TournamentConfigPage />} />
        <Route path="/organizer/config/:id" element={<TournamentConfigPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
