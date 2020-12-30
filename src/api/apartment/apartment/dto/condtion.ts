import { changeString } from "../../../../libs/constants/function/getQuery";

export const condition = {
  minPrice: 0,
  maxPrice: 1000000000,
  minS: 0,
  maxS: 10000000,
  apartmentTypeId: undefined,
  provinceId: 1,
  districtId: undefined,
  wardId: undefined,
  streetId: undefined,
  nearLocation: [],
  take: 5,
  skip: 0,
  page: 1,
  key: "",
};
export const convertToCondition = (input: any) => {
  let output = {} as any;
  output.provinceId = parseInt(input.provinceId || condition.provinceId);
  output.page = parseInt(input.page || 1);
  output.take = parseInt(input.take || condition.take);
  output.skip = (output.page - 1) * output.take;
  output.minPrice = parseInt(input.minPrice || condition.minPrice);
  output.maxPrice = parseInt(input.maxPrice || condition.maxPrice);
  output.minS = parseInt(input.minS || condition.minS);
  output.maxS = parseInt(input.maxS || condition.maxS);
  output.key = changeString(input.key);
  output.districtId = input.districtId ? parseInt(input.districtId) : undefined;
  if (input.apartmentTypeId)
    output.apartmentTypeId = input.apartmentTypeId
      ? parseInt(input.apartmentTypeId)
      : undefined;
  return output;
};
export const convertToConditionParams = (input: any) => {
  let output = {} as any;
  if (input.provinceId && input.provinceId !== 1)
    output.provinceId = parseInt(input.provinceId || condition.provinceId);
  if (input.page && input.page !== 1) output.page = parseInt(input.page);
  if (input.minPrice && input.minPrice !== condition.minPrice)
    output.minPrice = parseInt(input.minPrice || condition.minPrice);
  if (input.maxPrice && input.maxPrice !== condition.maxPrice)
    output.maxPrice = parseInt(input.maxPrice || condition.maxPrice);
  if (input.minS && input.minS !== condition.minS)
    output.minS = parseInt(input.minS || condition.minS);
  if (input.maxS && input.maxS !== condition.maxS)
    output.maxS = parseInt(input.maxS || condition.maxS);
  if (input.key && input.key !== "") output.key = input.key;
  if (input.districtId)
    output.districtId = input.districtId
      ? parseInt(input.districtId)
      : undefined;
  if (input.apartmentTypeId)
    output.apartmentTypeId = input.apartmentTypeId
      ? parseInt(input.apartmentTypeId)
      : undefined;
  return output;
};

export class ConditionDto {
  take?: number;
  skip?: number;
  key?: string;
  apartmentTypeId?: number;
  provinceId?: number;
  districtId?: number;
  page?: number;
  minPrice?: number;
  maxPrice?: number;
  minS?: number;
  maxS?: number;
}
