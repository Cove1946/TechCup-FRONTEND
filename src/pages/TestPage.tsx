import React from 'react';
import { Button } from '@components/ui';

export const TestPage: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test de Componentes</h1>
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </div>
  );
};