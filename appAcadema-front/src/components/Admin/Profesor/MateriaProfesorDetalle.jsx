import { useState } from "react";

export default function MateriaProfesorDetalle({ materiaCurso }) {
    const [isOpen, setIsOpen] = useState(false);
    const [openAlumnoId, setOpenAlumnoId] = useState(null);
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
        <div className="border-2 border-color2 rounded-2xl overflow-hidden shadow-soft">


            <div
                onClick={() => setIsOpen((prev) => !prev)}
                className={`p-3 md:p-4 cursor-pointer transition-colors flex justify-between items-center ${isOpen ? "bg-color2" : "bg-color4 hover:bg-color2"}`}
            >
                <span className="font-bold text-color5">
                    {materiaCurso.nombreMateria}
                </span>
                <span className="text-color5">{isOpen ? '▲' : '▼'}</span>

            </div>

            {isOpen && (
                <div className="p-4 md:p-6 bg-white animate-fadeIn">
                    <p className="text-color5 font-medium mb-4"><strong>ID:</strong> {materiaCurso._id}</p>

                    {materiaCurso.alumnos && (
                        <div className="text-color5 font-medium mb-4">
                            <strong>Alumnos</strong>
                            {materiaCurso.alumnos.length > 0 ? (
                                <ul className="list-disc ml-6 mt-2">
                                    {materiaCurso.alumnos.map((alumno) => (

                                        <div key={alumno.dni}>

                                            <div onClick={() => setOpenAlumnoId((prev) => prev === alumno.dni ? null : alumno.dni)}
                                                className={`p-3 md:p-4 cursor-pointer transition-colors flex justify-between items-center ${isOpen ? "bg-color2" : "bg-color4 hover:bg-color2"
                                                    }`}
                                            >
                                                <h3 className="text-base md:text-lg font-bold text-color5"> {alumno.nombre}</h3>
                                                <span>{openAlumnoId === alumno.dni ? '▲' : '▼'}</span>
                                            </div>

                                            {openAlumnoId === alumno.dni && (
                                                <div className="p-6 bg-white animate-fadeIn">

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
                                                                    {alumno.notas.map(n => (
                                                                        <tr key={n._id} className="hover:bg-slate-50 transition-colors">
                                                                            <td className="p-2 text-gray-600 italic">{n.tipo}</td>
                                                                            <td className="p-2 font-bold text-color5">{n.nota}</td> {/* Quitamos pr-10 y text-right */}
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>

                                                    {/* Tabla de Asistencias */}
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
                                                                    {alumno.asistencias.map(a => (
                                                                        <tr key={a._id} className="hover:bg-slate-50 transition-colors">
                                                                            <td className="p-2 text-gray-600">{getFixedDateDisplay(a.fecha)}</td>
                                                                            <td className="p-2 font-medium text-color5">{a.presente}</td> {/* Quitamos pr-10 y text-right */}
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center py-10 text-gray-500 font-medium">Ningún alumno asociado</p>
                            )}
                        </div>
                    )}
                </div>


            )
            }


        </div>)
}