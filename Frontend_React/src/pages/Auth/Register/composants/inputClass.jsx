export default function inputClass(field, errors = {}) {
  return `esmt-input${errors[field] ? " border-red-400" : ""}`;
}
