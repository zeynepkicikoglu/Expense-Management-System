// models/service-helper.js
export function generateParamList(list, filterName) {
  let param = "";
  const orOperator = "or";
  const eqOperator = "eq";

  list.forEach((id, index) => {
    if (index !== list.length - 1) {
      param += `${filterName} ${eqOperator} '${id}' ${orOperator} `;
    } else {
      param += `${filterName} ${eqOperator} '${id}'`;
    }
  });

  return param;
}
