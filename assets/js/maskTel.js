const handlePhone = (event) => {
  const input = event.target;
  const value = input.value;
  input.value = phoneMask(value)
}

const phoneMask = (value) => {
  if (!value) return "";

  if (value.replace(/\D/g, '').length > 11) {
    return value.substring(0, value.length - 1);
  }

  value = value.replace(/\D/g, '')
  value = value.replace(/(\d{2})(\d)/, "($1) $2")
  value = value.replace(/(\d)(\d{4})$/, "$1-$2")
  return value
}


export { handlePhone }