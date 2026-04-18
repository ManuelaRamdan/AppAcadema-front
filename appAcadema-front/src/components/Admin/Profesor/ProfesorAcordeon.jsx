import MateriaProfesorDetalle from "./MateriaProfesorDetalle";

export default function ProfesorAcordeon({ profesor, isOpen, onToggle }) {
    // console.log(curso);
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
                    <p className="text-color5 font-medium mb-4"><strong>ID:</strong> {profesor._id}</p>

                    {profesor.materiasDictadas && (
                        <div className="text-color5 font-medium mb-4">
                            <strong>Materias Dictadas ({profesor.materiasDictadas?.length || 0})</strong>
                            {profesor.materiasDictadas.length > 0 ? (
                                <ul className="list-disc ml-6 mt-2"> {/* Agregué un poco de margen y estilo de lista para que se vea mejor */}
                                    {profesor.materiasDictadas.map((materia) => (
                                        <MateriaProfesorDetalle
                                            materiaCurso={materia}
                                        />
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

