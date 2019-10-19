function deleteDish(id) {
    $.ajax({
        type: 'DELETE',
        url: '/dish/' + id,
        success: function(msg){
            // TODO - popup
            console.log('Dish deleted!');
            location.reload();
        },
        error: function() {
            // TODO - popup
            console.log('error');
        }
    });
}