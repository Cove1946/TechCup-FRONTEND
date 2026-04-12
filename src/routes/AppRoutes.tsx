import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  WelcomePage,
  LoginPage,
  RegisterPage,
  DashboardPage,
  ProfilePage,
  TeamsPage,
  CalendarPage,
  TournamentDetailPage,
} from '@pages';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/teams/:id" element={<TournamentDetailPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/tournament/:id" element={<TournamentDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};