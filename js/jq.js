$(document).ready(function(){
    $('#checklist').submit(function () {
        checklistSub();
        return false;
    });

    $('input').on('change', function() {
  		$( "#subButton" ).remove();
	});
});