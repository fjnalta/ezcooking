$(document).ready( function () {
    // get selected categories
    let categories = [];
    $('#tags span').each(function () {
        let current = {};
        current.category = $(this).text().split(" : ", 2)[0];
        current.subcategory = $(this).text().split(" : ", 2)[1];
        categories.push(current);
    });

    // mark entries in selectpicker
    for(let i = 0; i < $('#categorySelect optgroup').length; i++) {
        for(let j = 0; j < categories.length; j++) {
            if(categories[j].category === $('#categorySelect optgroup')[i].label) {
                $('#categorySelect optgroup').eq(i).children('option').each(function () {
                    if (this.text == categories[j].subcategory) {
                        $(this).attr('selected', true);
                    }
                });
            }
        }
    }

    // handle changes
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
    });
});


function updateRecipe(id) {
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
    formData.append('subCategories', JSON.stringify(categories));
    formData.append('ingredients', JSON.stringify($("#jsGrid").jsGrid("option", "data")));
    formData.append('description', $('#dishInputDescription').summernote('code'));

    // only append image if a new one is set
    let uploadImage = $("#dishUploadImage")[0].files[0];
    if(uploadImage !== undefined) {
        formData.append('data',uploadImage);
    }

    // Disable button to prevent double postings
    $("#buttonSendRecipe").prop('disabled', true);

    // TODO - implement grecaptcha here
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
            location.replace('/dish/' + id);
        }
    });
}