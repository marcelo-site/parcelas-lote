import { formatPrice, formatValue } from "./utils.js";

export const textProposit = (
  {
    value,
    measure,
    notInterest,
    qtyParcels,
    data,
    entry,
    lastParcel
  }
) => {
  const measureSplit = measure.split("x");
  let text = `Lote medindo ${measureSplit[0]} metros de largura por ${measureSplit[1]} metros de comprimento valor de ${formatValue(value)}, pagamento parcelado, `;

  if (entry) {
    text += `com entrada de *${formatPrice(entry)}*, `
  } else {
    text += `sem entrada, `
  }
  if (notInterest) {
    text += `pode ser dividido em *${notInterest} parcelas sem juros* ou em até ${qtyParcels} parcelas de *${formatPrice(lastParcel)}*`;
  } else {
    text += `pode ser dividido em até ${qtyParcels} parcelas de *${formatPrice(lastParcel)}*`
  }
  text += `.\n\n*Formas de Pagamento:*\n⬇️⬇️⬇️⬇️⬇️⬇️⬇️\n`

  return text + data.replace(/&nbsp;/g, " ")
}
