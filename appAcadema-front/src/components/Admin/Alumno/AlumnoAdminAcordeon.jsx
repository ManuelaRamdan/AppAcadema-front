import { useEffect, useState } from "react";

import { FaEdit, FaTrashAlt } from "react-icons/fa";

import MateriaAcordeon from "./MateriaAlumnoAcordeon";
import { updateAlumno, deleteAlumno } from "./../../../services/alumnoService";

export default function AlumnoAdminAcordeon({ alumno, isOpen, onToggle, onEliminar }) {
    const [editMode, setEditMode] = useState(false);
    const [nombre, setNombre] = useState("");
    const [dni, setDni] = useState("");
    const [confirmarEliminar, setConfirmarEliminar] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState({ type: '', message: '' });


    const [datosTemporales, setDatosTemporales] = useState({
        nombre: alumno.nombre,
        dni: alumno.dni
    });


    const getNotificationClass = (type) => {
        const baseClass = "p-3 rounded-xl font-semibold text-sm mb-4 transition-opacity duration-300 border-l-4";
        switch (type) {
            case 'error': return `${baseClass} bg-red-100 text-red-800 border-red-600`;
            case 'warning': return `${baseClass} bg-yellow-100 text-yellow-800 border-yellow-600`;
            case 'success': return `${baseClass} bg-green-100 text-green-800 border-green-600`;
            case 'info': return `${baseClass} bg-blue-100 text-blue-800 border-blue-600`;
            default: return '';
        }
    };

    useEffect(() => {
        if (notificationMessage.message) {
            const timer = setTimeout(() => {
                setNotificationMessage({ type: '', message: '' });
            }, 3000);

            return () => clearTimeout(timer);
        };


    }, [notificationMessage]);

    const handleGuardar = async () => {

        const data = {
            nombre: datosTemporales.nombre,
            dni: datosTemporales.dni
        }

        try {
            await updateAlumno(alumno._id, data);
            setNotificationMessage({ type: 'success', message: 'Se guardo exitosamente' });
            setEditMode(false);
        } catch (err) {
            //console.log(err.response);
            const mensaje = err?.response?.data?.error || err?.response?.data?.message || "Error al crear usuario";
            setNotificationMessage({ type: 'error', message: mensaje });

        }

    }

    const handleEliminar = async () => {
        
        try {
            await deleteAlumno(alumno._id);
            setNotificationMessage({ type: 'success', message: 'Se elimino exitosamente' });
            setConfirmarEliminar(false);
            onEliminar();
        } catch (err) {
            const mensaje = err?.response?.data?.error || err?.response?.data?.message || "Error al crear usuario";
            setNotificationMessage({ type: 'error', message: mensaje });

        }
    }

    const handleCancelar = () => {
        setDatosTemporales({
            nombre: alumno.nombre,
            dni: alumno.dni
        });
        setNotificationMessage({ type: 'info', message: 'Cambios descartados' });
        setEditMode(false);
    }

    useEffect(() => {
        if (!isOpen) {
            setEditMode(false);
        }
    }, [isOpen]);


    return (
        <div className="border-2 border-color2 rounded-2xl overflow-hidden shadow-soft">


            <div
                onClick={onToggle}
                className={`p-3 md:p-4 cursor-pointer transition-colors flex justify-between items-center ${isOpen ? "bg-color2" : "bg-color4 hover:bg-color2"}`}
            >
                <span className="font-bold text-color5">{alumno.nombre}</span>
                <span className="text-color5">{isOpen ? '▲' : '▼'}</span>

            </div>

            {isOpen && (
                <div className="p-4 md:p-6 bg-white animate-fadeIn">
                    {notificationMessage.message && (
                        <div className={getNotificationClass(notificationMessage.type)}>
                            {notificationMessage.message}
                        </div>
                    )}

                    {!editMode && (

                        <div>
                            <button onClick={() => setEditMode(true)}
                                className="w-full bg-color5 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all mb-6"
                            >
                                <FaEdit size={16} className="btn-icon-right" /> Editar Datos personales
                            </button>
                        </div>

                    )}

                    <div className="space-y-6 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                            <span className="font-bold uppercase tracking-wider">ID:</span>
                            <span className="break-all font-mono bg-gray-100 px-2 py-1 rounded">{alumno._id}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-color5 ml-1">Nombre Completo</label>
                                <input
                                    value={datosTemporales.nombre}
                                    onChange={(e) => setDatosTemporales({ ...datosTemporales, nombre: e.target.value })}
                                    readOnly={!editMode}
                                    className={`w-full p-3 rounded-xl border transition-all outline-none text-sm md:text-base ${editMode
                                        ? "border-color3 bg-white shadow-sm focus:ring-2 focus:ring-color3/20"
                                        : "border-transparent bg-transparent font-semibold text-color5 cursor-default"
                                        }`}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-color5 ml-1">DNI / Documento</label>
                                <input
                                    value={datosTemporales.dni}
                                    onChange={(e) => setDatosTemporales({ ...datosTemporales, dni: e.target.value })}
                                    readOnly={!editMode}
                                    className={`w-full p-3 rounded-xl border transition-all outline-none text-sm md:text-base ${editMode
                                        ? "border-color3 bg-white shadow-sm focus:ring-2 focus:ring-color3/20"
                                        : "border-transparent bg-transparent font-semibold text-color5 cursor-default"
                                        }`}
                                />
                            </div>
                        </div>

                        <button onClick={() => setConfirmarEliminar(true)}
                            className="text-red-500 hover:text-red-700 transition-colors flex items-center justify-center w-full"
                            title="Eliminar"
                        >
                            <FaTrashAlt size={16} /> Eliminar alumno
                        </button>

                        {confirmarEliminar && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-2xl p-6 shadow-xl text-center max-w-sm w-full mx-4">
                                    <h3 className="text-lg font-bold text-color5 mb-2">Eliminar alumno</h3>
                                    <p className="text-gray-600 mb-6">¿Estás seguro que deseas eliminar este alumno?</p>
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            onClick={() => setConfirmarEliminar(false)}
                                            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleEliminar}
                                            className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
                                        >
                                            Confirmar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {editMode && (
                        <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 mt-6 justify-end">
                            <button onClick={handleCancelar}
                                className="px-6 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button onClick={handleGuardar}
                                className="px-6 py-2 rounded-lg font-semibold bg-color3 text-white hover:bg-opacity-90 transition-colors"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    )}





                    {alumno.materias.map((m) => (
                        <div key={m._id} className="space-y-4 mt-3">
                            <MateriaAcordeon
                                materiaCurso={m}
                                alumnoId={alumno._id}
                            >
                            </MateriaAcordeon>
                        </div>
                    )

                    )}




                </div>


            )
            }


        </div>

    );








}