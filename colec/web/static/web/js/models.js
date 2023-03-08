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

const CollectionListItemView = Backbone.View.extend({
    tagName: "li",
    template: _.template(`
        <p>Name: <%= name %></p>
        <p>Description: <%= description %></p>
        <p>Tags enabled: <%= tags_enabled %></p>
    `),
    render() {
        const html = this.template(this.model.toJSON());
        this.$el.html(html);
        return this;
    },
});
const CollectionListView = Backbone.View.extend({
    el: "#collection-list",
    initialize() {
        this.listenTo(this.collection, "sync", this.render);
    },
    render() {
        this.$el.empty();

        this.collection.each(function(model) {
            const item = new CollectionListItemView({model: model});
            this.$el.append(item.render().$el);
        }, this);
        return this;
    },
});
const collectionList = new CollectionCollection();
const collectionView = new CollectionListView({collection: collectionList});
collectionList.fetch();
