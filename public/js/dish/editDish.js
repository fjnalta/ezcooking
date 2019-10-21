function updateRecipe(id) {
    // create FormData so Node.js can handle it
    let formData = new FormData();

    // gather recipe information
    formData.append('name',$("#dishInputName").val());
    formData.append('shortDescription', $("#dishInputShortDescription").val());
    formData.append('duration', $("#dishInputDuration").val());
    formData.append('category', $("#dropdownCategory").text().trim());
    formData.append('subCategory', $("#dropdownSubCategory").text().trim());
    formData.append('ingredients', JSON.stringify($("#jsGrid").jsGrid("option", "data")));
    formData.append('description', $("#dishInputDescription").val());

    // only append image if a new one is set
    if($("#dishUploadImage")[0].files[0] !== undefined) {
        formData.append('data',$("#dishUploadImage")[0].files[0]);
    }

    // Disable button to prevent double postings
    $("#buttonSendRecipe").prop('disabled', true);

    // Ajax call to backend
    $.ajax({
        url: '/dish/' + id,
        data: formData,
        contentType: false,
        processData: false,
        cache: false,
        type: 'POST',
        success: function(){
            // Redirect frontend
//            location.replace(data);
            location.replace('/dish/' + id);
        }
    });
}