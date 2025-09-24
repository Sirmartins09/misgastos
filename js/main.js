 const form = document.getElementById("gastoForm");
    const tablaGisella = document.querySelector("#tablaGisella tbody");
    const tablaMartin = document.querySelector("#tablaMartin tbody");
    const totalGisellaEl = document.getElementById("totalGisella");
    const totalMartinEl = document.getElementById("totalMartin");
    const totalGeneralEl = document.getElementById("totalGeneral");
    const mesSelect = document.getElementById("mesSelect");

    let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    let chart;

    function obtenerMes(fecha) {
      const d = new Date(fecha);
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, "0")}`;
    }

    function actualizarMeses() {
      const meses = [...new Set(gastos.map(g => g.mes))];
      mesSelect.innerHTML = "";
      meses.forEach(m => {
        const option = document.createElement("option");
        option.value = m;
        option.textContent = m;
        mesSelect.appendChild(option);
      });
      if (meses.length > 0) mesSelect.value = meses[meses.length - 1];
      mostrarGastos();
    }

    function mostrarGastos() {
      tablaGisella.innerHTML = "";
      tablaMartin.innerHTML = "";
      let totalGisella = 0;
      let totalMartin = 0;

      gastos.filter(g => g.mes === mesSelect.value).forEach(g => {
        const fila = `<tr>
          <td>${g.fecha}</td>
          <td>${g.descripcion}</td>
          <td>$${g.monto.toFixed(2)}</td>
          <td>${g.categoria}</td>
        </tr>`;

        if (g.persona === "Gisella") {
          tablaGisella.innerHTML += fila;
          totalGisella += g.monto;
        } else if (g.persona === "Martin") {
          tablaMartin.innerHTML += fila;
          totalMartin += g.monto;
        }
      });

      totalGisellaEl.textContent = totalGisella.toFixed(2);
      totalMartinEl.textContent = totalMartin.toFixed(2);
      totalGeneralEl.textContent = (totalGisella + totalMartin).toFixed(2);

      actualizarGrafico(totalGisella, totalMartin);
    }

    function actualizarGrafico(totalGisella, totalMartin) {
      const ctx = document.getElementById("graficoGastos").getContext("2d");
      if (chart) chart.destroy();
      chart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Gisella", "Martin"],
          datasets: [{
            data: [totalGisella, totalMartin],
            backgroundColor: ["#FF6384", "#36A2EB"]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "bottom" }
          }
        }
      });
    }

    form.addEventListener("submit", function(e) {
      e.preventDefault();

      const fecha = document.getElementById("fecha").value;
      const descripcion = document.getElementById("descripcion").value;
      const monto = parseFloat(document.getElementById("monto").value);
      const categoria = document.getElementById("categoria").value;
      const persona = document.getElementById("persona").value;

      const mes = obtenerMes(fecha);

      const nuevoGasto = { fecha, descripcion, monto, categoria, persona, mes };
      gastos.push(nuevoGasto);

      localStorage.setItem("gastos", JSON.stringify(gastos));

      actualizarMeses();
      form.reset();
    });

    mesSelect.addEventListener("change", mostrarGastos);

    actualizarMeses();

    function mostrarGastos() {
  tablaGisella.innerHTML = "";
  tablaMartin.innerHTML = "";
  let totalGisella = 0;
  let totalMartin = 0;

  gastos.filter(g => g.mes === mesSelect.value).forEach((g, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${g.fecha}</td>
      <td>${g.descripcion}</td>
      <td>$${g.monto.toFixed(2)}</td>
      <td>${g.categoria}</td>
      <td><button class="eliminar-btn" data-index="${index}">❌</button></td>
    `;

    if (g.persona === "Gisella") {
      tablaGisella.appendChild(fila);
      totalGisella += g.monto;
    } else if (g.persona === "Martin") {
      tablaMartin.appendChild(fila);
      totalMartin += g.monto;
    }
  });

  totalGisellaEl.textContent = totalGisella.toFixed(2);
  totalMartinEl.textContent = totalMartin.toFixed(2);
  totalGeneralEl.textContent = (totalGisella + totalMartin).toFixed(2);

  actualizarGrafico(totalGisella, totalMartin);
  agregarEventosEliminar();
}

function agregarEventosEliminar() {
  document.querySelectorAll(".eliminar-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      gastos.splice(index, 1);
      localStorage.setItem("gastos", JSON.stringify(gastos));
      actualizarMeses();
    });
  });
}