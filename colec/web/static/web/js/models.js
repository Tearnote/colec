const CollectionModel = Backbone.Model.extend({
    defaults: {
        name: null,
        description: null,
        tags_enabled: null,
    }
});
const CollectionCollection = Backbone.Collection.extend({
    url: "/api/collections/",
    model: CollectionModel,
});

let collections = new CollectionCollection();
collections.fetch().then(function() {
  console.log(collections.length);
});
