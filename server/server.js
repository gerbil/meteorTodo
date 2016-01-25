Tasks = new Mongo.Collection("tasks");

// This code only runs on the server
// Only publish tasks that are public or belong to the current user
Meteor.publish("tasks", function () {
    return Tasks.find({
        $or: [
            {private: {$ne: true}},
            {owner: this.userId}
        ]
    });
});


Tasks.allow({
    insert: function (userId, doc) {
        return !!userId
    },
    update: function (userId, doc) {
        if (userId && doc.userId == userId) return true;
        return false;
    },
    remove: function (userId, doc) {
        if (userId && doc.userId == userId) return true;
        return false;
    }
});

Tasks.deny({
    remove: function (userId, doc) {
        //can't remove locked tasks
        return doc.locked;
    }
});

