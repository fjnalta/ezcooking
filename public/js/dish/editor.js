let editor;

function initializeEditor() {
    editor = new FroalaEditor('#dishInputDescription', {
        height: 300
    });
}


function initializeEditorWithContent() {
    editor = new FroalaEditor('#dishInputDescription', {
        height: 300
    });
    editor.html.get();
    //editor.html.set($('#preparationContent').text());
}