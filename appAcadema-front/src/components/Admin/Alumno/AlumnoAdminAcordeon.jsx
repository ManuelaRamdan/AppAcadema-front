import { useEffect, useState } from "react";

import { FaEdit, FaTrashAlt } from "react-icons/fa";

import MateriaAcordeon from "./MateriaAlumnoAcordeon";


export default function AlumnoAdminAcordeon({ alumno, isOpen, onToggle }) {
    const [editMode, setEditMode] = useState(false);

    const [notificationMessage, setNotificationMessage] = useState({ type: '', message: '' });





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

                    <p className="text-color5 font-medium mb-4"><strong>DNI:</strong> {alumno?.dni ?? "N/A"}</p>


                    {notificationMessage.message && (
                        <div className={getNotificationClass(notificationMessage.type)}>
                            {notificationMessage.message}
                        </div>
                    )}

                    {alumno.materias.map((m) => (
                        <div className="space-y-4 mt-3">
                            <MateriaAcordeon
                                key={m._id}
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