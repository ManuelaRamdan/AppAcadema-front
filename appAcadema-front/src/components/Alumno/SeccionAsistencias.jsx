import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

export default function SeccionAsistencias({ asistencias, editMode, onChange }) {
    const [filaAEliminar, setFilaAEliminar] = useState(null);
    const inputStyle = "w-full p-2 border border-color2 rounded-lg text-sm outline-none bg-[#f0fdf4] focus:border-color3 focus:ring-2 focus:ring-color3/20 transition-all";


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
            <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <h4 className="font-bold text-color5">Asistencias</h4>
                    {editMode && asistencias.length > 0 && (
                        <button 
                            onClick={() => onChange([...asistencias, { fecha: '', presente: 'presente' }])}
                            className="bg-color2 text-color5 font-semibold py-1 px-4 rounded-lg hover:bg-color3 hover:text-white transition-colors text-sm"
                        >
                            + Nueva Asistencia
                        </button>
                    )}
                </div>

                {asistencias.length > 0 ? (
                    <table className="w-full text-center rounded-lg overflow-hidden border-collapse shadow-sm">
                        <thead className="bg-color3 text-white">
                            <tr>
                                <th className="p-2 font-semibold">Fecha</th>
                                <th className="p-2 font-semibold">Estado</th>
                                {editMode && <th className="p-2 w-10"></th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 border border-gray-100">
                            {asistencias.map((n, index) => (
                                <tr key={n._id || index} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-2">
                                        {editMode ? (
                                            <input
                                                type="datetime-local"
                                                value={getDatetimeLocalValue(n.fecha)}
                                                onChange={(e) => handleCambioAsistencia(index, "fecha", e.target.value)}
                                                className={inputStyle}
                                            />
                                        ) : (
                                            <span className="text-gray-600">{getFixedDateDisplay(n.fecha)}</span>
                                        )}
                                    </td>
                                    <td className="p-2">
                                        {editMode ? (
                                            <select 
                                                value={n.presente} 
                                                onChange={(e) => handleCambioAsistencia(index, "presente", e.target.value)} 
                                                className={inputStyle}
                                            >
                                                <option value="presente">Presente</option>
                                                <option value="ausente">Ausente</option>
                                                <option value="feriado">Feriado</option>
                                                <option value="paro">Paro</option>
                                            </select>
                                        ) : (
                                            <span className={`font-medium ${n.presente === 'presente' ? 'text-color3' : (n.presente === 'ausente' ? 'text-red-500' : 'text-gray-600')}`}>
                                                {n.presente ? n.presente.charAt(0).toUpperCase() + n.presente.slice(1) : ''}
                                            </span>
                                        )}
                                    </td>
                                    {editMode && (
                                        <td className="p-2">
                                            <button 
                                                onClick={() => eliminarFila(index)}
                                                className="text-red-500 hover:text-red-700 transition-colors flex items-center justify-center w-full"
                                                title="Eliminar"
                                            >
                                                <FaTrashAlt size={16} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center">
                        {!editMode ? (
                            <p className="text-gray-500 text-sm italic">No tiene asistencias cargadas.</p>
                        ) : (
                            <button 
                                onClick={() => onChange([...asistencias, { fecha: '', presente: 'presente' }])}
                                className="bg-color2 text-color5 font-semibold py-2 px-6 rounded-lg hover:bg-color3 hover:text-white transition-colors"
                            >
                                + Agregar primera Asistencia
                            </button>
                        )}
                    </div>
                )}
            </div>

            {filaAEliminar !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 shadow-xl text-center max-w-sm w-full mx-4">
                        <h3 className="text-lg font-bold text-color5 mb-2">Eliminar Asistencia</h3>
                        <p className="text-gray-600 mb-6">¿Estás seguro que deseas eliminar esta asistencia?</p>
                        <div className="flex gap-4 justify-center">
                            <button 
                                onClick={() => setFilaAEliminar(null)} 
                                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={confirmarEliminar} 
                                className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}