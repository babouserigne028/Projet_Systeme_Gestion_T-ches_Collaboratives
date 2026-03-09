export default function Input({ icon, error, type = "text", ...props }) {
  return (
    <Field label={props.label} icon={icon} error={error}>
      <input
        type={type}
        className="esmt-input"
        style={{ paddingLeft: icon ? "2.4rem" : "1rem" }}
        {...props}
        label={undefined}
      />
    </Field>
  );
}
