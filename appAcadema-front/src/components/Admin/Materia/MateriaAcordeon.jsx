

export default function MateriaAcordeon({materia, isOpen, onToggle}) {

    return (
        <div className="border-2 border-color2 rounded-2xl overflow-hidden shadow-soft">


            <div
                onClick={onToggle }
                className={`p-3 md:p-4 cursor-pointer transition-colors flex justify-between items-center ${isOpen ? "bg-color2" : "bg-color4 hover:bg-color2"}`}
            >
                <span className="font-bold text-color5">{materia.nombre}</span>
                <span className="text-color5">{isOpen ? '▲' : '▼'}</span>

            </div>

            {isOpen && (
                <div className="p-4 md:p-6 bg-white animate-fadeIn">

                    <p className="text-color5 font-medium mb-4"><strong>ID:</strong> {materia._id}</p>
                    <p className="text-color5 font-medium mb-4"><strong>Carga horaria:</strong> {materia.cargaHoraria}</p>
                    <p className="text-color5 font-medium mb-4"><strong>Contenidos:</strong> {materia.contenido}</p>
                    <p className="text-color5 font-medium mb-4"><strong>Nivel:</strong> {materia.nivel}</p>
                    <p className="text-color5 font-medium mb-4"><strong>Curso:</strong> {materia.curso.anio}° - División {materia.curso.division}</p>
                </div>


            )
            }


        </div>)
}

