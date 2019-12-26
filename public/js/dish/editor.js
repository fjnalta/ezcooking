function loadEditor() {
    $('#dishInputDescription').summernote({
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['fontsize', ['fontsize']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']]
        ],
        popover: {
            air: [
                ['font', ['bold', 'underline', 'clear']]
            ]
        },
        airMode: false,
        height: 300,
        minHeight: 100,
        focus: false
    });
}

function loadContent() {
    $('#dishInputDescription').summernote('code', $('#dishPreparation').text());
}