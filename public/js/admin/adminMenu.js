/* Admin Menu Page - Frontend Scripts */
// Clean Forms
$(document).ready(function() {
    $("#inputCategoryName").val("");
    $("#inputSubCategoryName").val("");
});

// Setup Modals
function setupAddCategoryModal() {
    $("#addCategoryModalName").text("Name: " + $("#inputCategoryName").val());
}

// Category
function addCategory() {
    // create FormData so Node.js can handle it
    let formData = new FormData();
    // gather category information
    formData.append('categoryName',$("#inputCategoryName").val());
    formData.append('data',$("#categoryUploadImage")[0].files[0]);

    $.ajax({
        type: 'POST',
        url: '/category',
        data: formData,
        contentType: false,
        processData: false,
        cache: false,
        success: function(){
            // TODO - popup
            console.log('Success!');
            location.reload();
        },
        error: function() {
            // TODO - popup
            console.log('Error adding Category!');
            location.reload();
        }
    });
}


// SubCategory


// Image Upload
/**
 *
 * @param input
 */
function loadCategoryImage(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            $('#uploadCategoryImage').attr('src', e.target.result);
            $('#uploadCategoryImageModal').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function loadSubCategoryImage(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            $('#uploadSubCategoryImage').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}