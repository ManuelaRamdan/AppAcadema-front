import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

export default function SeccionAsistencias({ asistencias, editMode, onChange }) {
    const [filaAEliminar, setFilaAEliminar] = useState(null);

    const handleCambioAsistencia = (index, campo, valor) => {
        const nuevasAsistencias = asistencias.map((n, i) =>
            i === index ? { ...n, [campo]: valor } : n
        );
        onChange(nuevasAsistencias);
    }

    const getFixedDateDisplay = (isoDate) => {

        let result = "";

        if (isoDate) {

            const date = new Date(isoDate);
            const year = date.getUTCFullYear();
            const month = date.getUTCMonth() + 1;
            const day = date.getUTCDate();

            result = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
        };


        return result;


    };

    const getDatetimeLocalValue = (isoDate) => {

        let result = "";

        if (isoDate) {

            const date = new Date(isoDate);
            const year = date.getUTCFullYear();
            const month = date.getUTCMonth() + 1;
            const day = date.getUTCDate();
            const hours = date.getUTCHours();
            const minutos = date.getUTCMinutes();

            result = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
        };


        return result;


    };

    const eliminarFila = (index) => {
        setFilaAEliminar(index);

    }


    const confirmarEliminar = () => {
        const nuevasNotas = asistencias.filter((n, i) => i !== filaAEliminar);
        onChange(nuevasNotas);
        setFilaAEliminar(null);
    }

    return (
        <>
            {asistencias.length > 0 ? (
                <div className="mb-6">

                    {editMode && (
                        <button onClick={() => onChange([...asistencias, { fecha: '', presente: 'presente' }])}>
                            + Nueva Asistencia
                        </button>
                    )}


                    <h4 className="font-bold text-color5 mb-2">Asistencias</h4>
                    <table className="w-full text-center rounded-lg overflow-hidden border-collapse">
                        <thead className="bg-color3 text-white">
                            <tr>
                                <th className="p-2 font-semibold">Fecha</th>
                                <th className="p-2 font-semibold">Presente</th>
                                {editMode && <th className="th-accion"></th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {asistencias.map((n, index) => (
                                <tr key={n._id || index} className="hover:bg-slate-50 transition-colors">
                                    <td>
                                        {editMode ? (
                                            <input
                                                type="datetime-local"
                                                value={getDatetimeLocalValue(n.fecha)}
                                                onChange={(e) => handleCambioAsistencia(index, "fecha", e.target.value)}
                                                className="input-tabla"

                                            />
                                        ) : (
                                            getFixedDateDisplay(n.fecha)
                                        )}
                                    </td>
                                    <td>
                                        {editMode ? (



                                            <select value={n.presente} onChange={(e) => handleCambioAsistencia(index, "presente", e.target.value)} className="input-tabla">
                                                <option value="presente">Presente</option>
                                                <option value="ausente">Ausente</option>
                                                <option value="feriado">Feriado</option>
                                                <option value="paro">Paro</option>
                                            </select>
                                        ) : (
                                            n.presente
                                        )}
                                    </td>
                                    <td>
                                        {editMode && (
                                            <button onClick={() => eliminarFila(index)}>
                                                <FaTrashAlt size={14} />
                                            </button>



                                        )}


                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div >
            ) : (
                !editMode ? <p>No tiene asistencia</p> : (
                    <div>
                        <button onClick={() => onChange([...asistencias, { fecha: '', presente: 'presente' }])}>
                            + Nueva Asistencia
                        </button>
                    </div>
                )

            )}

            {filaAEliminar !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">  {/* fondo oscuro */}
                    <div className="bg-white rounded-xl p-6 shadow-xl">
                        <p>¿Eliminar esta nota?</p>
                        <button onClick={confirmarEliminar}>Confirmar</button>
                        <button onClick={() => setFilaAEliminar(null)}>Cancelar</button>
                    </div>
                </div>
            )}

        </>

    );

}