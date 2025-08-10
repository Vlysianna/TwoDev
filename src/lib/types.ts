
export type SkemaType = {
  jurusan: string;
  pilihSkema: string;
  pilihCluster: string;
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
