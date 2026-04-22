import api from "./api"; // tu axios configurado con baseURL y token

export const getAllAlumnos = (page = 1, limit = 50) => {
    return api.get(`api/alumnos?page=${page}&limit=${limit}`);
};

export const createAlumno = (data) => {
    return api.post("api/alumnos", data);
};

export const updateAlumno = (id, data) => {
    return api.put(`api/alumnos/${id}`, data);
};

export const deleteAlumno = (id) => {
    return api.delete(`api/alumnos/${id}`);
};

export const getAlumnoById = (id) => {
    return api.get(`api/alumnos/${id}`);
};

export const getAlumnoByDni = (dni) => {
    return api.get(`api/alumnos/dni/${dni}`);
};
