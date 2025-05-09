const dataSet = [
  { id: 0, value: 75 },
  { id: 1, value: 20 },
  { id: 2, value: 80 },
  { id: 3, value: 100 },
  { id: 4, value: 70 },
];

export function getData() {
  return dataSet.map((dataItem) => ({ ...dataItem }));
}

export function setData(newDataSet) {
  dataSet.length = 0;
  dataSet.push(...newDataSet.map(({ id, value }) => ({ id, value })));
}
