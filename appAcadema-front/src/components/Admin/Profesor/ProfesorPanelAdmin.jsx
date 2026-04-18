import { useEffect, useState } from "react";
import Loading from "../../Loading";
import { getAllProfesores, getProfesorById } from "../../../services/profeService";
import ProfesorAcordeon from "./ProfesorAcordeon";

export default function ProfesorPanel() {

    const [profesores, setProfesores] = useState([]);
    const [profesoresFiltradasPagina, setProfesoresFiltradasPagina] = useState([]);
    const [todasProfesores, setTodasProfesores] = useState([]);
    const [paginacion, setPaginacion] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openedProfesores, setOpenedProfesores] = useState(null);
    const [filtroProfesores, setFiltroProfesores] = useState("");

    const cargar = async (page) => {
        try {
            const res = await getAllProfesores(page);
            setProfesores(res.data.profesores);

            setProfesoresFiltradasPagina(res.data.profesores);
            setPaginacion(res.data.pagination);
        } catch {
            setError("No se pudieron cargar los profesores");
        } finally {
            setLoading(false);
        }
    }

    const cargarTodas = async () => {
        try {
            const res = await getAllProfesores(1, 99999);
            setTodasProfesores(res.data.profesores);
        } catch {
            setError("No se pudieron cargar los profesores");
        } finally {
            setLoading(false);
        }
    }

    const filtrar = async (texto) => {

        setFiltroProfesores(texto);
        if (texto === "") {
            setProfesoresFiltradasPagina(profesores);
        } else if (isMongoId(texto)) {
            try {
                let res = await getProfesorById(texto);
                setProfesoresFiltradasPagina([res.data]);

            } catch (err) {

                setProfesoresFiltradasPagina([]);

            }
        } else {
            setProfesoresFiltradasPagina(todasProfesores.filter((p) =>
                p.nombre?.toLowerCase().includes(texto.toLowerCase()) ||
                p.email?.toLowerCase().includes(texto.toLowerCase())
            ) || []);
        }
    }

    const isMongoId = (texto) => {
        return texto.length === 24 && /^[0-9a-fA-F]+$/.test(texto);
    }

    useEffect(() => {
        cargar();
        cargarTodas();
    }, []);

    if (loading) return <Loading fullScreen />;
    if (error) return <p className="error text-red-500 font-bold p-4 text-center">{error}</p>;

    return (
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-custom p-4 md:p-8 border border-white">

            <header className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-color3 text-center">
                    Gestión Profesores
                </h1>
            </header>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar profesor"
                    value={filtroProfesores}
                    onChange={(e) => filtrar(e.target.value)}
                    className="w-full p-3 rounded-xl border border-color2 focus:ring-2 focus:ring-color3 outline-none transition-all shadow-soft text-color5 text-sm"
                />
            </div>

            <div className="space-y-4">
                {profesoresFiltradasPagina.length > 0 ? (
                    profesoresFiltradasPagina.map((profe) => (
                        <ProfesorAcordeon
                            key={profe._id}
                            profesor={profe}
                            isOpen={openedProfesores === profe._id}
                            onToggle={() => setOpenedProfesores((prev) => prev === profe._id ? null : profe._id)}
                        />
                    ))
                ) : (
                    <p className="text-center py-10 text-gray-500 font-medium">
                        No se encontraron profesores para la búsqueda "{filtroProfesores}".
                    </p>
                )}
            </div>

            {filtroProfesores.length === 0 && paginacion && (
                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-100">
                    <button
                        onClick={() => cargar(paginacion.prevPage)}
                        disabled={paginacion.prevPage === null}
                        className={`w-full sm:flex-1 px-6 py-3 rounded-xl font-bold transition-colors ${paginacion.prevPage === null
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        anterior
                    </button>

                    <button
                        onClick={() => cargar(paginacion.nextPage)}
                        disabled={paginacion.nextPage === null}
                        /* Agregamos w-full para celulares y sm:flex-1 para PC */
                        className={`w-full sm:flex-1 px-6 py-3 rounded-xl font-bold transition-colors ${paginacion.nextPage === null
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-color2 text-color5 hover:bg-opacity-90"
                            }`}
                    >
                        siguiente
                    </button>
                </div>
            )}

        </div>
    );
}