const formatPrice = (value) => {
  const num = typeof value === "string" ? Number(value) : value
  return num.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL"
  })
}

const handleURL = (key, param) => {
  const path = window.location.toString();
  let url = new URL(path);
  let params = new URLSearchParams(url.search);
  params.set(key, param);

  history.replaceState({}, "", path.split("?")[0] + "?" + params);
}

const getParamUrl = (key) => {
  const path = window.location.toString();
  let url = new URL(path);
  let params = new URLSearchParams(url.search);
  return params.get(key)
}

export { formatPrice, handleURL, getParamUrl, }