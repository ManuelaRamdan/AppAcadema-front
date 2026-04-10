import { FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function SeccionNotas({ notas, editMode, onChange }) {
    const [filaAEliminar, setFilaAEliminar] = useState(null);

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
            {notas.length > 0 ? (
                <div className="mb-6">

                    {editMode && (
                        <button onClick={() => onChange([...notas, { tipo: '', nota: '' }])}>
                            + Nueva Nota
                        </button>
                    )}


                    <h4 className="font-bold text-color5 mb-2">Notas</h4>
                    <table className="w-full text-center rounded-lg overflow-hidden border-collapse">
                        <thead className="bg-color3 text-white">
                            <tr>
                                <th className="p-2 font-semibold">Tipo</th>
                                <th className="p-2 font-semibold">Nota</th>
                                {editMode && <th className="th-accion"></th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {notas.map((n, index) => (
                                <tr key={n._id || index} className="hover:bg-slate-50 transition-colors">
                                    <td>
                                        {editMode ? (
                                            <input
                                                value={n.tipo}
                                                onChange={(e) => handleCambioNota(index, "tipo", e.target.value)}
                                                className="input-tabla"
                                            />
                                        ) : (
                                            n.tipo
                                        )}
                                    </td>
                                    <td>
                                        {editMode ? (
                                            <input
                                                type="number"
                                                min={1}
                                                max={10}
                                                value={n.nota}
                                                onChange={(e) => handleCambioNota(index, "nota", e.target.value)}
                                                className="input-tabla"

                                            />
                                        ) : (
                                            n.nota
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
                </div>
            ) : (
                !editMode ? <p>No tiene notas</p> : (
                    <div>
                        <button onClick={() => onChange([...notas, { tipo: '', nota: '' }])}>
                            + Nueva Nota
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



