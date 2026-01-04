export function invoiceHTML(data) {
  const rows = data.items.map((i, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${i.deliveryDate}</td>
      <td>${i.orderNo}</td>
      <td>${i.destination}</td>
      <td>${i.vehicleNo}</td>
      <td style="text-align:right">${i.baseRate.toFixed(2)}</td>
      <td style="text-align:right">${i.extraCharge.toFixed(2)}</td>
      <td style="text-align:right">${i.total.toFixed(2)}</td>
    </tr>
  `).join("");

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body {
    font-family: Arial, sans-serif;
    font-size: 9px;
    margin: 20mm;
  }

  .header {
    display: flex;
    justify-content: space-between;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }

  th {
    background: #5b5a2e;
    color: white;
    border: 1px solid #555;
    padding: 6px;
    font-size: 9px;
  }

  td {
    border: 1px solid #999;
    padding: 5px;
    text-align: center;
  }

  .meta {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
  }

  .totals {
    width: 260px;
    float: right;
    margin-top: 20px;
  }

  .totals td {
    border: none;
    padding: 4px;
    font-size: 9.5px;
  }

  .stamp {
    position: absolute;
    right: 50px;
    bottom: 120px;
    width: 90px;
  }

  @page {
    size: A4;
    margin: 20mm;
  }
</style>
</head>

<body>

<div class="header">
  <div>
    <img src="${data.logo}" height="45"><br><br>
    <strong>NSS MOVERZ ENTERPRISE</strong><br>
    Transport & Logistics Services<br>
    Specialist in 45FT Side Curtain<br><br>
    ${data.companyAddress}
  </div>
</div>

<div class="meta">
  <div>
    <strong>Invoice #</strong> ${data.invoiceNumber}<br>
    <strong>Invoice Date</strong> ${data.invoiceDate}
  </div>

  <div>
    <strong>BILL TO</strong><br>
    ${data.billTo}
  </div>
</div>

<table>
<thead>
<tr>
  <th>NO.</th>
  <th>DELIVERY DATE</th>
  <th>ORDER NO.</th>
  <th>DESTINATION</th>
  <th>VEH NO.</th>
  <th>TRIP CHARGES (BASE RATE)</th>
  <th>OTHER CHARGES (EXCEED TIMING)</th>
  <th>TOTAL AMOUNT (RM)</th>
</tr>
</thead>

<tbody>
${rows}
</tbody>
</table>

<table class="totals">
<tr>
  <td>SUBTOTAL</td>
  <td style="text-align:right">${data.subtotal.toFixed(2)}</td>
</tr>
<tr>
  <td>TAX</td>
  <td style="text-align:right">0.00</td>
</tr>
<tr>
  <td><strong>TOTAL (RM)</strong></td>
  <td style="text-align:right"><strong>${data.subtotal.toFixed(2)}</strong></td>
</tr>
</table>

<img class="stamp" src="${data.stamp}">

</body>
</html>
`;
}