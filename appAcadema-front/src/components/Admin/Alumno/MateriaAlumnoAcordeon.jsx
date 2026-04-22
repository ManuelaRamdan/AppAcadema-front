import { useState, useEffect } from "react";
import SeccionNotas from "../../Alumno/SeccionNotas";
import SeccionAsistencias from "../../Alumno/SeccionAsistencias";
import { FaEdit, FaTrashAlt } from "react-icons/fa";


import { updateAlumno } from "./../../../services/alumnoService";

export default function MateriaProfesorDetalle({ materiaCurso,  alumnoId}) {
    const [isOpen, setIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [notificationMessage, setNotificationMessage] = useState({ type: '', message: '' });

    const [datosTemporales, setDatosTemporales] = useState({
        notas: materiaCurso.notas,
        asistencias: materiaCurso.asistencias
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
            materias: [{
                idCurso: materiaCurso.idCurso,
                notas: datosTemporales.notas,
                asistencias: datosTemporales.asistencias
            }]
        }
        

        const hayCeroNotas = datosTemporales.notas.some((n) => n.tipo === "" || n.nota === "");
        const hayCeroA = datosTemporales.asistencias.some((n) => n.fecha === "" || n.presente === "");
        const soloTiposNotas = datosTemporales.notas.map((n) => n.tipo);
        const soloFechas = datosTemporales.asistencias.map((n) => n.fecha);

        const setNotas = new Set(soloTiposNotas);
        const setA = new Set(soloFechas);

        if (setNotas.size != datosTemporales.notas.length || setA.size != datosTemporales.asistencias.length) {
            setNotificationMessage({ type: 'error', message: 'Ya existe una nota o asistencia con ese tipo o fecha' });
        } else if (hayCeroNotas || hayCeroA) {
            setNotificationMessage({ type: 'error', message: 'Hay notas o asistencias con tipo o fechas vacío' });
        } else {
            try {
                await updateAlumno(alumnoId, data);
                setNotificationMessage({ type: 'success', message: 'Se guardo exitosamente' });
                setEditMode(false);
            } catch (err) {
                //console.log(err.response);
                setNotificationMessage({ type: 'error', message: 'Hubo un error al guardarlo' });

            }
        }



    }

    const handleCancelar = () => {
        setDatosTemporales({
            notas: materiaCurso.notas,
            asistencias: materiaCurso.asistencias
        });
        setNotificationMessage({ type: 'info', message: 'Cambios descartados' });
        setEditMode(false);
    }

    useEffect(() => {
        if(!isOpen){
            setEditMode(false);
        }
    }, [isOpen]);

    return (
        <div className="border-2 border-color2 rounded-2xl overflow-hidden shadow-soft">


            <div
                onClick={() => setIsOpen((prev) => !prev)}
                className={`p-3 md:p-4 cursor-pointer transition-colors flex justify-between items-center ${isOpen ? "bg-color2" : "bg-color4 hover:bg-color2"}`}
            >
                <span className="font-bold text-color5">
                    {materiaCurso.nombreCurso}
                </span>
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

                        <button onClick={() => setEditMode(true)}
                            className="w-full bg-color5 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all mb-6"
                        >
                            <FaEdit size={16} className="btn-icon-right" /> Editar Notas/Asistencias
                        </button>
                    )}



                    <SeccionNotas
                        notas={datosTemporales.notas}
                        editMode={editMode}
                        onChange={(nuevasNotas) => setDatosTemporales({ ...datosTemporales, notas: nuevasNotas })}
                    />

                    <SeccionAsistencias
                        asistencias={datosTemporales.asistencias}
                        editMode={editMode}
                        onChange={(nuevasAsistencias) => setDatosTemporales({ ...datosTemporales, asistencias: nuevasAsistencias })}
                    />

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

                </div>


            )
            }


        </div>)



}