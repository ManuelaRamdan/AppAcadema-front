import MateriaProfesorDetalle from "./MateriaProfesorDetalle";
import { useState, useEffect } from "react";

export default function ProfesorAcordeon({ profesor, isOpen, onToggle, idCurso }) {
    const [openedMateria, setOpenedMateria] = useState(null);

    useEffect(() => {
        if (idCurso) {
            setOpenedMateria(idCurso);

        }
    }, [idCurso]);

    return (
        <div className="border-2 border-color2 rounded-2xl overflow-hidden shadow-soft">


            <div
                onClick={onToggle}
                className={`p-3 md:p-4 cursor-pointer transition-colors flex justify-between items-center ${isOpen ? "bg-color2" : "bg-color4 hover:bg-color2"}`}
            >
                <span className="font-bold text-color5">
                    {profesor.nombre}
                </span>
                <span className="text-color5">{isOpen ? '▲' : '▼'}</span>

            </div>

            {isOpen && (
                <div className="p-4 md:p-6 bg-white animate-fadeIn">
                    <p className="text-color5 font-medium mb-4 break-all"><strong>ID:</strong> {profesor._id}</p>

                    {profesor.materiasDictadas && (
                        <div className="text-color5 font-medium mb-4">
                            <strong>Materias Dictadas ({profesor.materiasDictadas?.length || 0})</strong>
                            {profesor.materiasDictadas.length > 0 ? (
                                <div className="space-y-4 mt-3">
                                    {profesor.materiasDictadas.map((materia) => (
                                        <MateriaProfesorDetalle
                                            key={materia.idCurso}
                                            materiaCurso={materia}
                                            isOpen={openedMateria === materia.idCurso}
                                            onToggle={() => setOpenedMateria((prev) => prev === materia.idCurso ? null : materia.idCurso)}
                                        />
                                    ))}
                                </div>
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

