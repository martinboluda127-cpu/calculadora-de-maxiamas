const musculos = [
  "Cuádriceps", "Pecho", "Gemelos", "Espalda",
  "Isquiotibiales", "Psoas", "Bíceps", "Glúteo",
  "Sentadilla", "Press banca"
];

let kilosBase = {
  "Cuádriceps": 77,
  "Pecho": 42,
  "Gemelos": 140,
  "Espalda": 70,
  "Isquiotibiales": 28,
  "Psoas": 50,
  "Bíceps": 30,
  "Glúteo": 24,
  "Sentadilla": null,
  "Press banca": null
};

const porcentajes = {
  "Ligeras": [45, 40, 30, 20],
  "Medianas": [75, 70, 60, 50],
  "Máximas": [95, 90, 85, 80]
};

// Crear inputs dinámicos
const inputsDiv = document.getElementById("inputs");
musculos.forEach(m => {
  const label = document.createElement("label");
  label.innerHTML = `
    <span>${m}:</span>
    <input type="number" value="${kilosBase[m] ?? ''}" 
      onchange="updateKilos('${m}', this.value)">
  `;
  inputsDiv.appendChild(label);
});

function calcularTabla(tipo, porcentajes) {
  let html = `<table><tr><th>Músculo</th>`;
  porcentajes.forEach(p => html += `<th>${p}%</th>`);
  html += `</tr>`;

  musculos.forEach(m => {
    html += `<tr><td>${m}</td>`;
    porcentajes.forEach(p => {
      if (kilosBase[m]) {
        html += `<td>${(kilosBase[m] * p / 100).toFixed(2)}</td>`;
      } else {
        html += `<td>–</td>`;
      }
    });
    html += `</tr>`;
  });

  html += `</table>`;
  return html;
}

function render() {
  document.getElementById("tablaLigeras").innerHTML = calcularTabla("Ligeras", porcentajes.Ligeras);
  document.getElementById("tablaMedianas").innerHTML = calcularTabla("Medianas", porcentajes.Medianas);
  document.getElementById("tablaMaximas").innerHTML = calcularTabla("Máximas", porcentajes.Máximas);
}

function updateKilos(musculo, value) {
  kilosBase[musculo] = value ? parseFloat(value) : null;
  render();
}

// Exportar a Excel con SheetJS
function exportarExcel() {
  const wb = XLSX.utils.book_new();

  for (let tipo in porcentajes) {
    const data = [["Músculo", ...porcentajes[tipo].map(p => p + "%")]];
    musculos.forEach(m => {
      const fila = [m];
      porcentajes[tipo].forEach(p => {
        if (kilosBase[m]) {
          fila.push((kilosBase[m] * p / 100).toFixed(2));
        } else {
          fila.push("-");
        }
      });
      data.push(fila);
    });
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, tipo);
  }

  XLSX.writeFile(wb, "Tablas_Pesos.xlsx");
}

render();
