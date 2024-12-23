export default function formatDate(date, format) {
    if (!date) return "";

    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    const userFormat = format || localStorage.getItem('dateFormat') || 'fr';

    switch (userFormat) {
        case "us":
            return `${month}/${day}/${year}`;
        case "fr":
        default:
            return `${day}/${month}/${year}`;
    }
}
