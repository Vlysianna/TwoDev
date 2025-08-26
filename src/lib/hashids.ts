import Hashids from "hashids";

const hashids = new Hashids(import.meta.env.HASH_SALT, 8);

export const getAssesseeUrl = (id: number) => {
	const encodedId = hashids.encode(id);
	return `${import.meta.env.VITE_API_URL}/public/assessee/${encodedId}`;
};

export const decodeId = (id: string) => hashids.decode(id)[0];
