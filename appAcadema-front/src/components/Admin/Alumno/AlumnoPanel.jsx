import { useEffect, useState } from "react";
import Loading from "../../Loading";
import { getAllAlumnos, updateAlumno, deleteAlumno, getAlumnoById, getAlumnoByDni } from "../../../services/alumnoService";
import AlumnoAdminAcordeon from "./AlumnoAdminAcordeon";
import CrearAlumno from "./CrearAlumno";

export default function AlumnoPanel({ dni, limpiarDni }) {

    const [alumnos, setAlumnos] = useState([]);
    const [alumnosFiltradasPagina, setAlumnosFiltradasPagina] = useState([]);
    const [todasAlumnos, setTodasAlumnos] = useState([]);
    const [paginacion, setPaginacion] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openedAlumnos, setOpenedAlumnos] = useState(null);
    const [filtroAlumnos, setFiltroAlumnos] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [pagActual, setPagActual] = useState(1);

    const cargar = async (page) => {
        try {
            const res = await getAllAlumnos(page);
            setAlumnos(res.data.alumnos);
            //console.log(res.data);

            setAlumnosFiltradasPagina(res.data.alumnos);
            setPaginacion(res.data.pagination);
        } catch {
            setError("No se pudieron cargar los Alumnos");
        } finally {
            setLoading(false);
        }
    }

    const cargarTodas = async () => {
        try {
            const res = await getAllAlumnos(1, 99999);
            setTodasAlumnos(res.data.alumnos);
            //console.log(todasCursos);
        } catch {
            setError("No se pudieron cargar los Alumnos");
        } finally {
            setLoading(false);
        }
    }

    const filtrar = async (texto) => {

        setFiltroAlumnos(texto);
        if (texto === "") {
            setAlumnosFiltradasPagina(alumnos);
        } else if (isMongoId(texto)) {
            try {
                let res = await getAlumnoById(texto);
                setAlumnosFiltradasPagina([res.data]);

            } catch (err) {

                setAlumnosFiltradasPagina([]);
            }
        } else if (!isNaN(texto) && texto.length >= 7) {
            try {
                let res = await getAlumnoByDni(texto);
                // console.log(res.data);
                setAlumnosFiltradasPagina([res.data]);
            } catch (err) {
                setAlumnosFiltradasPagina([]);
            }
        } else {
            setAlumnosFiltradasPagina(todasAlumnos.filter((a) =>
                a.nombre?.toLowerCase().includes(texto.toLowerCase())

            ) || []);
        }
    }

    const isMongoId = (texto) => {
        return texto.length === 24 && /^[0-9a-fA-F]+$/.test(texto);
    }

    useEffect(() => {

        async function data() {
            await cargar();
            await cargarTodas();
            if (dni) {
                setFiltroAlumnos(dni);
                await filtrar(dni);
                limpiarDni();
            }
        }
        data();

    }, []);



    if (loading) return <Loading fullScreen />;
    if (error) return <p className="error text-red-500 font-bold p-4 text-center">{error}</p>;

    return (
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-custom p-4 md:p-8 border border-white">

            <header className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-color3 text-center">
                    Gestión Alumnos
                </h1>
                <button
                    onClick={() => setOpenModal(true)}
                    className="bg-color3 text-white font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition-all shadow-custom border-2 border-color5/10 text-sm md:text-base"
                >
                    Crear alumnos +
                </button>
            </header>

            <CrearAlumno
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                onExito={() => {
                    setOpenModal(false);
                    cargar(pagActual);
                    cargarTodas();
                }}>

            </CrearAlumno>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar alumno (nombre, id, )"
                    value={filtroAlumnos}
                    onChange={(e) => filtrar(e.target.value)}
                    className="w-full p-3 rounded-xl border border-color2 focus:ring-2 focus:ring-color3 outline-none transition-all shadow-soft text-color5 text-sm"
                />
            </div>

            <div className="space-y-4">
                {alumnosFiltradasPagina.length > 0 ? (
                    alumnosFiltradasPagina.map((alumno) => (
                        <AlumnoAdminAcordeon
                            key={alumno._id}
                            alumno={alumno}
                            isOpen={openedAlumnos === alumno._id}
                            onToggle={() => setOpenedAlumnos((prev) => prev === alumno._id ? null : alumno._id)}
                            onEliminar={() => {
                                cargar(pagActual);
                                cargarTodas();
                            }}
                        />
                    ))
                ) : (
                    <p className="text-center py-10 text-gray-500 font-medium">
                        No se encontraron usuarios para la búsqueda "{filtroAlumnos}".
                    </p>
                )}
            </div>

            {filtroAlumnos.length === 0 && paginacion && (
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