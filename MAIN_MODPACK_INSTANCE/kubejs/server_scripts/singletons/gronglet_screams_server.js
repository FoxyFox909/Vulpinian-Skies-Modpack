onEvent('entity.spawned', event =>{
    
    let itemId = event.getEntity().item

    if (itemId == null) {
        return;
    } else if (itemId == 'vulpinian_skies_core:grongle_sugar') {
        event.getEntity().playSound('undergarden:block.gronglet.place')
    }    

});