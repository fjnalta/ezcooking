function loadCategoryImage(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            $('#uploadCategoryImage').attr('src', e.target.result);
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