import type { Paciente } from "../types/Paciente";


interface EditableFieldProps {
  label: string;
  name: keyof Paciente;
  value: any;
  editando: boolean;
  onChange: (name: keyof Paciente, value: any) => void;
  tipo?: "text" | "date" | "textarea" | "select";
  opciones?: { label: string; value: any }[];
  anchoCompleto?: boolean;
  formatter?: (value: any) => string;
}

export const EditableField = ({
  label,
  name,
  value,
  editando,
  onChange,
  tipo = "text",
  opciones = [],
  anchoCompleto = false,
  formatter,
}: EditableFieldProps) => {
  const renderValor = () => {
    if (!value) return <strong className="no-aplica">No aplica</strong>;
    return <strong>{formatter ? formatter(value) : value}</strong>;
  };

  return (
    <div className={`dato-columna ${anchoCompleto ? "ancho-completo" : ""}`}>
      <span>{label}</span>

      {editando ? (
        tipo === "textarea" ? (
          <textarea
            value={value ?? ""}
            onChange={(e) => onChange(name, e.target.value)}
          />
        ) : tipo === "select" ? (
          <select
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
          >
            {opciones.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={tipo}
            value={value ?? ""}
            onChange={(e) => onChange(name, e.target.value)}
          />
        )
      ) : (
        renderValor()
      )}
    </div>
  );
};
