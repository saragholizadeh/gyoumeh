function separete (tags) {
    if (!tags) {
        tags = [];
      } else {
        tags = tags.split(/,| /);
        for (let i = 0; i < tags.length; i++) {
          var tag = tags[i];
          if (tag == "") {
            tags.splice(i, 1);
          }
        }
    };
    return tags;
}

module.exports = separete;