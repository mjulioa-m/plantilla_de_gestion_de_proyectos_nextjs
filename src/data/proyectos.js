import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProyectoStore = create(persist(
  (set, get) => ({
    proyectos: [
      {
        id: 1,
        nombre: 'Sitio Web Corporativo',
        descripcion: 'Rediseño del sitio web de la empresa',
        tareas: [
          { id: 1, nombre: 'Diseño UI', completada: true, vencimiento: '2025-05-15',horaInicio: '09:00', horaFin: '10:00' },
          { id: 2, nombre: 'Integración con CMS', completada: false, vencimiento: '2025-05-20',horaInicio: '09:00', horaFin: '10:00' },
        ],
      },
      {
        id: 2,
        nombre: 'App Móvil de Pedidos',
        descripcion: 'Desarrollo de la app de pedidos para clientes',
        tareas: [
          { id: 3, nombre: 'Login con Google', completada: false, vencimiento: '2025-05-18',horaInicio: '09:00', horaFin: '10:00' },
          { id: 4, nombre: 'Chat en tiempo real', completada: false, vencimiento: '2025-05-25',horaInicio: '09:00', horaFin: '10:00' },
        ],
      },
    ],
    obtenerProyecto: (id) => get().proyectos.find((p) => p.id === parseInt(id)),
    agregarProyecto: (nuevo) =>
      set((state) => ({ proyectos: [...state.proyectos, nuevo] })),
    actualizarProyecto: (id, datos) =>
      set((state) => ({
        proyectos: state.proyectos.map((p) =>
          p.id === id ? { ...p, ...datos } : p
        ),
      })),
    eliminarProyecto: (id) =>
      set((state) => ({
        proyectos: state.proyectos.filter((p) => p.id !== id),
      })),
  }),
  {
    name: 'proyecto-storage', // nombre en localStorage
  }
));
