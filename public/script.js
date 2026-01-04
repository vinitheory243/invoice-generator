const rows = document.getElementById("rows");
const totalEl = document.getElementById("grandTotal");

function addRow() {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="date" required></td>
    <td><input required></td>
    <td><input required></td>
    <td><input required></td>
    <td><input type="number" step="0.01" value="0" oninput="calc()"></td>
    <td><input type="number" step="0.01" value="0" oninput="calc()"></td>
    <td class="rowTotal">0.00</td>
    <td><button type="button" onclick="this.closest('tr').remove(); calc()">✕</button></td>
  `;
  rows.appendChild(tr);
}

function calc() {
  let total = 0;
  document.querySelectorAll("#rows tr").forEach(row => {
    const base = Number(row.children[4].firstChild.value);
    const extra = Number(row.children[5].firstChild.value);
    const rowTotal = base + extra;
    row.querySelector(".rowTotal").innerText = rowTotal.toFixed(2);
    total += rowTotal;
  });
  totalEl.innerText = total.toFixed(2);
}

document.getElementById("invoiceForm").onsubmit = async e => {
  e.preventDefault();

  const items = [...rows.children].map(r => ({
    deliveryDate: r.children[0].firstChild.value,
    orderNo: r.children[1].firstChild.value,
    destination: r.children[2].firstChild.value,
    vehicleNo: r.children[3].firstChild.value,
    baseRate: Number(r.children[4].firstChild.value),
    extraCharge: Number(r.children[5].firstChild.value),
    total: Number(r.children[4].firstChild.value) + Number(r.children[5].firstChild.value)
  }));

  const payload = {
    invoiceNumber: document.getElementById("invoiceNumber").value,
    invoiceDate: document.getElementById("invoiceDate").value,
    billTo: document.getElementById("billTo").value.replace(/\n/g, "<br>"),
    companyAddress: "YOUR COMPANY ADDRESS HERE",
    items,
    subtotal: Number(totalEl.innerText)
  };

  const res = await fetch("/api/generate-invoice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const blob = await res.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "invoice.pdf";
  link.click();
};

addRow();