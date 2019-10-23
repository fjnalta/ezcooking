function loadEditor() {
    $('#dishInputDescription').summernote({
        toolbar: [
            // [groupName, [list of button]]
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['fontsize', ['fontsize']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']]
        ],
        height: 300,
        minHeight: 100,
        focus: false
    });
}

function loadContent() {
    console.log($('#dishPreparation').text());
    $('#dishInputDescription').summernote('code', $('#dishPreparation').text());
}