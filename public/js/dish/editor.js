let editor;

function initializeEditor() {
    editor = new FroalaEditor('#dishInputDescription', {
        height: 300,
        pluginsEnabled: ['table','align','lists']
    });
}


function initializeEditorWithContent() {
    editor = new FroalaEditor('#dishInputDescription', {
        height: 300,
        pluginsEnabled: ['table','align','lists']
    }, function () {
        editor.html.set($('#preparationContent').text());
    });
}