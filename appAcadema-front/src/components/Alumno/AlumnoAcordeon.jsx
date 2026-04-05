import { useEffect, useState } from "react";

import SeccionNotas from "./SeccionNotas";
import SeccionAsistencias from "./SeccionAsistencias";
import './alumnoAcordeon.css';


import { actualizarNotasAsistenciasDelAlumno } from "../../services/profeService";

export default function AlumnoAcordeon({ alumno, materiaSeleccionada }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [datosTemporales, setDatosTemporales] = useState({
        notas: alumno.notas,
        asistencias: alumno.asistencias
    });

    const [notificationMessage, setNotificationMessage] = useState({ type: '', message: '' });

    const handleGuardar = async () => {
        
        const payload = [{
            idCurso: materiaSeleccionada.idCurso,
            notas: datosTemporales.notas,
            asistencias: datosTemporales.asistencias
        }];
        
        const hayCeroNotas = datosTemporales.notas.some((n) => n.tipo === "" || n.nota === "");
        const hayCeroA = datosTemporales.asistencias.some((n) => n.fecha === "" || n.presente === "");
        const soloTiposNotas = datosTemporales.notas.map((n) => n.tipo);
        const soloFechas = datosTemporales.asistencias.map((n) => n.fecha);

        const setNotas = new Set(soloTiposNotas);
        const setA = new Set(soloFechas);

        if (setNotas.size != datosTemporales.notas.length || setA.size != datosTemporales.asistencias.length) {
            setNotificationMessage({ type: 'error', message: 'Ya existe una nota o asistencia con ese tipo o fecha' });
        } else if(hayCeroNotas || hayCeroA){
            setNotificationMessage({ type: 'error', message: 'Hay notas o asistencias con tipo o fechas vacío' });
        }else{
            try {
                await actualizarNotasAsistenciasDelAlumno(alumno.dni, payload);
                setNotificationMessage({ type: 'success', message: 'Se guardo exitosamente' });
                setEditMode(false);
            } catch (err) {
                console.log(err.response);
                setNotificationMessage({ type: 'error', message: 'Hubo un error al guardarlo' });

            }
        }



    }
    const handleCancelar = () => {
        setDatosTemporales({
            notas: alumno.notas,
            asistencias: alumno.asistencias
        });
        setNotificationMessage({ type: 'info', message: 'Cambios descartados' });
        setEditMode(false);
    }

    const getNotificationClass = (type) => {
        switch (type) {
            case 'error': return 'notification-error';
            case 'warning': return 'notification-warning';
            case 'success': return 'notification-success';
            case 'info': return 'notification-info';
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

    return (
        <div className="border rounded-xl mb-4 bg-white shadow-sm">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="p-4 cursor-pointer flex justify-between"
            >
                <span>{alumno.nombre}</span>
                <span>{isOpen ? '▲' : '▼'}</span>

            </div>

            {isOpen && (
                <div>
                    <div >
                        {notificationMessage.message && (
                            <div className={`notification-box ${getNotificationClass(notificationMessage.type)}`}>
                                {notificationMessage.message}
                            </div>
                        )}
                    </div>
                    <div>
                        {editMode ? (
                            <>
                                <button onClick={handleGuardar}>Guardar</button>
                                <button onClick={handleCancelar}>Cancelar</button>
                            </>
                        ) : (
                            <button onClick={() => setEditMode(true)}>Editar</button>
                        )}
                    </div>

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

                    <hr className="my-6" />



                </div>


            )
            }


        </div>

    );








}