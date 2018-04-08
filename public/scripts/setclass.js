// idk
(function() {

    function updateClassesFrom(triggerElement) {
        const trigger = $(triggerElement);
        if(trigger.prop('checked')) {
            $(trigger.data("target")).removeClass().addClass(trigger.data("setclass"));
        }
    }

    $("[data-setclass]").each((i, element) => updateClassesFrom(element));
    $("[data-setclass]").change( event => updateClassesFrom(event.target));

})();
