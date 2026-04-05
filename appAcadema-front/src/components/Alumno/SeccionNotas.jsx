

export default function SeccionNotas({ notas, editMode, onChange }) {

    const handleCambioNota = (index, campo, valor) => {
        const nuevasNotas = notas.map((n, i) =>
            i === index ? { ...n, [campo]: valor } : n
        );
        onChange(nuevasNotas);
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : null
            }
        </>

    );

}