'use client';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AppNavbar from '../../components/Navbar';
import { Card, CardBody, CardTitle, Container } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './calendar.css';
import { useProyectoStore } from '../../data/proyectos'; // Ajusta esta ruta según tu estructura
import { useRouter } from 'next/navigation';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const MyCalendar = () => {
  const router = useRouter();
  const proyectos = useProyectoStore((state) => state.proyectos);

  const events = proyectos.flatMap((proyecto) =>
    proyecto.tareas.map((tarea) => {
      const [horaInicioHoras, horaInicioMinutos] = tarea.horaInicio.split(':');
      const [horaFinHoras, horaFinMinutos] = tarea.horaFin.split(':');

      const start = new Date(tarea.vencimiento);
      start.setHours(parseInt(horaInicioHoras), parseInt(horaInicioMinutos));

      const end = new Date(tarea.vencimiento);
      end.setHours(parseInt(horaFinHoras), parseInt(horaFinMinutos));

      return {
        title: `${proyecto.nombre} - ${tarea.nombre}`,
        start,
        end,
        completada: tarea.completada,
        proyectoId: proyecto.id, // Para redirección
      };
    })
  );

  const eventStyleGetter = (event) => {
    const backgroundColor = event.completada ? '#198754' : '#ffc107'; // verde o amarillo
    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        opacity: 0.9,
        color: '#000',
        border: 'none',
        padding: '5px',
      },
    };
  };

  const dayPropGetter = (date) => {
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      return {
        style: {
          backgroundColor: '#0b2d4f',
          color: '#ffffff',
          fontWeight: 'bold',
        },
      };
    }

    return {};
  };

  const handleSelectEvent = (event) => {
    router.push(`/proyecto/${event.proyectoId}`);
  };

  return (
    <>
      <div >
        <Container>
          <Card className="shadow-lg rounded-4 border-0 transparente text-light">
            <CardBody>
              <CardTitle tag="h4" className="mb-4 text-center">
                📅 Calendario de Tareas
              </CardTitle>
              <div className=" rounded overflow-hidden">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 600 }}
                  eventPropGetter={eventStyleGetter}
                  dayPropGetter={dayPropGetter}
                  onSelectEvent={handleSelectEvent}
                />
              </div>
            </CardBody>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default MyCalendar;
