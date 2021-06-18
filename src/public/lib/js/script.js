$(function() {
    setTimeout(
        function (){
            $('.alert').alert('close');
        }, 2500);

    $('*[data-href]').click(function(){
        window.location = $(this).data('href');
        return false;
    });
});
