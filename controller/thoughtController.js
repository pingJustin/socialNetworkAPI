const { Thought, User } = require("../models");

const thoughtController = {

//create thought of a user
createThought(req, res) {
  Thought.create(req.body)
  .then((dbThoughtData) => {
      return User.findOneAndUpdate(
          {_id:req.body.userID},
          {$push:{ thoughts:dbThoughtData._id}},
          {new:true}

      )
  })
  .then(userData => res.json(userData))
  .catch((err) => res.status(500).json(err));
},

//get a thought by id
getThoughtById({ params }, res) {
  Thought.findOne({ _id: params.id })
  .then((dbThoughtData) => {
    // if no thought is found
    if (!dbThoughtData) {
      res.status(404).json({ message: "No thought with this ID" });
      return;
    }
    res.json(dbThoughtData);
  })
},

//get all thoughts
getAllThoughts(req, res) {
    Thought.find().then((thought) => res.json(thought)).catch((err) => res.status(500).json(err));
},

//update a thought by it's id
updateThought(req, res) {
    Thought.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: req.body
    }, {
        runValidators: true,
        new: true
    }).then((thought) => {
        !thought ? res.status(404).json({message: 'No thought by ID'}) : res.json(thought);

    }).catch((err) => res.status(500).json(err));
},

//delete a thought
deleteThought(req, res) {
    Thought.findOneAndDelete({_id: req.params.id})
    .then((thought) => {
        if(!thought){
            res.status(404).json({message: 'No thought with that ID'}) 
        }      
        
        return User.findOneAndUpdate(
            {_id:req.body.userID},
            {$pull:{thoughts:thought._id}},
            {new:true}
        )
   }).then(() => res.json({message: 'User and associated apps deleted!'})).catch((err) => res.status(500).json(err));
},

//add a reaction
addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body} },
      { runValidators: true, new: true }
    )
    .then((thought) =>
      !thought
        ? res
            .status(404)
            .json({ message: 'No friend found with that ID :(' })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
},

//delete a reaction
deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId} } },
      { runValidators: true, new: true }
      // { new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID :(' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
}

module.exports = thoughtController;
