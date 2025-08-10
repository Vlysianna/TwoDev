
export type SkemaType = {
  jurusan: string;
  pilihSkema: string;
  pilihOkupasi: string;
  nomorSKM: string;
  unit: Unit[];
};

export type Unit = {
  kode: string;
  judul: string;
  elemen: Element[];
};

export type Element = {
  id: string;
  text: string;
  item: ItemElement[];
};

export type ItemElement = {
  id: string;
  text: string;
};

type SkemaTypeRaw = {
  occupation_id: number;
  code: string;
  unit_competencies: {
    unit_code: string;
    title: string;
    elements: {
      title: string;
      element_details: {
        description: string;
      }[];
    }[];
  }[];
};

export function convertSkemaToPostPayload(skema: SkemaType, occupation_id: number): SkemaTypeRaw {
  return {
    occupation_id,
    code: skema.nomorSKM,
    unit_competencies: skema.unit.map((unit) => ({
      unit_code: unit.kode,
      title: unit.judul,
      elements: unit.elemen.map((elemen) => ({
        title: elemen.text,
        element_details: elemen.item.map((item) => ({
          description: item.text,
        })),
      })),
    })),
  };
}