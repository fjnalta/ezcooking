/**
 * Converts Epoch Timestamp to Date in Frontend
 */
function convertCreationDate(creation_date) {
    let date = new Date(creation_date);
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = date.toLocaleDateString('de-DE', options);
    $("#creation_date").text(formattedDate);
}