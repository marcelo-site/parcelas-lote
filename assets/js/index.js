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

const getEntry = (data) => {
    const entryValue = Number(entry.value.replace(/\D/g, "")) / 100;
    if (data) return entryValue;
    return uniquePay.value === "1" ? 0 : entryValue;
}

const getValue = () => {
    return Number(value.value.replace(/\D/g, "")) / 100;
}

const handleValueParcel = () => {
    const entry = getEntry(true);
    const valueFinance = getValue() - entry;
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

const getTextParcels = () => {
    const nodeParcels = document.querySelector(".content-parcels").querySelectorAll("div > span");
    const items = Array.prototype.map.call(nodeParcels, item => item.innerHTML);
    const text = textProposit(
        measure.value,
        notInterest.value,
        items.join("\n")
    )

    return text
}

const submit = (number) => {
    if (number.replace(/\D/g, "").length < 10) {
        return
    }
    const text = getTextParcels();
    window.open(`https://wa.me/55${number}?text=${encodeURIComponent(text)}`, "_blank");
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

const handleValue = (element) => {
    const price = getValue();
    const value = element.value.replace(/\D/g, "");

    if (+value > price * 100) element.value = price * 100;
    mascaraMoeda(element);
}

document.addEventListener("DOMContentLoaded", () => {
    handleModal(modal);
    const interestInit = getParamUrl("juro");
    interest.value = interestInit ?? 2;
    const valueInit = getParamUrl("valor");
    // value.addEventListener("change", ({ target }) => handleValue(target));
    value.addEventListener("input", ({ target }) => handleValue(target));
    entry.addEventListener("input", ({ target }) => handleValue(target));
    value.value = "R$ " + (valueInit ? valueInit : "0,00");
    document.querySelector("#yearCopy").innerHTML = (new Date()).getFullYear();
});
