// $.ajax({
//     type: 'GET',
//     url: '/indices',
//     success: function(data){
//         initializeSearch(data);
//     },
//     dataType: "json"
// });
//
// function initializeSearch(data) {
//     // Prepare data
//     console.log(data);
//     console.log(data.categories);
//
//
//
//     $.typeahead({
//         input: '.js-typeahead-country_v2',
//         minLength: 1,
//         maxItem: 20,
//         order: "asc",
//         href: "https://en.wikipedia.org/?title={{display}}",
//         template: "{{display}} <small style='color:#999;'>{{group}}</small>",
//         source: {
//             dish: {
//                 data: {
//                     q: '{{name}}'
//                 },
//                 path: data.dishes
//             },
//             categories: {
//                 data: {
//                     q: '{{name}}'
//                 },
//                 path: data.categories
//             },
//             subcategories: {
//                 data: {
//                     q: '{{name}}'
//                 },
//                 path: data.subcategories
//             }
//         },
//         callback: {
//             onInit: function (node) {
//                 console.log('Search initialized');
//             },
//             onNavigateAfter: function (node, lis, a, item, query, event) {
//                 if (~[38,40].indexOf(event.keyCode)) {
//                     var resultList = node.closest("form").find("ul.typeahead__list"),
//                         activeLi = lis.filter("li.active"),
//                         offsetTop = activeLi[0] && activeLi[0].offsetTop - (resultList.height() / 2) || 0;
//
//                     resultList.scrollTop(offsetTop);
//                 }
//
//             },
//             onClickAfter: function (node, a, item, event) {
//
//                 event.preventDefault();
//
//                 var r = confirm("You will be redirected to:\n" + item.href + "\n\nContinue?");
//                 if (r == true) {
//                     window.open(item.href);
//                 }
//
//                 $('#result-container').text('');
//
//             },
//             onResult: function (node, query, result, resultCount) {
//                 if (query === "") return;
//
//                 var text = "";
//                 if (result.length > 0 && result.length < resultCount) {
//                     text = "Showing <strong>" + result.length + "</strong> of <strong>" + resultCount + '</strong> elements matching "' + query + '"';
//                 } else if (result.length > 0) {
//                     text = 'Showing <strong>' + result.length + '</strong> elements matching "' + query + '"';
//                 } else {
//                     text = 'No results matching "' + query + '"';
//                 }
//                 $('#result-container').html(text);
//
//             },
//             onMouseEnter: function (node, a, item, event) {
//
//                 if (item.group === "country") {
//                     $(a).append('<span class="flag-chart flag-' + item.display.replace(' ', '-').toLowerCase() + '"></span>')
//                 }
//
//             },
//             onMouseLeave: function (node, a, item, event) {
//
//                 $(a).find('.flag-chart').remove();
//
//             }
//         }
//     });
// }