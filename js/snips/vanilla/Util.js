function pause(a) {
    var limit = (Date.now() || (new Date().getTime())) + 1E3 * a;
    while (limit) {
        if (limit <= (Date.now() || (new Date().getTime())))
            break;
    }
}