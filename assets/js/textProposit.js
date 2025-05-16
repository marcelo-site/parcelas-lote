import { formatPrice } from "./utils.js";

export const textProposit = (
  {
    measure,
    notInterest,
    qtyParcels,
    data,
    entry,
    lastParcel
  }
) => {
  const measureSplit = measure.split("x");
  let text = `Lote medindo ${measureSplit[0]} metros de largura por ${measureSplit[1]} metros de comprimento, `;

  if (entry) {
    text += `com entrada de *${formatPrice(entry)}*, `
  } else {
    text += `sem entrada, `
  }
  if (notInterest) {
    text += `podendo ser dividido em *${notInterest} parcelas sem juros* ou dividido em até ${qtyParcels} parcelas de *${formatPrice(lastParcel)}*`;
  } else {
    text += `podendo ser dividido em até ${qtyParcels} parcelas de *${formatPrice(lastParcel)}*`
  }
  text += `.\n\n*Detalhamento das Parcelas:*\n⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️\n`

  return text + data.replace(/&nbsp;/g, " ")
}