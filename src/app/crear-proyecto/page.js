'use client';
import React, { useState } from 'react';
import { useProyectoStore } from '../../data/proyectos';
import {
  Container, Button,
  Form, FormGroup, Input, Label,
  Card, CardBody, CardTitle
} from 'reactstrap';
import AppNavbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';
import './crearProyecto.css';

const CrearProyecto = () => {
  const agregarProyecto = useProyectoStore((state) => state.agregarProyecto);
  const router = useRouter();

  const [proyecto, setProyecto] = useState({
    nombre: '',
    descripcion: '',
    tareas: [], // vacío al crear
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProyecto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!proyecto.nombre.trim()) {
      alert('El nombre del proyecto es obligatorio');
      return;
    }

    // Crear proyecto con id único (timestamp)
    const nuevoProyecto = {
      ...proyecto,
      id: Date.now(),
    };

    agregarProyecto(nuevoProyecto);

    // Redirigir a lista o detalle, ajusta según tu ruta
    router.push('/');
  };

  return (
     <div style={{ backgroundColor: 'transparent' }}>
      <Container className="mt-4" style={{ maxWidth: '600px' }}>
        <Card>
          <CardBody>
            <CardTitle tag="h3" className="mb-4">Crear Nuevo Proyecto</CardTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Nombre del proyecto"
                  value={proyecto.nombre}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  name="descripcion"
                  type="textarea"
                  placeholder="Descripción del proyecto"
                  value={proyecto.descripcion}
                  onChange={handleChange}
                />
              </FormGroup>
              <Button color="primary" className="btn btn-outline-primary btn-sm mb-3" style={{color:'white'}} type="submit">Crear Proyecto</Button>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default CrearProyecto;
