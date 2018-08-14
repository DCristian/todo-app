require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

const mongoose = require('./db/mangoose');
const {Todo} = require('./models/todo');

const app = express();
const port = process.env.PORT;

const asyncWrap = fn => (req, res, next) => {
    Promise.resolve()
        .then(() => fn(req, res, next))
        .catch(next);
};

mongoose.connect();
app.use(bodyParser.json());

app.route('/todos')
    .get(asyncWrap(async (req, res) => {
        let todos = await Todo.find();
        res.send({todos});
    }))
    .post(asyncWrap(async (req, res) => {
        let todo = new Todo({
            text: req.body.text
        });

        let doc = await todo.save();
        res.send(doc);
    }));

app.route('/todos/:id')
    .get(asyncWrap(async (req, res) => {
        const id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

        let todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).send();
        }

        res.send(todo);
    }))
    .patch(asyncWrap(async (req, res) => {
        const id = req.params.id;
        let body = _.pick(req.body, ['text', 'completed']);

        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

        let completed = false;
        body.completedAt = null;

        if (_.isBoolean(body.completed) && body.completed) {
            completed = body.completed;
            body.completedAt = new Date().getTime();
        }

        body.completed = completed;

        let todo = await Todo.findByIdAndUpdate(id, {$set: body}, {new: true});
        if (!todo) {
            return res.status(404).send();
        }
    }))
    .delete(asyncWrap(async (req, res) => {
        const id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

        let todo = await Todo.findByIdAndRemove(id);
        if (!todo) {
            return res.status(404).send();
        }

        res.send(todo);
    }));

app.use((err, req, res, next) => {
    res.status(400).send(err);
});

app.listen(port, () => {
   console.log(`Started on port ${port}.`);
});

module.exports = {app};
