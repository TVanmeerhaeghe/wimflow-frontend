export default function formatDate(date, format = "dd/MM/yyyy") {
    if (!date) return "";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "Date invalide";

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    switch (format) {
        case "yyyy-MM-dd":
            return `${year}-${month}-${day}`;
        case "dd/MM/yyyy":
        default:
            return `${day}/${month}/${year}`;
    }
}
