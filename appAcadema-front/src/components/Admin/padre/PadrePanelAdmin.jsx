import { useEffect, useState } from "react";
import Loading from "../../Loading";
import { getAllUsuarios, getUsuarioById } from "../../../services/usuarioService";
import UsuarioAcordeon from "../Usuario/UsuarioAcordeon";

export default function PadrePanelAdmin({guardarDni}) {

    const [usuarios, setUsuarios] = useState([]);
    const [usuariosFiltradasPagina , setUsuariosFiltradasPagina ] = useState([]);
    const [todosUsuarios, setTodosUsuarios] = useState([]);
    const [paginacion, setPaginacion] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openedUsuario, setOpenedUsuario] = useState(null);
    const [filtroUsuario, setFiltroUsuario] = useState("");
    const limit = 4;

    const cargar = async (page) => {
        try {
            const res = await getAllUsuarios(page, limit, 'padre');
            setUsuarios(res.data.usuarios);
            setUsuariosFiltradasPagina(res.data.usuarios);
            setPaginacion(res.data.pagination);
        } catch {
            setError("No se pudieron cargar los padres");
        } finally {
            setLoading(false);
        }
    }
    
    const cargarTodas = async () => {
        try {
            const res = await getAllUsuarios(1, 99999, 'padre');
            setTodosUsuarios(res.data.usuarios);
        } catch {
            setError("No se pudieron cargar los padres");
        } finally {
            setLoading(false);
        }
    }

    const filtrar = async (texto) =>{
        setFiltroUsuario(texto);
        if (texto === "") {
            setUsuariosFiltradasPagina(usuarios);
        }else if(isMongoId(texto)){
            const res = await getUsuarioById(texto);
            setUsuariosFiltradasPagina([res.data]); 
        } else{
            setUsuariosFiltradasPagina(todosUsuarios.filter((m) =>
                m.nombre.toLowerCase().includes(texto.toLowerCase()) ||
                m.email.toLowerCase().includes(texto.toLowerCase()) ||
                m.hijos?.some((h) => h.dni?.includes(texto.toLowerCase())) 
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
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-custom p-4 md:p-8 border border-white">
            
            <header className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-color3 text-center">
                    Gestión Padres
                </h1>
            </header>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar padre (Nombre o email o dni del hijo o ID del padre)"
                    value={filtroUsuario}
                    onChange={(e) => filtrar(e.target.value)}
                    className="w-full p-3 rounded-xl border border-color2 focus:ring-2 focus:ring-color3 outline-none transition-all shadow-soft text-color5 text-sm"
                />
            </div>

            <div className="space-y-4">
                {usuariosFiltradasPagina.length > 0 ? (
                    usuariosFiltradasPagina.map((usuario) => (
                        <UsuarioAcordeon
                            key={usuario._id}
                            usuario={usuario}
                            isOpen={openedUsuario === usuario._id}
                            onToggle={() => setOpenedUsuario((prev) => prev === usuario._id ? null : usuario._id)}
                            guardarDni={guardarDni}
                        />
                    ))
                ) : (
                    <p className="text-center py-10 text-gray-500 font-medium">
                        No se encontraron materias para la búsqueda "{filtroUsuario}".
                    </p>
                )}
            </div>

            {filtroUsuario.length === 0 && paginacion && (
                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-100">
                <button
                    onClick={() => cargar(paginacion.prevPage)}
                    disabled={paginacion.prevPage === null}
                    className={`w-full sm:flex-1 px-6 py-3 rounded-xl font-bold transition-colors ${
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
                    /* Agregamos w-full para celulares y sm:flex-1 para PC */
                    className={`w-full sm:flex-1 px-6 py-3 rounded-xl font-bold transition-colors ${
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