/**
 * Send the created Recipe to the Server
 */
function sendRecipe() {
    // create FormData so Node.js can handle it
    let formData = new FormData();

    console.log(editor.html.get());

    // gather recipe information
    formData.append('name',$("#dishInputName").val());
    formData.append('shortDescription', $("#dishInputShortDescription").val());
    formData.append('duration', $("#dishInputDuration").val());
    formData.append('category', $("#dropdownCategory").text());
    formData.append('subCategory', $("#dropdownSubCategory").text());
    formData.append('ingredients', JSON.stringify($("#jsGrid").jsGrid("option", "data")));
    formData.append('description', editor.html.get());
    formData.append('data',$("#dishUploadImage")[0].files[0]);

    // Ajax call to backend
    $.ajax({
        url: '/dish',
        data: formData,
        contentType: false,
        processData: false,
        cache: false,
        type: 'POST',
        success: function(data){
            // Redirect frontend
            window.location.replace(data);
        }
    });

    // Disable button to prevent double postings
    $("#buttonSendRecipe").prop('disabled', true);
}