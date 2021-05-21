$(document).ready( function () {
    let engine = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name', 'short_description'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: '../search.json',
        remote: {
            url: '../search.json',
            wildcard: '%QUERY'
        }
    });

    engine.initialize();

    engine.clear();
    engine.initialize(true);

    $('.typeahead').typeahead(
        null, {
        limit: 10,
        name: 'dishes',
        display: function (item) {
            if(item.short_description !== ' ' && item.short_description !== '') {
                return item.name + ' - ' + item.short_description;
            } else {
                return item.name;
            }
        },
        source: engine.ttAdapter()
    });

    // setup redirect on click
    $('.typeahead').on('typeahead:selected', function(evt, data) {
        window.location.href = '/dish/' + data.id;
    })
});