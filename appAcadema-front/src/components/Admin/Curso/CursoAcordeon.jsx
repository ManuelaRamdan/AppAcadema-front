

export default function CursoAcordeon({ curso, isOpen, onToggle }) {
   // console.log(curso);
    return (
        <div className="border-2 border-color2 rounded-2xl overflow-hidden shadow-soft">


            <div
                onClick={onToggle}
                className={`p-3 md:p-4 cursor-pointer transition-colors flex justify-between items-center ${isOpen ? "bg-color2" : "bg-color4 hover:bg-color2"}`}
            >
                <span className="font-bold text-color5">
                    {`${curso?.nombreMateria || 'Materia sin nombre'} - ${curso.nivel} ${curso.division} (${curso.anio})`}
                </span>
                <span className="text-color5">{isOpen ? '▲' : '▼'}</span>

            </div>

            {isOpen && (
                <div className="p-4 md:p-6 bg-white animate-fadeIn">

                    <p className="text-color5 font-medium mb-4 break-all"><strong>ID Curso:</strong> {curso._id}</p>
                    <p className="text-color5 font-medium mb-4"><strong>Profesor:</strong> {curso.profesor?.nombre || 'Sin asignar'}</p>
                    <p className="text-color5 font-medium mb-4 break-all"><strong>ID Profesor:</strong> {curso.profesor?.id}</p>
                    <p className="text-color5 font-medium mb-4"><strong>Nivel:</strong> {curso.nivel}</p>
                    <p className="text-color5 font-medium mb-4"><strong>Año:</strong> {curso.anio}</p>
                    
                    {curso.alumnos && (
                        <div className="text-color5 font-medium mb-4">
                            <strong>Alumnos</strong>
                            {curso.alumnos.length > 0 ? (
                                <ul className="list-disc ml-6 mt-2"> {/* Agregué un poco de margen y estilo de lista para que se vea mejor */}
                                    {curso.alumnos.map((alumno) => (
                                        <li key={alumno._id}>
                                        {alumno.nombre} (DNI: {alumno.dni})
                                    </li>
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

