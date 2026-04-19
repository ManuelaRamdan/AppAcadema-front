import React, { useState } from 'react';

export default function AlumnoInfo({ alumno }) {
    const [filtroMateria, setFiltroMateria] = useState("");
    const [abierto, setAbierto] = useState(null);

    const materiasFiltradas = alumno.materias?.filter(
        m => `${m.nombreCurso} - ${m.nivel} ${m.division}${m.anio}`
            .toLowerCase()
            .includes(filtroMateria.toLowerCase())
    ) || [];

    const getFixedDateDisplay = (isoDate) => {

        let result = "";

        if (isoDate) {

            const date = new Date(isoDate);
            const year = date.getUTCFullYear();
            const month = date.getUTCMonth() + 1;
            const day = date.getUTCDate();

            result = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
        };


        return result;


    };


    return (
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-custom p-4 md:p-8 border border-white">
            <header className="mb-6">
                <h1 className="text-2xl md:text-4xl break-words font-bold text-color5 uppercase">{alumno.nombre}</h1>
                <p className="text-color5 font-medium">DNI: {alumno.dni}</p>
            </header>




            <section>

                <h2 className="text-2xl font-bold text-color3 text-center mb-6">Materias</h2>

                <div className="mb-6">

                    <input
                        type="text"
                        placeholder="Buscar materia"
                        value={filtroMateria}
                        onChange={(e) => setFiltroMateria(e.target.value)}
                        className="w-full p-3 rounded-xl border border-color2 focus:ring-2 focus:ring-color3 outline-none transition-all shadow-soft"
                    />
                </div>


                <div className="space-y-4">

                    {materiasFiltradas.length === 0 && (
                        <p className="text-center py-10 text-gray-500 font-medium">No se encontraron materias.</p>
                    )}

                    {materiasFiltradas.map((mat, index) => {

                        const isOpen = abierto === index;

                        return (
                            <div key={mat._id} className="border-2 border-color2 rounded-2xl overflow-hidden shadow-soft">
                                <div onClick={() => setAbierto(isOpen ? null : index)}
                                    className={`p-3 md:p-4 cursor-pointer transition-colors flex justify-between items-center ${isOpen ? "bg-color2" : "bg-color4 hover:bg-color2"
                                        }`}
                                >
                                    <h3 className="text-base md:text-lg font-bold text-color5">{mat.nombreCurso} - {mat.nivel} {mat.division} {mat.anio}</h3>
                                    <span>{isOpen ? '▲' : '▼'}</span>
                                </div>

                                {isOpen && (
                                    <div className="p-6 bg-white animate-fadeIn">
                                        <div className="mb-4">
                                            <h4 className="font-bold text-color5 text-lg">Profesor</h4>
                                            <p className="text-gray-700">{mat.profesor?.nombre || "No asignado"}</p>
                                        </div>

                                        <div className="mb-6">
                                            <h4 className="font-bold text-color5 mb-2">Notas</h4>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-center rounded-lg overflow-hidden border-collapse min-w-[250px]"> {/* Cambio a text-center */}
                                                    <thead className="bg-color3 text-white">
                                                        <tr>
                                                            <th className="p-2 font-semibold">Tipo</th>
                                                            <th className="p-2 font-semibold">Nota</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {mat.notas.map(n => (
                                                            <tr key={n._id} className="hover:bg-slate-50 transition-colors">
                                                                <td className="p-2 text-gray-600 italic">{n.tipo}</td>
                                                                <td className="p-2 font-bold text-color5">{n.nota}</td> 
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-color5 mb-2">Asistencias</h4>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-center rounded-lg overflow-hidden border-collapse min-w-[250px]"> {/* Cambio a text-center */}
                                                    <thead className="bg-color3 text-white">
                                                        <tr>
                                                            <th className="p-2 font-semibold">Fecha</th>
                                                            <th className="p-2 font-semibold">Presente</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {mat.asistencias.map(a => (
                                                            <tr key={a._id} className="hover:bg-slate-50 transition-colors">
                                                                <td className="p-2 text-gray-600">{getFixedDateDisplay(a.fecha)}</td>
                                                                <td className="p-2 font-medium text-color5">{a.presente}</td> 
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                </div>




            </section >




        </div >
    );
}