import { getAllAlumnos } from "../../../services/alumnoService";
import { useEffect, useState } from "react";

export default function UsuarioAcordeon({ usuario, isOpen, onToggle, guardarDni }) {
    const [alumnos, setAlumnos] = useState([]);

    const cargar = async (page) => {
        try {
            const res = await getAllAlumnos(page);
            setAlumnos(res.data.alumnos);
        } catch {
            setError("No se pudieron cargar los Alumnos");
        }
    }

    const listaDni = usuario.hijos.map((a) => a.dni);


    const alumnosFiltrados = alumnos.filter((a) => listaDni.includes(a.dni));

    const hijosUsuario = alumnosFiltrados.map((a) => ({ nombre: a.nombre, dni: a.dni }));


    useEffect(() => {
        cargar();
    }, [usuario.hijos]);


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
                        <p className="text-color5 font-medium mb-4 break-all"><strong>ID Profesor:</strong> <span> {usuario.profesorId}</span></p>
                    )}

                    {usuario.hijos && (
                        <div className="text-color5 font-medium mb-4">
                            <strong>DNI de Hijos Asociados:</strong>
                            {usuario.hijos.length > 0 ? (
                                <ul className="list-disc ml-6 mt-2">
                                    {hijosUsuario.map((h) => (
                                        <li key={h.dni} onClick={() => guardarDni(h.dni)}
                                        className="text-blue-500 underline cursor-pointer">{h.nombre} - {h.dni}</li>
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

