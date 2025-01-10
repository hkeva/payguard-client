import { jsPDF } from "jspdf";

export const generateInvoicePDF = (
  id: string,
  title: string,
  amount: string,
  status: string
) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Invoice", 20, 20);
  doc.setFontSize(12);
  doc.text(`Invoice ID: ${id}`, 20, 40);
  doc.text(`Title: ${title}`, 20, 50);
  doc.text(`Amount: ${amount}`, 20, 60);
  doc.text(`Status: ${status}`, 20, 70);

  doc.save(`invoice_${id}.pdf`);
};
