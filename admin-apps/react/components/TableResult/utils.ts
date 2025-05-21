export function formatParams(params: Array<string>) {
  return params?.map(param => {
    const lowerCaseParam = param.toLowerCase();
    if (!lowerCaseParam.includes("createdin")) return param;

    const matchBetween = lowerCaseParam.match(/createdin between "(.+?)" and "(.+?)"/);
    const match = lowerCaseParam.match(/createdin="(.+?)"/);

    if (matchBetween) {
      return `createdIn between ${formatDate(matchBetween[1])} and ${formatDate(matchBetween[2])}`;
    } else if (match) {
      return `createdIn=${formatDate(match[1])}`;
    } else {
      console.log("Não foi possível encontrar as datas na string.");
      return param;
    }
  });
}

function formatDate(dateStr: string): string {
  const timestamp = Date.parse(dateStr)
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Os meses começam do 0 em JavaScript
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

export const useGenerateRandomColor = () => {
  const getRandomValue = () => Math.floor(Math.random() * 128 + 64);
  const r = getRandomValue();
  const g = getRandomValue();
  const b = getRandomValue();

  const toHex = (value: any) => value.toString(16).padStart(2, '0');
  return `${toHex(r)}${toHex(g)}${toHex(b)}`;
};
