import { FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function SeccionNotas({ notas, editMode, onChange }) {
    const [filaAEliminar, setFilaAEliminar] = useState(null);
    const inputStyle = "w-full p-2 border border-color2 rounded-lg text-sm outline-none bg-[#f0fdf4] focus:border-color3 focus:ring-2 focus:ring-color3/20 transition-all";

    const handleCambioNota = (index, campo, valor) => {
        const nuevasNotas = notas.map((n, i) =>
            i === index ? { ...n, [campo]: valor } : n
        );
        onChange(nuevasNotas);
    }

    const eliminarFila = (index) => {
        setFilaAEliminar(index);

    }


    const confirmarEliminar = () => {
        const nuevasNotas = notas.filter((n, i) => i !== filaAEliminar);
        onChange(nuevasNotas);
        setFilaAEliminar(null);
    }
    return (
        <>
            <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <h4 className="font-bold text-color5">Notas</h4>
                    {editMode && notas.length > 0 && (
                        <button 
                            onClick={() => onChange([...notas, { tipo: '', nota: '' }])}
                            className="bg-color2 text-color5 font-semibold py-1 px-4 rounded-lg hover:bg-color3 hover:text-white transition-colors text-sm"
                        >
                            + Nueva Nota
                        </button>
                    )}
                </div>

                {notas.length > 0 ? (
                    <table className="w-full text-center rounded-lg overflow-hidden border-collapse shadow-sm">
                        <thead className="bg-color3 text-white">
                            <tr>
                                <th className="p-2 font-semibold">Tipo</th>
                                <th className="p-2 font-semibold">Nota</th>
                                {editMode && <th className="p-2 w-10"></th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 border border-gray-100">
                            {notas.map((n, index) => (
                                <tr key={n._id || index} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-2">
                                        {editMode ? (
                                            <input
                                                value={n.tipo}
                                                onChange={(e) => handleCambioNota(index, "tipo", e.target.value)}
                                                className={inputStyle}
                                                placeholder="Ej. Parcial 1"
                                            />
                                        ) : (
                                            <span className="text-gray-600 italic">{n.tipo}</span>
                                        )}
                                    </td>
                                    <td className="p-2">
                                        {editMode ? (
                                            <input
                                                type="number"
                                                min={1}
                                                max={10}
                                                value={n.nota}
                                                onChange={(e) => handleCambioNota(index, "nota", e.target.value)}
                                                className={inputStyle}
                                            />
                                        ) : (
                                            <span className="font-bold text-color5">{n.nota}</span>
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
                            <p className="text-gray-500 text-sm italic">No tiene notas cargadas.</p>
                        ) : (
                            <button 
                                onClick={() => onChange([...notas, { tipo: '', nota: '' }])}
                                className="bg-color2 text-color5 font-semibold py-2 px-6 rounded-lg hover:bg-color3 hover:text-white transition-colors"
                            >
                                + Agregar primera Nota
                            </button>
                        )}
                    </div>
                )}
            </div>

            {filaAEliminar !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 shadow-xl text-center max-w-sm w-full mx-4">
                        <h3 className="text-lg font-bold text-color5 mb-2">Eliminar Nota</h3>
                        <p className="text-gray-600 mb-6">¿Estás seguro que deseas eliminar esta nota?</p>
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



