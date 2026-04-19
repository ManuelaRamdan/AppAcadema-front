

export default function UsuarioAcordeon({ usuario, isOpen, onToggle }) {

    return (
        <div className="border-2 border-color2 rounded-2xl overflow-hidden shadow-soft">


            <div
                onClick={onToggle}
                className={`p-3 md:p-4 cursor-pointer transition-colors flex justify-between items-center ${isOpen ? "bg-color2" : "bg-color4 hover:bg-color2"}`}
            >
                <span className="font-bold text-color5">{usuario.nombre}</span>
                <span className="text-color5">{isOpen ? '▲' : '▼'}</span>

            </div>

            {isOpen && (
                <div className="p-4 md:p-6 bg-white animate-fadeIn">

                    <p className="text-color5 font-medium mb-4 break-all"><strong>ID usuario:</strong> {usuario._id}</p>
                    <p className="text-color5 font-medium mb-4 break-words"><strong>Email:</strong> {usuario.email}</p>
                    <p className="text-color5 font-medium mb-4"><strong>Rol:</strong> {usuario.rol}</p>
                    {usuario.profesorId && (
                        <p  className="text-color5 font-medium mb-4 break-all"><strong>ID Profesor:</strong> <span> {usuario.profesorId}</span></p>
                    )}

                    {usuario.hijos && (
                        <div className="text-color5 font-medium mb-4">
                            <strong>DNI de Hijos Asociados:</strong>
                            {usuario.hijos.length > 0 ? (
                                <ul className="list-disc ml-6 mt-2"> {/* Agregué un poco de margen y estilo de lista para que se vea mejor */}
                                    {usuario.hijos.map((h) => (
                                        <li key={h.dni}>{h.dni}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center py-10 text-gray-500 font-medium">Ningún hijo asociado</p>
                            )}
                        </div>
                    )}
                </div>


            )
            }


        </div>)
}

