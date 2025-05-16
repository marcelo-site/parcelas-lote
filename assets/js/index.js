import { mascaraMoeda } from "./inputMoeda.js";
import { handlePhone } from "./maskTel.js";
import { textProposit } from "./textProposit.js";
import { formatPrice, getParamUrl } from "./utils.js";

const form = document.querySelector('#form');
const { measure, value, entry, interest, notInterest, qtyParcel } = form

const modal = document.querySelector("#modal");

const pageParcels = document.querySelector("#parcels");
const contentParcels = pageParcels.querySelector(".content-parcels");
const exitPageParcels = pageParcels.querySelector("i");
const share = pageParcels.querySelector("button");
const inputZap = modal.querySelector("input");

const getValue = (input) => Number(input.value.replace(/\D/g, "")) / 100;

const handleValueParcel = () => {
    const valueFinance = getValue(value) - getValue(entry);
    const dataArr = [];
    const maxParcel = qtyParcel.value;
    const taxa = +interest.value / 100;
    const notInterestValue = +notInterest.value

    for (let index = 2; index <= maxParcel; index++) {
        const valueParcel = index <= notInterestValue ?
            valueFinance / index :
            valueFinance * (Math.pow((1 + taxa), index) * taxa) / (Math.pow((1 + taxa), index) - 1);

        dataArr.push({
            valueParcel,
            qty: index,
            totalPay: valueParcel * index,
            juros: (valueParcel * index) - valueFinance
        })
    }
    return dataArr;
}

const calcular = () => {
    const parcelas = handleValueParcel();
    contentParcels.innerHTML = ""

    parcelas.forEach(({ qty, valueParcel, juros }, i) => {
        const div = document.createElement("div");
        div.classList.add('flex');
        if (i % 2 !== 0) div.classList.add("backGray");

        const button = document.createElement("button");
        button.innerHTML = `<i class="bi bi-trash"></i>`
        button.addEventListener("click", () => {
            div.classList.add("hide");
            setTimeout(() => {
                contentParcels.removeChild(div)
            }, 300)
        });
        const span = document.createElement("span");
        span.innerHTML = `${qty}x de ${formatPrice(valueParcel)} ${!juros ? "sem juros" : "com juros"}`;

        div.appendChild(span);
        div.appendChild(button);
        contentParcels.appendChild(div)
    });
}

const regexValueLastParcel = /\b\d{1,3}(\.\d{3})*,\d{2}\b/
const getTextParcels = () => {
    const nodeParcels = document.querySelector(".content-parcels").querySelectorAll("div > span");
    const items = Array.prototype.map.call(nodeParcels, item => item.innerHTML);
    const lastParcel = items[items.length - 1].match(regexValueLastParcel);

    const text = textProposit({
        measure: measure.value,
        notInterest: notInterest.value,
        qtyParcels: qtyParcel.value,
        data: items.join("\n"),
        entry: getValue(entry),
        lastParcel: + lastParcel[0].replace(".", "").replace(",", "."),
    })

    return text
}

const submit = (number) => {
    const num = number.replace(/\D/g, "");
    if (num.length < 10) return;

    const text = encodeURIComponent(getTextParcels());
    window.open(`https://api.whatsapp.com/send/?phone=55${num}&text=${text}`, "_blank");
}

const navigatorShare = async () => {
    const shareData = {
        title: "Parcelamento de Lote",
        text: getTextParcels(),
        // url: "https://developer.mozilla.org",
    };

    try {
        await navigator.share(shareData);
    } catch (err) {
        resultPara.textContent = "Error: " + e;
    }
}
modal.querySelector("button").addEventListener("click", navigatorShare);

form.addEventListener("submit", (e) => {
    e.preventDefault();

    calcular();
    pageParcels.classList.add("showParcels");
})

exitPageParcels.addEventListener("click", () => {
    pageParcels.classList.remove("showParcels");
})

inputZap.addEventListener("input", handlePhone)

const handleModal = (modalEl) => {
    const toggleModal = () => modalEl.classList.toggle("none");
    modalEl.addEventListener("click", toggleModal);
    modalEl.querySelector("button")
        ?.addEventListener("click", toggleModal);
    modalEl.querySelector("div")
        ?.addEventListener("click", (e) => {
            e.stopPropagation();
        })
}

share.addEventListener("click", () => modal.classList.remove("none"));
modal.querySelector("i").addEventListener("click", () => {
    submit(inputZap.value.replace(/\D/g, ""))
})

const handleValue = (input) => {
    const price = getValue(value);
    const entryValue = getValue(entry);

    if (entryValue > price) {
        entry.value = price * 100;
        mascaraMoeda(entry)
    }
    mascaraMoeda(input);
}

document.addEventListener("DOMContentLoaded", () => {
    handleModal(modal);
    const interestInit = getParamUrl("juro");
    interest.value = interestInit ?? 2;
    const valueInit = getParamUrl("valor");
    value.addEventListener("input", ({ target }) => handleValue(target));
    entry.addEventListener("input", ({ target }) => handleValue(target));
    value.value = "R$ " + (valueInit ? valueInit : "0,00");
    document.querySelector("#yearCopy").innerHTML = (new Date()).getFullYear();
});
