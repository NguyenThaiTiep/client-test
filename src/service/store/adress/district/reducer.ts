import { DistrictForProvinceDto } from "../../../../api/address/district/dto/districtOfProvince";
import { ActionConst } from "./action";

const initState = {
  state: false,
  districts: [] as DistrictForProvinceDto[],
};
export const DistrictReducer = (
  state = initState,
  action = { type: "", payload: {} }
) => {
  switch (action.type) {
    case ActionConst.ADD:
      if (action.payload) {
        if (
          state.districts.find(
            (i) => i === (action.payload as DistrictForProvinceDto)?.id
          )
        )
          return { ...state };

        let oldAddState = { ...state }.districts || [];
        if (
          oldAddState.find(
            (i) => i.id === (action.payload as DistrictForProvinceDto).id
          )
        )
          return { ...state };
        oldAddState.push(action.payload as DistrictForProvinceDto);

        return { ...state, districts: oldAddState, state: false };
      }
      return { ...state };
    case ActionConst.CHANGE_STATE:
      return {
        ...state,
        state: action.payload || false,
      };
    default:
      return state;
  }
};
