$(document).ready( function () {
    $('#categorySelect').on('change', function(){
        let tags = '';
        let selected = $(this).find("option:selected");
        let arrSelected = [];
        selected.each(function(){
            arrSelected.push( {
                subcategory: $(this).text(),
                category : $(this).attr("value")
            });
        });

        for(let i = 0; i < arrSelected.length; i++) {
            tags += '<span class="badge badge-success">' + arrSelected[i].category + ': ' + arrSelected[i].subcategory + '</span> '
        }

        $('#tags').empty();
        $('#tags').append(tags);

        if(arrSelected.length > 0) {
            $("#buttonSendRecipe").prop('disabled', false);
        } else {
            $("#buttonSendRecipe").prop('disabled', true);
        }
    });
});

/**
 * Send the created Recipe to the Server
 */
function sendRecipe() {
    // get selected categories
    let categories = [];
    $('#categorySelect').find("option:selected").each(function () {
        categories.push({
            subcategory : $(this).text(),
            category : $(this).attr("value")
        });
    });

    // create FormData so Node.js can handle it
    let formData = new FormData();

    // gather recipe information
    formData.append('name',$("#dishInputName").val());
    formData.append('shortDescription', $("#dishInputShortDescription").val());
    formData.append('duration', $("#dishInputDuration").val());
    formData.append('categories', JSON.stringify(categories));
    formData.append('ingredients', JSON.stringify($("#jsGrid").jsGrid("option", "data")));
    formData.append('description', $('#dishInputDescription').summernote('code'));
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
            // Disable button to prevent double postings
            $("#buttonSendRecipe").prop('disabled', true);
            // Redirect frontend
            window.location.replace(data);
        }
    });
}