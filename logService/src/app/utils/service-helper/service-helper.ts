export function generateParamList(list: string[], filterName: string): string {
  var param = '';
  const orOperator = 'or';
  const eqOperator = 'eq';
  list.map((id: string, index: number) => {
    if (index != list.length - 1) {
      param +=
        filterName + ' ' + eqOperator + ' ' + `'${id}' ` + orOperator + ' ';
    } else {
      param += filterName + ' ' + eqOperator + ' ' + `'${id}'`;
    }
  });
  return param;
}
