'use client';
import React, { useState, useEffect } from 'react';
import { useProyectoStore } from '../../../data/proyectos';
import {
  Card, CardBody, CardTitle, CardText,
  Badge, Container, Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Input, Label,Alert
} from 'reactstrap';
import { format } from 'date-fns';
import { FaCheckCircle, FaRegClock } from 'react-icons/fa';
import AppNavbar from '../../../components/Navbar';
import {
  obtenerProyectos,
  agregarProyecto,
  actualizarProyecto,
  eliminarProyecto,
  obtenerProyecto
} from '../../../data/proyectos';
import './proyecto.css';
import '../../../styles/custom.css';
import { use } from 'react';

const ProyectoDetalle = ({ params: paramsPromise }) => {
  const params = use(paramsPromise);
  const { id } = params;
  const misProyectos = useProyectoStore((state) => state.proyectos);
  const agregar = useProyectoStore((state) => state.agregarProyecto);
  const buscarproyecto = useProyectoStore((state) => state.obtenerProyecto);
  const actualizarproyect = useProyectoStore((state) => state.actualizarProyecto);

  const [proyecto, setproyecto] = useState(misProyectos.find((p) => p.id === parseInt(id)));
  const [editandoTarea, setEditandoTarea] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalEditarProyecto, setModalEditarProyecto] = useState(false);
  const [vencidad, setvencidas] = useState([]);

  const obtenerFechaHoy = () => new Date().toISOString().split('T')[0];

  const [nuevaTarea, setNuevaTarea] = useState({
    nombre: '',
    vencimiento: obtenerFechaHoy(),
    horaInicio: '08:00',
    horaFin: '09:00',
  });

  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');

  useEffect(() => {
    const p = buscarproyecto(id);
    setproyecto(p);
    setNuevoNombre(p?.nombre || '');
    setNuevaDescripcion(p?.descripcion || '');
  }, []);

  useEffect(() => {
    checkVencidas(proyecto.tareas);

  }, [proyecto]);
  const toggleModal = () => {
    setModal(!modal);
    setEditandoTarea(null);
    setNuevaTarea({
      nombre: '',
      vencimiento: obtenerFechaHoy(),
      horaInicio: '08:00',
      horaFin: '09:00',
    });
  };

  const toggleModalEditarProyecto = () => {
    setModalEditarProyecto(!modalEditarProyecto);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaTarea((prev) => ({ ...prev, [name]: value }));
  };

  const abrirEditar = (tarea) => {
    setNuevaTarea({
      nombre: tarea.nombre,
      vencimiento: tarea.vencimiento,
      horaInicio: tarea.horaInicio || '08:00',
      horaFin: tarea.horaFin || '09:00',
    });
    setEditandoTarea(tarea);
    setModal(true);
  };

  const agregarOEditarTarea = (e) => {
    e.preventDefault();
    if (!nuevaTarea.nombre || !nuevaTarea.vencimiento) return;

    let nuevasTareas;
    if (editandoTarea) {
      nuevasTareas = proyecto.tareas.map((t) =>
        t.id === editandoTarea.id ? { ...t, ...nuevaTarea } : t
      );
    } else {
      const nueva = {
        id: Date.now(),
        nombre: nuevaTarea.nombre,
        vencimiento: nuevaTarea.vencimiento,
        horaInicio: nuevaTarea.horaInicio,
        horaFin: nuevaTarea.horaFin,
        completada: false,
      };
      nuevasTareas = [...proyecto.tareas, nueva];
    }

    const proyectoActualizado = { ...proyecto, tareas: nuevasTareas };
    actualizarproyect(proyecto.id, proyectoActualizado);
    setproyecto(buscarproyecto(proyecto.id));
    toggleModal();
  };
  const checkVencidas = (tareas) => {
    const hoy = new Date();
    var ven = tareas.filter((tarea) => new Date(tarea.vencimiento) < hoy && !tarea.completada);
    setvencidas(ven);
  };
  const marcarComoCompletada = (idTarea) => {
    const tareasActualizadas = proyecto.tareas.map((t) =>
      t.id === idTarea ? { ...t, completada: !t.completada } : t
    );
    actualizarproyect(proyecto.id, { ...proyecto, tareas: tareasActualizadas });
    setproyecto({ ...proyecto, tareas: tareasActualizadas });
  };

  const guardarCambiosProyecto = () => {
    const proyectoActualizado = {
      ...proyecto,
      nombre: nuevoNombre,
      descripcion: nuevaDescripcion,
    };
    actualizarproyect(proyecto.id, proyectoActualizado);
    setproyecto(proyectoActualizado);
    toggleModalEditarProyecto();
  };

  if (!proyecto) {
    return (
      <Container className="mt-5">
        <p>Proyecto no encontrado.</p>
      </Container>
    );
  }

  return (
    <>
      <AppNavbar />
      <Container className="mt-4">
        <Button href="/" className="mb-4">← Volver</Button>

        <Card className='no-hover-card'>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <CardTitle style={{ color: 'white' }} tag="h3">{proyecto.nombre}</CardTitle>
              <div>
                <Button color="secondary" className="me-2" onClick={toggleModalEditarProyecto}>Editar Proyecto</Button>
                <Button color="primary" onClick={toggleModal}>+ Agregar Tarea</Button>
              </div>
            </div>
            {vencidad.length > 0 && (
              <Alert color="danger">
                Hay tareas vencidas en este proyecto.
              </Alert>
            )}
            <CardText style={{ color: 'white' }} className="mb-3">{proyecto.descripcion}</CardText>

            <h5 style={{ color: 'white' }}>Tareas</h5>
            <ul className="list-unstyled">
              {proyecto.tareas.map((tarea) => (
                <li key={tarea.id} className="mb-2 d-flex justify-content-between align-items-center">
                  <div style={{ color: 'white', flex: 1 }}>
                    {tarea.completada ? (
                      <Badge color="success" pill><FaCheckCircle className="me-2" />Completada</Badge>
                    ) : (
                      <Badge color="warning" pill><FaRegClock className="me-2" />En Progreso</Badge>
                    )}
                    {' '}
                    {tarea.nombre}
                  </div>
                  <small style={{ color: 'white', marginRight: '10px' }}>
                    {format(new Date(tarea.vencimiento), 'dd/MM/yyyy')} - {tarea.horaInicio}
                  </small>
                  <Button color="success" size="sm" onClick={() => marcarComoCompletada(tarea.id)} className="me-2">
                    {tarea.completada ? 'Deshacer' : 'Completar'}
                  </Button>
                  <Button color="secondary" size="sm" onClick={() => abrirEditar(tarea)}>Editar</Button>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </Container>

      {/* Modal Tarea */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {editandoTarea ? 'Editar Tarea' : 'Agregar Nueva Tarea'}
        </ModalHeader>
        <Form onSubmit={agregarOEditarTarea}>
          <ModalBody>
            <FormGroup>
              <Label for="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" value={nuevaTarea.nombre} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="vencimiento">Fecha de vencimiento</Label>
              <Input type="date" id="vencimiento" name="vencimiento" value={nuevaTarea.vencimiento} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="horaInicio">Hora de inicio</Label>
              <Input type="time" id="horaInicio" name="horaInicio" value={nuevaTarea.horaInicio} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="horaFin">Hora de fin</Label>
              <Input type="time" id="horaFin" name="horaFin" value={nuevaTarea.horaFin} onChange={handleInputChange} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="primary">{editandoTarea ? 'Guardar' : 'Agregar'}</Button>
            <Button color="secondary" onClick={toggleModal}>Cancelar</Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* Modal Editar Proyecto */}
      <Modal isOpen={modalEditarProyecto} toggle={toggleModalEditarProyecto}>
        <ModalHeader toggle={toggleModalEditarProyecto}>Editar Proyecto</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="nuevoNombre">Nombre del Proyecto</Label>
            <Input id="nuevoNombre" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label for="nuevaDescripcion">Descripción</Label>
            <Input id="nuevaDescripcion" type="textarea" value={nuevaDescripcion} onChange={(e) => setNuevaDescripcion(e.target.value)} />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={guardarCambiosProyecto}>Guardar</Button>
          <Button color="secondary" onClick={toggleModalEditarProyecto}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ProyectoDetalle;
