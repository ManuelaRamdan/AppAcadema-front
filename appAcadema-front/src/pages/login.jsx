
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { loginRequest } from "../services/authService";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

export function Login() {
    const { login, logout, sessionExpired } = useContext(AuthContext);
    const [mensajeError, setMensajeError] = useState("");
    const [mensajeExito, setMensajeExito] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const expired = localStorage.getItem("SESSION_EXPIRED");
        // Busca si alguien dejó esta "nota" en el localStorage

        if (expired) {
            logout(true);// logout con aviso de sesión expirada
            localStorage.removeItem("SESSION_EXPIRED");// borra la nota
        }

        localStorage.removeItem("MANUAL_LOGOUT");// limpia otro flag

        if (sessionExpired) {
            logout(false);// logout sin aviso
        }

    }, [logout]);


    const enviarFormulario = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensajeError("");
        setMensajeExito("");

        try {
            const response = await loginRequest(email, password);

            const { token, usuario } = response.data

            login(token, usuario);

            if (usuario.rol === "administrador") navigate("/admin");
            if (usuario.rol === "profesor") navigate("/profesor");
            if (usuario.rol === "padre") navigate("/padre");

        } catch (error) {
            setMensajeError("Credenciales incorrectas");
        } finally {
            setLoading(false);
        }
    }


    return (

        <div className="min-h-screen flex items-center justify-center bg-color1 p-5">
            <div className="w-full max-w-[420px] bg-white p-8 rounded-[18px] border border-color2 shadow-custom">
                <h2 className="text-center text-2xl font-bold text-color5 mb-5">Iniciar sesion</h2>

                {sessionExpired &&
                    <p className="text-[#c62828] font-semibold mb-4 text-center">
                        Tu sesión expiró. Volvé a iniciar sesión.
                    </p>
                }

                {mensajeExito && <p>{mensajeExito}</p>}
                {mensajeError && <p className="text-[#c62828] font-semibold mb-4 text-center">{mensajeError}</p>}

                <form onSubmit={enviarFormulario} className="flex flex-col">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 rounded-xl border-2 border-color3 mb-4 focus:border-color4 focus:bg-[#f6fbe9] outline-none transition-all"
                    />
                    <input
                        type="password"
                        placeholder="Ingrese su contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 rounded-xl border-2 border-color3 mb-4 focus:border-color4 focus:bg-[#f6fbe9] outline-none transition-all"
                    />

                    <button type="submit" disabled={loading} 
                    className="w-full p-3.5 bg-color5 text-white rounded-xl font-semibold hover:bg-[#43473f] disabled:bg-[#a6aa9e] disabled:cursor-not-allowed transition-all flex justify-center items-center">
                        {loading ? <Loading size={18} color="#ffffff" /> : "Ingresar"}
                    </button>
                </form>


            </div>
        </div>

    );
}