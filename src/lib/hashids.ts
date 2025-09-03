import Hashids from "hashids";

export const hashids = new Hashids(import.meta.env.HASH_SALT, 8);

export const getAssesseeUrl = (id: number) => {
	const encodedId = hashids.encode(id);
	return `${import.meta.env.VITE_APP_URL}/public/data-asesi/${encodedId}`;
};

export const getAssessorUrl = (id: number) => {
	const encodedId = hashids.encode(id);
	return `${import.meta.env.VITE_APP_URL}/public/data-asesor/${encodedId}`;
};

export const decodeId = (id: string) => hashids.decode(id)[0];
