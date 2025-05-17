'use client';
import React, { useState, useEffect } from 'react';
import { useProyectoStore } from '../../data/proyectos';

import { Card, CardBody, CardTitle, CardText, Badge, Container, Row, Col, Progress, Alert, Input, Label } from 'reactstrap';
import { format } from 'date-fns';
import { FaCheckCircle, FaRegClock } from 'react-icons/fa';
import AppNavbar from '../../components/Navbar';
import {
  agregarProyecto
} from '../../data/proyectos';

import './inicio.css';
import Link from 'next/link';

const porcentajeCompletado = (tareas) => {
  const tareasCompletadas = tareas.filter((tarea) => tarea.completada).length;
  return (tareasCompletadas / tareas.length) * 100;
};

const checkVencidas = (tareas) => {
  const hoy = new Date();
  return tareas.filter((tarea) => new Date(tarea.vencimiento) < hoy && !tarea.completada);
};

const IndexPage = () => {
  const misProyectos = useProyectoStore((state) => state.proyectos);
  const agregar = useProyectoStore((state) => state.agregarProyecto);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("fecha");
  const [proyectos, setproyectos] = useState(misProyectos);

  const filteredProyectos = proyectos.filter((proyecto) =>
    proyecto.nombre.toLowerCase().includes(search.toLowerCase()) ||
    proyecto.descripcion.toLowerCase().includes(search.toLowerCase()) ||
    proyecto.tareas.some((tarea) => tarea.nombre.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    setproyectos(misProyectos);
  }, [misProyectos]);

  const sortedProyectos = filteredProyectos.map((proyecto) => ({
    ...proyecto,
    tareas: proyecto.tareas.sort((a, b) => {
      if (sortBy === "fecha") {
        return new Date(a.vencimiento) - new Date(b.vencimiento);
      } else {
        return a.completada - b.completada;
      }
    }),
  }));

  const duplicarProyecto = (proyectoOriginal) => {
    const nuevoProyecto = {
      ...proyectoOriginal,
      id: Date.now(),
      nombre: `${proyectoOriginal.nombre} (Copia)`,
      tareas: proyectoOriginal.tareas.map((tarea) => ({
        ...tarea,
        id: Date.now() + Math.random(),
        completada: false,
      })),
    };
    agregar(nuevoProyecto);
  };

  return (
    <>
      <Container className="inicio-proyectos mt-4">
        <h1 className="mb-4">Resumen de Proyectos</h1>

        <Row>
          <Col md={6} sm={12} className="mb-3">
            <Label for="search">Buscar Proyecto o Tarea</Label>
            <Input
              type="text"
              id="search"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>

          <Col md={6} sm={12} className="mb-3">
            <Label for="sortBy">Ordenar por:</Label>
            <Input
              type="select"
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="fecha">Fecha de Vencimiento</option>
              <option value="estado">Estado de Tarea</option>
            </Input>
          </Col>
        </Row>

        <Row>
          {sortedProyectos.map((proyecto) => {
            const vencidas = checkVencidas(proyecto.tareas);
            return (
              <Col md={6} className="mb-4" key={proyecto.id}>
                <Link href={`/proyecto/${proyecto.id}`} className="text-decoration-none">
                  <Card className="proyecto-card">
                    <CardBody>
                      {vencidas.length > 0 && (
                        <Alert color="danger">
                          Hay tareas vencidas en este proyecto.
                        </Alert>
                      )}
                      <CardTitle tag="h5">{proyecto.nombre}</CardTitle>
                      <CardText>{proyecto.descripcion}</CardText>
                      <button
                        className="btn btn-outline-primary btn-sm mb-3"
                        onClick={(e) => {
                          e.preventDefault();
                          duplicarProyecto(proyecto);
                        }}
                      >
                        Duplicar Proyecto
                      </button>
                      <hr />
                      <h6>Tareas:</h6>
                      <Progress value={porcentajeCompletado(proyecto.tareas)} />
                      {proyecto.tareas.map((tarea) => (
                        <div key={tarea.id} className="d-flex justify-content-between align-items-center mb-2">
                          <span>
                            {tarea.completada ? (
                              <Badge color="success" pill><FaCheckCircle className="me-2" /> Completada</Badge>
                            ) : (
                              <Badge color="secondary" pill><FaRegClock className="me-2" /> En Progreso</Badge>
                            )}
                            {' '}{tarea.nombre}
                          </span>
                          <small>{format(new Date(tarea.vencimiento), 'dd/MM/yyyy')}</small>
                        </div>
                      ))}
                    </CardBody>
                  </Card>
                </Link>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default IndexPage;
