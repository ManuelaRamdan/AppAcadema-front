import { useEffect, useState } from "react";
import Loading from "../../Loading";
import { getUsuarioById, createUsuario, getAllUsuarios } from "../../../services/usuarioService";
import UsuarioAcordeon from "./UsuarioAcordeon";
import CrearUsuario from "./CrearUsuario";

export default function UsuarioPanel() {

    const [usuarios, setUsuarios] = useState([]);
    const [usuariosFiltradasPagina, setUsuariosFiltradasPagina] = useState([]);
    const [todasUsuarios, setTodasUsuarios] = useState([]);
    const [paginacion, setPaginacion] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openedUsuarios, setOpenedUsuarios] = useState(null);
    const [filtroUsuarios, setFiltroUsuarios] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [pagActual, setPagActual] = useState(1);

    const cargar = async (page) => {
        try {
            const res = await getAllUsuarios(page);
            setUsuarios(res.data.usuarios);

            setUsuariosFiltradasPagina(res.data.usuarios);
            setPaginacion(res.data.pagination);
        } catch {
            setError("No se pudieron cargar los usuarios");
        } finally {
            setLoading(false);
        }
    }

    const cargarTodas = async () => {
        try {
            const res = await getAllUsuarios(1, 99999);
            setTodasUsuarios(res.data.usuarios);
            //console.log(todasCursos);
        } catch {
            setError("No se pudieron cargar los usuarios");
        } finally {
            setLoading(false);
        }
    }

    const filtrar = async (texto) => {

        setFiltroUsuarios(texto);
        if (texto === "") {
            setUsuariosFiltradasPagina(usuarios);
        } else if (isMongoId(texto)) {
            try {
                let res = await getUsuarioById(texto);
                setUsuariosFiltradasPagina([res.data]);

            } catch (err) {

                setUsuariosFiltradasPagina([]);

            }
        } else {
            setUsuariosFiltradasPagina(todasUsuarios.filter((u) =>
                u.nombre?.toLowerCase().includes(texto.toLowerCase()) ||
                u.email?.toLowerCase().includes(texto.toLowerCase()) ||
                u.hijos?.some((h) => h.dni?.includes(texto.toLowerCase()))
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
                    Gestión Usuarios
                </h1>
                <button 
                    onClick={() => setOpenModal(true)}
                    className="bg-color3 text-white font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition-all shadow-custom border-2 border-color5/10 text-sm md:text-base"
                >
                    Crear usuario +
                </button>
            </header>

            <CrearUsuario
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                onExito={() => {
                    setOpenModal(false);
                    cargar(pagActual);
                    cargarTodas();
                }}>

            </CrearUsuario>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar usuario (nombre, id, email, dni del alumno)"
                    value={filtroUsuarios}
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
                            isOpen={openedUsuarios === usuario._id}
                            onToggle={() => setOpenedUsuarios((prev) => prev === usuario._id ? null : usuario._id)}
                        />
                    ))
                ) : (
                    <p className="text-center py-10 text-gray-500 font-medium">
                        No se encontraron usuarios para la búsqueda "{filtroUsuarios}".
                    </p>
                )}
            </div>

            {filtroUsuarios.length === 0 && paginacion && (
                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-100">
                    <button
                        onClick={() => {
                            setPagActual(paginacion.prevPage);
                            cargar(paginacion.prevPage);
                        }}
                        disabled={paginacion.prevPage === null}
                        className={`w-full sm:flex-1 px-6 py-3 rounded-xl font-bold transition-colors ${paginacion.prevPage === null
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        anterior
                    </button>

                    <button
                        onClick={() => {
                            setPagActual(paginacion.nextPage);
                            cargar(paginacion.nextPage);
                        }}
                        disabled={paginacion.nextPage === null}
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