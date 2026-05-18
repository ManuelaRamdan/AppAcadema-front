import { useEffect, useState } from "react";


import AlumnoAcordeon from './AlumnoAcordeon';



export default function AlumnoMateria({ materiaSeleccionada, profesor }) {
    const [filtroAlumno, setFiltroAlumno] = useState("");
    const [filtroOrdenar, setFiltroOrdenar] = useState("");

    const alumnosFiltrados = materiaSeleccionada.alumnos.filter((al) =>
        al.nombre.toLowerCase().includes(filtroAlumno.toLowerCase())

    ).sort((a, b) => {
        let tipoOrd = 0;
        if (filtroOrdenar === 'asc') {
            tipoOrd = a.nombre.localeCompare(b.nombre);
        } else if (filtroOrdenar === 'desc') {
            tipoOrd = b.nombre.localeCompare(a.nombre)
        }
        return tipoOrd; 
    })



    return (
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-custom p-4 md:p-8 border border-white">
            <header className="mb-6">
                <h1 className="text-2xl md:text-4xl font-bold text-color5 text-center md:text-left break-words">{profesor.nombre}</h1>
                <h3 className="text-2xl font-bold text-color3 text-center mb-6">
                    {materiaSeleccionada.nombreMateria} {materiaSeleccionada.nivel}{materiaSeleccionada.division} {materiaSeleccionada.anio}
                </h3>
            </header>
            <div className="mb-6">
                <select
                    value={filtroOrdenar}
                    onChange={(e) => setFiltroOrdenar(e.target.value)}
                    className="w-full p-3 rounded-xl border border-color2 focus:ring-2 focus:ring-color3 outline-none transition-all shadow-soft"
                >
                    <option value="">Todas los alumnos</option>
                    <option value="asc">a-z</option>
                    <option value="desc">z-a</option>

                </select>
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