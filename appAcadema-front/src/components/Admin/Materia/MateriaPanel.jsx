import { useEffect, useState } from "react";
import Loading from "../../Loading";
import { getAllMaterias, getMateriaById } from "../../../services/materiaService";
import MateriaAcordeon from "./MateriaAcordeon";

export default function MateriaPanel() {

    const [materias, setMaterias] = useState([]);
    const [materiasFiltradasPagina , setMateriasFiltradasPagina ] = useState([]);
    const [todasMaterias, setTodasMaterias] = useState([]);
    const [paginacion, setPaginacion] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openedMateria, setOpenedMateria] = useState(null);
    const [filtroMateria, setFiltroMateria] = useState("");

    const cargar = async (page) => {
        try {
            const res = await getAllMaterias(page);
            setMaterias(res.data.materias);
            setMateriasFiltradasPagina(res.data.materias);
            setPaginacion(res.data.pagination);
        } catch {
            setError("No se pudieron cargar las materias");
        } finally {
            setLoading(false);
        }
    }
    
    const cargarTodas = async () => {
        try {
            const res = await getAllMaterias(1, 99999);
            setTodasMaterias(res.data.materias);
        } catch {
            setError("No se pudieron cargar las materias");
        } finally {
            setLoading(false);
        }
    }

    const filtrar = async (texto) =>{
        setFiltroMateria(texto);
        if (texto === "") {
            setMateriasFiltradasPagina(materias);
        }else if(isMongoId(texto)){
            const res = await getMateriaById(texto);
            setMateriasFiltradasPagina([res.data]); 
        } else{
            setMateriasFiltradasPagina(todasMaterias.filter((m) =>
                `${m.nombre}`
                    .toLowerCase()
                    .includes(texto.toLowerCase())
            ) || []);
        }
    }

    const isMongoId =  (texto) =>{
        return texto.length === 24 && /^[0-9a-fA-F]+$/.test(texto);
    }

    useEffect(() => {
        cargar();
        cargarTodas();
    }, []);

    if (loading) return <Loading fullScreen />;
    if (error) return <p className="error text-red-500 font-bold p-4 text-center">{error}</p>;

    return (
        /* Eliminamos el <main> y el <div flex> aquí porque AdminPanel ya los tiene. 
           Solo retornamos la tarjeta blanca (igual que AlumnoInfo) */
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-custom p-4 md:p-8 border border-white min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-4rem)] flex flex-col">
            
            <header className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-color3 text-center">
                    Gestión Materias
                </h1>
            </header>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar materia (Nombre o ID)"
                    value={filtroMateria}
                    onChange={(e) => filtrar(e.target.value)}
                    className="w-full p-3 rounded-xl border border-color2 focus:ring-2 focus:ring-color3 outline-none transition-all shadow-soft text-color5 text-sm"
                />
            </div>

            {/* Este div ocupa el espacio libre restante y empuja la paginación abajo */}
            <div className="space-y-4 flex-1">
                {materiasFiltradasPagina.length > 0 ? (
                    materiasFiltradasPagina.map((materia) => (
                        <MateriaAcordeon
                            key={materia._id}
                            materia={materia}
                            isOpen={openedMateria === materia._id}
                            onToggle={() => setOpenedMateria((prev) => prev === materia._id ? null : materia._id)}
                        />
                    ))
                ) : (
                    <p className="text-center py-10 text-gray-500 font-medium">
                        No se encontraron materias para la búsqueda "{filtroMateria}".
                    </p>
                )}
            </div>

            {/* Paginación */}
            {filtroMateria.length === 0 && paginacion && (
                <div className="flex flex-row gap-4 mt-8 pt-4 border-t border-gray-100">
                    <button
                        onClick={() => cargar(paginacion.prevPage)}
                        disabled={paginacion.prevPage === null}
                        className={`flex-1 px-6 py-3 rounded-xl font-bold transition-colors ${
                            paginacion.prevPage === null
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        anterior
                    </button>

                    <button
                        onClick={() => cargar(paginacion.nextPage)}
                        disabled={paginacion.nextPage === null}
                        className={`flex-1 px-6 py-3 rounded-xl font-bold transition-colors ${
                            paginacion.nextPage === null
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