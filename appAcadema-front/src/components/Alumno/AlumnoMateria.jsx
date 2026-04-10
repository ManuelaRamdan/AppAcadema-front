import { useEffect, useState } from "react";


import AlumnoAcordeon from './AlumnoAcordeon';



export default function AlumnoMateria({ materiaSeleccionada, profesor }) {
    const [filtroAlumno, setFiltroAlumno] = useState("");
    const alumnosFiltrados = materiaSeleccionada.alumnos.filter((al) =>
        al.nombre.toLowerCase().includes(filtroAlumno.toLowerCase())
    );


    return (
        <div className="bg-white rounded-3xl shadow-custom p-8 border border-white">
            <header className="mb-6">
                <h1 className="text-4xl font-bold text-color5">{profesor.nombre}</h1>
                <h3 className="text-2xl font-bold text-color3 text-center mt-4 mb-6">
                    {materiaSeleccionada.nombreMateria} {materiaSeleccionada.nivel}{materiaSeleccionada.division} {materiaSeleccionada.anio}
                </h3>
            </header>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar alumno"
                    value={filtroAlumno}
                    onChange={(e) => setFiltroAlumno(e.target.value)}
                    className="w-full p-3 rounded-xl border border-color2 focus:ring-2 focus:ring-color3 outline-none transition-all shadow-soft text-color5 text-sm"

                />

            </div>
            <div className="space-y-4">
                {alumnosFiltrados.length > 0 ? (
                    alumnosFiltrados.map((alumno) => (
                        <AlumnoAcordeon
                            key={alumno._id}
                            alumno={alumno}
                            materiaSeleccionada={materiaSeleccionada}
                        />
                    ))

                ) : (
                    <p className="text-center py-10 text-gray-500 font-medium">No se encontró información del alumno.</p>
                )}
            </div>





        </div>

    );








}