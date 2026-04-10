import { useEffect, useState } from "react";


import AlumnoAcordeon from './AlumnoAcordeon';
import './alumnoAcordeon.css';



export default function AlumnoMateria({ materiaSeleccionada, profesor }) {
    const [filtroAlumno, setFiltroAlumno] = useState("");
    const alumnosFiltrados = materiaSeleccionada.alumnos.filter((al) =>
        al.nombre.toLowerCase().includes(filtroAlumno.toLowerCase())
    );


    return (
        <div className="border rounded-xl mb-4 bg-white shadow-sm">
            <div >
                <h1>{profesor.nombre}</h1>
                <h3 >
                    {materiaSeleccionada.nombreMateria} {materiaSeleccionada.nivel}{materiaSeleccionada.division} {materiaSeleccionada.anio}
                </h3>
                <input
                    type="text"
                    placeholder="Buscar alumno"
                    value={filtroAlumno}
                    onChange={(e) => setFiltroAlumno(e.target.value)}
                    className="w-full p-3 rounded-xl border border-color2 focus:ring-2 focus:ring-color3 outline-none transition-all shadow-soft text-color5 text-sm"
                />  
                
            </div>

            { alumnosFiltrados.length > 0 ? (
                alumnosFiltrados.map((alumno) => (
                    <AlumnoAcordeon
                        key={alumno._id}
                        alumno={alumno}
                        materiaSeleccionada={materiaSeleccionada}
                    />
                ))
            
            ) : (
                <p className="text-color5">No se encontró información del alumno.</p>
            )}
            


          

        </div>

    );








}