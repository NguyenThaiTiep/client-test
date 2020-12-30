import { Store } from "redux";
import { apartmentLoader } from "./loadDataApartment";
import { provinceLoader } from "./loadDataProvince";

export const loader = (store: Store) => {
  apartmentLoader(store);
  provinceLoader(store);
};
