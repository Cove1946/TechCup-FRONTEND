import React, { useState } from 'react';
import { MainLayout } from '@components/layout';
import { Card, Input, Button } from '@components/ui';
import styles from './ProfilePage.module.css';

export const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Juan Pérez',
    email: 'juan.perez@eci.edu.co',
    phone: '+57 300 123 4567',
    position: 'Delantero',
    jerseyNumber: '10',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para guardar
    setIsEditing(false);
  };

  return (
    <MainLayout>
      <div className={styles.profile}>
        <h1 className={styles.title}>Mi Perfil</h1>

        <Card>
          <div className={styles.avatarSection}>
            <div className={styles.avatarPlaceholder}>
              {formData.name.charAt(0).toUpperCase()}
            </div>
            <div className={styles.avatarInfo}>
              <h2>{formData.name}</h2>
              <p>{formData.position} • #{formData.jerseyNumber}</p>
            </div>
          </div>
        </Card>

        <Card>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className={styles.formTitle}>Información Personal</h3>

            <Input
              label="Nombre Completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              fullWidth
            />

            <Input
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              fullWidth
            />

            <Input
              label="Teléfono"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              fullWidth
            />

            <div className={styles.row}>
              <Input
                label="Posición"
                name="position"
                value={formData.position}
                onChange={handleChange}
                disabled={!isEditing}
                fullWidth
              />

              <Input
                label="Número de Camiseta"
                name="jerseyNumber"
                value={formData.jerseyNumber}
                onChange={handleChange}
                disabled={!isEditing}
                fullWidth
              />
            </div>

            <div className={styles.actions}>
              {!isEditing ? (
                <Button type="button" onClick={() => setIsEditing(true)} variant="primary">
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button type="submit" variant="primary">
                    Guardar Cambios
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};