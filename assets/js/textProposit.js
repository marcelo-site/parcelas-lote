export const textProposit = (measure, notInterest, qtyParcels, data) => {
  const measureSplit = measure.split("x");
  let text = `Lote medindo ${measureSplit[0]} metros de largura por ${measureSplit[1]} metros de comprimento`;

  if (notInterest) {
    text += `, pode ser dividido em *${notInterest} parcelas sem juros* ou em até *${qtyParcels} parcelas* `;
  } else {
    text += `pode ser dividido em até *${qtyParcels} parcelas*`
  }
  text += `.\n\nDetalhamento das Parcelas abaixo:\n-----------------------------------\n`

  return text + data.replace(/&nbsp;/g, " ")
}