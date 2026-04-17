import { useEffect, useState } from "react";
import Loading from "../../Loading";
import { getAllCursos, getCursoById, getCursoByIdProfe } from "../../../services/cursoService";
import CursoAcordeon from "./CursoAcordeon";

export default function CursoPanel() {

    const [cursos, setCursos] = useState([]);
    const [cursosFiltradasPagina, setCursosFiltradasPagina] = useState([]);
    const [todasCursos, setTodasCursos] = useState([]);
    const [paginacion, setPaginacion] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openedCursos, setOpenedCursos] = useState(null);
    const [filtroCursos, setFiltroCursos] = useState("");

    const cargar = async (page) => {
        try {
            const res = await getAllCursos(page);
            setCursos(res.data.cursos);
            
            setCursosFiltradasPagina(res.data.cursos);
            setPaginacion(res.data.pagination);
        } catch {
            setError("No se pudieron cargar los cursos");
        } finally {
            setLoading(false);
        }
    }

    const cargarTodas = async () => {
        try {
            const res = await getAllCursos(1, 99999);
            setTodasCursos(res.data.cursos);
            console.log(todasCursos);
        } catch {
            setError("No se pudieron cargar los cursos");
        } finally {
            setLoading(false);
        }
    }

    const filtrar = async (texto) => {

        setFiltroCursos(texto);
        if (texto === "") {
            setCursosFiltradasPagina(cursos);
        } else if (isMongoId(texto)) {
            try {
                let res = await getCursoById(texto);
                setCursosFiltradasPagina([res.data]);
                
            } catch (err) {
                try {
                    let res = await getCursoByIdProfe(texto);
                   // console.log(res.data);
                    setCursosFiltradasPagina(res.data);
                } catch (err) {
                    setCursosFiltradasPagina([]);
                }
            }
        } else {
            setCursosFiltradasPagina(todasCursos.filter((c) =>
                c.nombreMateria?.toLowerCase().includes(texto.toLowerCase()) ||
                c.division?.toLowerCase().includes(texto.toLowerCase()) ||
                c.profesor?.nombre?.toLowerCase().includes(texto.toLowerCase()) ||
                c.alumnos?.some((a) => a.dni?.includes(texto.toLowerCase()))
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
                    Gestión Cursos
                </h1>
            </header>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar curso (Materia, Profesor, ID de Curso o ID de Profesor)"
                    value={filtroCursos}
                    onChange={(e) => filtrar(e.target.value)}
                    className="w-full p-3 rounded-xl border border-color2 focus:ring-2 focus:ring-color3 outline-none transition-all shadow-soft text-color5 text-sm"
                />
            </div>

            <div className="space-y-4">
                {cursosFiltradasPagina.length > 0 ? (
                    cursosFiltradasPagina.map((curso) => (
                        <CursoAcordeon
                            key={curso._id}
                            curso={curso}
                            isOpen={openedCursos === curso._id}
                            onToggle={() => setOpenedCursos((prev) => prev === curso._id ? null : curso._id)}
                        />
                    ))
                ) : (
                    <p className="text-center py-10 text-gray-500 font-medium">
                        No se encontraron cursos para la búsqueda "{filtroCursos}".
                    </p>
                )}
            </div>

            {filtroCursos.length === 0 && paginacion && (
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